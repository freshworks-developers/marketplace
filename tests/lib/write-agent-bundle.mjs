#!/usr/bin/env node
/**
 * Write eval/e2e batch bundle.json from per-agent result files.
 * Usage: node tests/lib/write-agent-bundle.mjs eval|e2e
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEvalBundle, loadE2eBundle } from './agent-bundles.mjs';

const kind = process.argv[2];
if (kind !== 'eval' && kind !== 'e2e') {
  console.error('Usage: write-agent-bundle.mjs eval|e2e');
  process.exit(1);
}

const testsDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = kind === 'eval' ? await loadEvalBundle(testsDir) : await loadE2eBundle(testsDir);
if (!bundle?.runs?.length) {
  console.log(`No ${kind} batch runs found — bundle not written`);
  process.exit(0);
}

const outDir = join(testsDir, kind === 'eval' ? 'eval/eval-batch-results' : 'e2e/e2e-batch-results');
await mkdir(outDir, { recursive: true });
const outPath = join(outDir, 'bundle.json');
const payload = {
  mode: bundle.mode,
  timestamp: new Date().toISOString(),
  runs: bundle.runs.map(run => {
    if (kind === 'eval') {
      return {
        cli: run.agent,
        timestamp: run.timestamp,
        results: run.results,
        passed: run.passed,
        failed: run.failed,
      };
    }
    return {
      client: run.agent,
      workflow: run.workflow,
      timestamp: run.timestamp,
      passed: run.passed,
      failed: run.failed,
      warned: run.warned,
      overall: run.overall,
      outputDir: run.outputDir,
      checks: run.checks,
    };
  }),
};

await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath} (${bundle.runs.length} run(s), ${bundle.mode})`);
