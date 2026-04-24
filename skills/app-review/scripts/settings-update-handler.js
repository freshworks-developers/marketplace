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

// Walk matching source files across the app root so manifest-declared settings update hooks can be matched to code.
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

async function readManifest(rootDir) {
  const manifestPath = path.join(rootDir, 'manifest.json');
  try {
    const content = await fs.readFile(manifestPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
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
  const manifest = await readManifest(targetDir);
  const files = await walkFiles(targetDir, ['.js', '.json', '.jsx', '.ts', '.tsx']);
  const details = [];
  const manifestUsesSettingsUpdate = manifest && JSON.stringify(manifest).includes('onSettingsUpdate');
  const handlerLocations = files.filter((file) => /onSettingsUpdate|on_settings_update/i.test(file.content));

  if (manifestUsesSettingsUpdate && handlerLocations.length === 0) {
    details.push(
      createDetail(
        'manifest.json',
        'The app references settings updates but no matching handler implementation was found.'
      )
    );
  }

  return details.length === 0
    ? createResult(true, 'Settings update handling is either implemented or not required.')
    : createResult(false, 'A settings update hook is referenced without a matching implementation.', details);
}

module.exports = { run };

if (require.main === module) {
  runCli(run);
}
