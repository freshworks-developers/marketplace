import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const AGENT_LABELS = {
  claude: 'Claude Code',
  cursor: 'Cursor',
  codex: 'Codex',
};

export function formatAgentLabel(agent) {
  if (!agent) return null;
  const key = String(agent).toLowerCase();
  return AGENT_LABELS[key] ?? String(agent);
}

async function readJSON(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return null;
  }
}

function summarizeEvalResults(results = []) {
  const passed = results.filter(r => r.pass).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length };
}

function evalRunFromRaw(raw, agentHint) {
  if (!raw?.results) return null;
  const agent = raw.cli || agentHint || 'unknown';
  const stats = summarizeEvalResults(raw.results);
  return {
    agent,
    cli: agent,
    results: raw.results,
    timestamp: raw.timestamp ?? null,
    ...stats,
  };
}

function parseEvalBatchName(name) {
  const m = name.match(/^(\w+)-results\.json$/);
  return m?.[1] ?? null;
}

function parseE2eBatchName(name) {
  const m = name.match(/^(\w+)-(.+)-results\.json$/);
  if (!m) return { agent: null, workflow: null };
  return { agent: m[1], workflow: m[2] };
}

function e2eRunFromRaw(raw, { agent, workflow } = {}) {
  if (!raw?.checks) return null;
  return {
    agent: raw.client || agent || 'unknown',
    client: raw.client || agent || 'unknown',
    workflow: raw.workflow || workflow || null,
    checks: raw.checks,
    passed: raw.passed ?? 0,
    failed: raw.failed ?? 0,
    warned: raw.warned ?? 0,
    overall: raw.overall ?? null,
    timestamp: raw.timestamp ?? null,
    outputDir: raw.outputDir ?? null,
  };
}

function bundleFromRuns(runs, { kind }) {
  const valid = runs.filter(Boolean);
  if (!valid.length) return null;
  const uniqueAgents = new Set(valid.map(r => r.agent));
  const mode = valid.length > 1 || uniqueAgents.size > 1 ? 'multi' : 'single';
  const timestamp = valid.map(r => r.timestamp).filter(Boolean).sort().at(-1) ?? null;
  return { kind, mode, runs: valid, timestamp };
}

async function loadBatchRuns(dir, suffix, mapper) {
  let names;
  try {
    names = (await readdir(dir)).filter(n => n.endsWith(suffix)).sort();
  } catch {
    return [];
  }
  const runs = [];
  for (const name of names) {
    const raw = await readJSON(join(dir, name));
    const run = mapper(raw, name);
    if (run) runs.push(run);
  }
  return runs;
}

export async function loadEvalBundle(testsDir) {
  const bundlePath = join(testsDir, 'eval/eval-batch-results/bundle.json');
  const bundleRaw = await readJSON(bundlePath);
  if (bundleRaw?.runs?.length) {
    const runs = bundleRaw.runs.map(r => evalRunFromRaw(r, r.cli || r.agent)).filter(Boolean);
    return bundleFromRuns(runs, { kind: 'eval' });
  }

  const batchRuns = await loadBatchRuns(
    join(testsDir, 'eval/eval-batch-results'),
    '-results.json',
    (raw, name) => evalRunFromRaw(raw, parseEvalBatchName(name)),
  );

  if (batchRuns.length) {
    return bundleFromRuns(batchRuns, { kind: 'eval' });
  }

  const single = await readJSON(join(testsDir, 'eval/eval-cli-results.json'));
  const run = evalRunFromRaw(single);
  return bundleFromRuns(run ? [run] : [], { kind: 'eval' });
}

export async function loadE2eBundle(testsDir) {
  const bundlePath = join(testsDir, 'e2e/e2e-batch-results/bundle.json');
  const bundleRaw = await readJSON(bundlePath);
  if (bundleRaw?.runs?.length) {
    const runs = bundleRaw.runs
      .map(r => e2eRunFromRaw(r, { agent: r.client || r.agent, workflow: r.workflow }))
      .filter(Boolean);
    return bundleFromRuns(runs, { kind: 'e2e' });
  }

  const batchRuns = await loadBatchRuns(
    join(testsDir, 'e2e/e2e-batch-results'),
    '-results.json',
    (raw, name) => {
      const hint = parseE2eBatchName(name);
      return e2eRunFromRaw(raw, hint);
    },
  );

  if (batchRuns.length) {
    return bundleFromRuns(batchRuns, { kind: 'e2e' });
  }

  const single = await readJSON(join(testsDir, 'e2e/e2e-results.json'));
  const run = e2eRunFromRaw(single, { agent: single?.client, workflow: single?.workflow });
  return bundleFromRuns(run ? [run] : [], { kind: 'e2e' });
}

export function evalBundleStats(bundle) {
  if (!bundle?.runs?.length) return { passed: 0, failed: 0, total: 0 };
  return bundle.runs.reduce(
    (acc, r) => ({ passed: acc.passed + r.passed, failed: acc.failed + r.failed, total: acc.total + r.total }),
    { passed: 0, failed: 0, total: 0 },
  );
}

export function e2eBundleStats(bundle) {
  if (!bundle?.runs?.length) return { passed: 0, failed: 0, warned: 0, checks: 0 };
  return bundle.runs.reduce(
    (acc, r) => ({
      passed: acc.passed + (r.passed ?? 0),
      failed: acc.failed + (r.failed ?? 0),
      warned: acc.warned + (r.warned ?? 0),
      checks: acc.checks + (r.checks?.length ?? 0),
    }),
    { passed: 0, failed: 0, warned: 0, checks: 0 },
  );
}

export function bundleAgentLabels(bundle) {
  if (!bundle?.runs?.length) return [];
  return [...new Set(bundle.runs.map(r => formatAgentLabel(r.agent)).filter(Boolean))];
}

export function writeBundleJson(runs, { kind, testsDir }) {
  const subdir = kind === 'eval' ? 'eval/eval-batch-results' : 'e2e/e2e-batch-results';
  const payload = {
    mode: runs.length > 1 ? 'multi' : 'single',
    timestamp: new Date().toISOString(),
    runs,
  };
  return { path: join(testsDir, subdir, 'bundle.json'), payload };
}
