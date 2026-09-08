#!/usr/bin/env node
/**
 * Propagates the version from the root package.json to all static files
 * that embed it: root plugin.json, installer/package.json, skills SKILL.md
 * frontmatter, and extension manifests (marketplace plugins[]).
 *
 * Run automatically via `npm version` (preversion hook).
 * Can also be run directly: node scripts/bump-version.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));

console.log(`Propagating version ${version}...`);

async function updateJson(filePath, updater) {
  const raw = await readFile(filePath, 'utf8');
  const obj = JSON.parse(raw);
  updater(obj);
  await writeFile(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  console.log(`  updated ${filePath.replace(ROOT + '/', '')}`);
}

function applyVersionToManifest(obj, version) {
  if (obj && typeof obj === 'object' && 'version' in obj) {
    obj.version = version;
  }
  if (Array.isArray(obj?.plugins)) {
    for (const plugin of obj.plugins) {
      if (plugin && typeof plugin === 'object' && 'version' in plugin) {
        plugin.version = version;
      }
    }
  }
}

async function updateText(filePath, pattern, replacement) {
  const raw = await readFile(filePath, 'utf8');
  const updated = raw.replace(pattern, replacement);
  if (updated !== raw) {
    await writeFile(filePath, updated, 'utf8');
    console.log(`  updated ${filePath.replace(ROOT + '/', '')}`);
  }
}

// Root plugin.json (Agent Plugins 1.0.0)
await updateJson(join(ROOT, 'plugin.json'), (obj) => {
  obj.version = version;
});

// installer/package.json
await updateJson(join(ROOT, 'installer/package.json'), (pkg) => {
  pkg.version = version;
});

// Extension directory manifests (Agent Plugins 1.0.0 client extensions)
for (const dir of ['io.anthropic.claude-code', 'com.cursor', 'com.openai.codex']) {
  for (const file of ['plugin.json', 'marketplace.json', 'skills-metadata.json']) {
    try {
      const p = join(ROOT, dir, file);
      await updateJson(p, (obj) => applyVersionToManifest(obj, version));
    } catch { /* file may not exist in every extension */ }
  }
}

// Skills — SKILL.md frontmatter version
const skillsDir = join(ROOT, 'skills');
const skills = await readdir(skillsDir, { withFileTypes: true });
for (const entry of skills) {
  if (!entry.isDirectory()) continue;
  const skillMd = join(skillsDir, entry.name, 'SKILL.md');
  try {
    await updateText(skillMd, /^version: "[\d.]+"/m, `version: "${version}"`);
  } catch { /* no SKILL.md in this dir */ }
}

console.log(`Done — all files now at ${version}`);
