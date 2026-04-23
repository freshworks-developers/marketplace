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

const OAUTH_PATTERNS = [
  /client[_-]?id\s*[:=]\s*['"][^'"]{10,}['"]/gi,
  /client[_-]?secret\s*[:=]\s*['"][^'"]{10,}['"]/gi,
  /oauth[_-]?token\s*[:=]\s*['"][^'"]{10,}['"]/gi
];

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

function isCommentLine(lineText) {
  const line = (lineText || '').trim();
  return line.startsWith('//') || line.startsWith('/*') || line.startsWith('*');
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
  const files = await walkFiles(targetDir, ['.env', '.html', '.js', '.json', '.jsx', '.ts', '.tsx']);
  const details = [];

  for (const file of files) {
    const isConfigFile = /oauth_config\.json$|config\/|config\\|iparams\.json$|\.env$/i.test(file.relativePath);
    if (isConfigFile) {
      continue;
    }

    for (const pattern of OAUTH_PATTERNS) {
      for (const hit of collectMatches(file.content, pattern)) {
        if (isCommentLine(hit.excerpt)) {
          continue;
        }

        details.push(
          createDetail(
            file.relativePath,
            'OAuth client values should only live in configuration files.',
            hit.line,
            hit.excerpt
          )
        );
      }
    }
  }

  return details.length === 0
    ? createResult(true, 'OAuth client values only appear in configuration files.')
    : createResult(false, 'OAuth client values appear outside configuration files.', details);
}

module.exports = { run };

if (require.main === module) {
  runCli(run);
}
