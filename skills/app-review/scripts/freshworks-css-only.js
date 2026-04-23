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

const BLOCKED_FILES = [
  'freshdesk.css',
  'freshmarketer.css',
  'freshsales.css',
  'freshservice.css',
  'freshteam.css'
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

function createDetail(file, message) {
  return { file, message };
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
  const files = await walkFiles(targetDir, ['.css', '.html']);
  const details = [];
  const linkPattern = /<link[^>]+href\s*=\s*["']([^"']+\.css)["']/gi;
  const importPattern = /@import\s+(?:url\()?\s*["']([^"']+\.css)["']/gi;

  for (const file of files) {
    for (const pattern of [linkPattern, importPattern]) {
      let match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(file.content)) !== null) {
        const href = match[1].toLowerCase();
        if (BLOCKED_FILES.some((cssFile) => href.includes(cssFile))) {
          details.push(
            createDetail(
              file.relativePath,
              `Only Freshworks.css should be used here, but found ${match[1]}.`
            )
          );
        }
      }
    }
  }

  return details.length === 0
    ? createResult(true, 'Only Freshworks.css references were detected.')
    : createResult(false, 'Product-specific CSS files were detected.', details);
}

module.exports = { run };

if (require.main === module) {
  runCli(run);
}
