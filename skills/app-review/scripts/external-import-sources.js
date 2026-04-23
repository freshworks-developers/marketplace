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

const TRUSTED_SOURCES = [
  'ajax.googleapis.com',
  'cdn.freshdev.io',
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
  'code.jquery.com',
  'esm.sh',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'ga.jspm.io',
  'maxcdn.bootstrapcdn.com',
  'npm.jspm.io',
  'registry.npmjs.org',
  'stackpath.bootstrapcdn.com',
  'static.freshdev.io',
  'unpkg.com'
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

function extractHostname(urlValue) {
  try {
    return new URL(urlValue).hostname.toLowerCase();
  } catch {
    const match = urlValue.match(/^https?:\/\/([^/:?#]+)/i);
    return match ? match[1].toLowerCase() : null;
  }
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
  const files = await walkFiles(targetDir, ['.css', '.html', '.js', '.json', '.jsx', '.ts', '.tsx']);
  const details = [];
  const srcHrefPattern = /(?:src|href)\s*=\s*["'](https?:\/\/[^"']+)["']/gi;
  const cssPattern = /(?:url|@import)\s*\(\s*["']?(https?:\/\/[^"')]+)["']?\s*\)/gi;

  for (const file of files) {
    const urls = new Set();
    for (const pattern of [srcHrefPattern, cssPattern]) {
      let match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(file.content)) !== null) {
        urls.add(match[1]);
      }
    }

    for (const urlValue of urls) {
      const hostname = extractHostname(urlValue);
      const trusted = hostname && TRUSTED_SOURCES.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
      if (!trusted) {
        details.push(
          createDetail(
            file.relativePath,
            hostname ? `External import uses an untrusted source: ${urlValue}` : `External import uses an invalid URL: ${urlValue}`
          )
        );
      }
    }
  }

  return details.length === 0
    ? createResult(true, 'All external script and style imports resolve to trusted sources.')
    : createResult(false, 'Some external script or style imports resolve to untrusted sources.', details);
}

module.exports = { run };

if (require.main === module) {
  runCli(run);
}
