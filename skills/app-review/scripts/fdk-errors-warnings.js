'use strict';

const fs = require('fs/promises');
const path = require('path');

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
  // This checker inspects only manifest.json, so it applies to app structure rather than frontend/server files.
  const manifest = await readManifest(targetDir);
  const details = [];

  if (!manifest) {
    details.push(createDetail('manifest.json', 'The app is missing a readable manifest.json file.'));
    return createResult(false, 'The app is missing a readable manifest.json file.', details);
  }

  const data = manifest;
  if (!data['platform-version']) {
    details.push(createDetail('manifest.json', 'The manifest is missing "platform-version".'));
  }

  if (!data.modules || typeof data.modules !== 'object' || Object.keys(data.modules).length === 0) {
    details.push(createDetail('manifest.json', 'The manifest must define at least one module.'));
  }

  if (data.product && Number.parseFloat(String(data['platform-version'] || '0')) >= 3) {
    details.push(createDetail('manifest.json', 'Platform 3 apps should use "modules" instead of the deprecated "product" field.'));
  }

  if (!data.engines) {
    details.push(createDetail('manifest.json', 'The manifest should declare engine versions for Node and FDK.'));
  }

  return details.length === 0
    ? createResult(true, 'The manifest passes the baseline FDK structure checks.')
    : createResult(false, 'The manifest has baseline FDK structure issues that would likely surface as warnings or errors.', details);
}

module.exports = { run };

if (require.main === module) {
  runCli(run);
}
