'use strict';

const fs = require('fs/promises');
const path = require('path');

const IGNORED_DIRECTORIES = new Set([
  '.cache',
  '.cursor',
  '.fdk',
  '.git',
  '.next',
  'build',
  'coverage',
  'dist',
  'node_modules'
]);

async function walkFiles(rootDir, extensions) {
  const files = [];

  async function visit(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORIES.has(entry.name) && !entry.name.startsWith('.')) {
          await visit(fullPath);
        }
        continue;
      }

      if (entry.isFile() && extensions.includes(path.extname(entry.name).toLowerCase())) {
        const content = await fs.readFile(fullPath, 'utf8').catch(() => null);
        if (content !== null) {
          files.push({
            relativePath: path.relative(rootDir, fullPath).split(path.sep).join('/'),
            content
          });
        }
      }
    }
  }

  await visit(rootDir);
  return files;
}

function collectMatches(content, regex) {
  const matcher = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`);
  const matches = [];
  let match;

  while ((match = matcher.exec(content)) !== null) {
    const line = content.slice(0, match.index).split('\n').length;
    const excerpt = (content.split('\n')[line - 1] || '').trim();
    matches.push({ line, excerpt });
  }

  return matches;
}

function createDetail(file, message, line, excerpt) {
  return { file, message, line, excerpt };
}

function createResult(passed, summary, details = []) {
  return { passed, summary, details };
}

async function runCli(run) {
  const targetDir = path.resolve(process.argv[2] || process.cwd());
  const result = await run(targetDir);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exitCode = result.passed ? 0 : 1;
}

async function run(targetDir) {
  const files = await walkFiles(targetDir, ['.js', '.jsx', '.ts', '.tsx']);
  const details = [];
  const patterns = [
    /window\.\s*[A-Za-z_$][\w$]*\s*=/g,
    /globalThis\.\s*[A-Za-z_$][\w$]*\s*=/g
  ];

  for (const file of files) {
    if (/\.min\.js$/i.test(file.relativePath) || file.relativePath.includes('node_modules/')) {
      continue;
    }

    for (const pattern of patterns) {
      for (const hit of collectMatches(file.content, pattern)) {
        details.push(
          createDetail(
            file.relativePath,
            'Avoid mutable globals. Prefer module scope, closures, or explicit state containers.',
            hit.line,
            hit.excerpt
          )
        );
      }
    }
  }

  return details.length === 0
    ? createResult(true, 'No mutable browser globals were detected.')
    : createResult(false, 'Mutable browser globals were detected.', details);
}

module.exports = { run };

if (require.main === module) {
  runCli(run);
}
