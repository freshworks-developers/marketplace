'use strict';

const fs = require('fs/promises');
const path = require('path');

const EXPECTED_PLATFORM_VERSION = 3.0;

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
  const details = [];

  if (!manifest || !manifest['platform-version']) {
    details.push(createDetail('manifest.json', 'The app does not declare a platform version.'));
    return createResult(false, 'The app does not declare a platform version.', details);
  }

  const currentVersion = Number.parseFloat(String(manifest['platform-version']));
  if (Number.isNaN(currentVersion) || currentVersion < EXPECTED_PLATFORM_VERSION) {
    details.push(
      createDetail(
        'manifest.json',
        `The app uses platform version ${manifest['platform-version']}. Upgrade it to ${EXPECTED_PLATFORM_VERSION}.`
      )
    );
  }

  return details.length === 0
    ? createResult(true, 'The app already targets the expected marketplace platform version.')
    : createResult(false, 'The app should be upgraded to the expected marketplace platform version.', details);
}

module.exports = { run };

if (require.main === module) {
  runCli(run);
}
