import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SKILLS_DIR = join(REPO_ROOT, 'skills');

async function collectFiles(dir, exts) {
  const results = [];
  for (const entry of await readdir(dir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (!exts.some((e) => entry.name.endsWith(e))) continue;
    results.push(join(entry.parentPath ?? entry.path, entry.name));
  }
  return results;
}

const DEPRECATED_PATTERNS = [
  { re: /npx skills add/, label: '"npx skills add"' },
  { re: /@anthropic-ai\/add-skill/, label: '"@anthropic-ai/add-skill"' },
  { re: /github\.com\/freshworks-developers\/freshworks-platform3/, label: 'old repo URL "freshworks-platform3"' },
];

test('no deprecated install references in skills/', async () => {
  const files = await collectFiles(SKILLS_DIR, ['.md', '.mdc']);
  const hits = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (const { re, label } of DEPRECATED_PATTERNS) {
        if (re.test(lines[i])) {
          hits.push(`${label} at ${file}:${i + 1}: ${lines[i].trim()}`);
        }
      }
    }
  }

  assert.deepEqual(
    hits,
    [],
    `Deprecated install reference(s) found — replace with "npx @freshworks/fw-dev-tools install":\n${hits.join('\n')}`,
  );
});
