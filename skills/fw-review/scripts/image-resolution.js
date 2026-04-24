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

// Walk the app root for matching image files so icon/logo assets can be checked.
async function walkFiles(rootDir, extensions) {
  const files = [];
  const allowedExtensions = Array.isArray(extensions) ? extensions : extensions?.extensions || [];

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

      if (entry.isFile() && allowedExtensions.includes(path.extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  }

  await visit(rootDir);
  return files;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8').catch(() => null);
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
  const details = [];
  const imageFiles = await walkFiles(targetDir, {
    extensions: ['.gif', '.ico', '.jpeg', '.jpg', '.png']
  });

  for (const filePath of imageFiles) {
    const stats = await fs.stat(filePath).catch(() => null);
    if (!stats || !/icon|logo/i.test(path.basename(filePath))) {
      continue;
    }

    if (stats.size > 0 && stats.size < 1024) {
      details.push(
        createDetail(
          path.relative(targetDir, filePath).split(path.sep).join('/'),
          `Image looks too small to be production ready (${stats.size} bytes).`
        )
      );
    }
  }

  const iconPath = path.join(targetDir, 'app', 'styles', 'images', 'icon.svg');
  if (await pathExists(iconPath)) {
    const content = await readText(iconPath);
    const width = content && content.match(/width\s*=\s*["'](\d+)/i);
    const height = content && content.match(/height\s*=\s*["'](\d+)/i);
    if (width && height && (width[1] !== '64' || height[1] !== '64')) {
      details.push(
        createDetail(
          'app/styles/images/icon.svg',
          `Icon SVG should be 64x64 but is declared as ${width[1]}x${height[1]}.`
        )
      );
    }
  }

  return details.length === 0
    ? createResult(true, 'Image assets look consistent with the expected resolution checks.')
    : createResult(false, 'Some image assets do not meet the expected resolution checks.', details);
}

module.exports = { run };

if (require.main === module) {
  runCli(run);
}
