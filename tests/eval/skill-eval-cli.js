#!/usr/bin/env node
/**
 * Layer 2b: CLI-based skill behavioral evals — no API key needed.
 *
 * Uses the claude or cursor CLI (your subscription) instead of the Anthropic SDK.
 * The fw-dev-tools skills must be installed for the CLI to have them in context.
 *
 * Run:  node tests/skill-eval-cli.js
 *       node tests/skill-eval-cli.js --cursor
 *       node tests/skill-eval-cli.js --skill fw-review
 *       node tests/skill-eval-cli.js --limit 10
 *
 * Results written to tests/eval-cli-results.json
 */

import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { SCENARIOS } from './skill-eval-scenarios.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const USE_CURSOR = process.argv.includes('--cursor') || process.env.FW_EVAL_CLI === 'cursor';
const CLI = USE_CURSOR ? 'cursor' : 'claude';

const skillFilter = (() => {
  const i = process.argv.indexOf('--skill');
  return i !== -1 ? process.argv[i + 1] : null;
})();

const limitFilter = (() => {
  const i = process.argv.indexOf('--limit');
  return i !== -1 ? parseInt(process.argv[i + 1], 10) : null;
})();

const idFilter = (() => {
  const i = process.argv.indexOf('--id');
  return i !== -1 ? process.argv[i + 1].split(',') : null;
})();

async function checkCLI() {
  return new Promise((resolve) => {
    const proc = spawn('which', [CLI]);
    proc.on('close', (code) => resolve(code === 0));
  });
}

const cliAvailable = await checkCLI();
if (!cliAvailable) {
  console.log(`⚠  '${CLI}' CLI not found — skipping CLI eval tests`);
  console.log(`   Install ${CLI === 'claude' ? 'Claude Code from https://claude.ai/code' : 'Cursor from https://cursor.com'}`);
  process.exit(0);
}

async function runCLI(prompt, workdir) {
  return new Promise((resolve, reject) => {
    let args;
    if (USE_CURSOR) {
      args = ['agent', '--print', '--force', '--approve-mcps', '--workspace', workdir, prompt];
    } else {
      args = ['--print', prompt];
    }

    // Strip vars injected by Claude Code desktop that force API-key auth
    // and break subscription-based auth in child claude --print processes.
    const env = { ...process.env };
    delete env.ANTHROPIC_BASE_URL;
    delete env.ANTHROPIC_API_KEY;
    delete env.CLAUDE_CODE_CHILD_SESSION;

    const proc = spawn(CLI, args, { cwd: workdir, env });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => { stdout += d; });
    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('close', (code) => {
      if (!stdout && code !== 0) {
        reject(new Error(`${CLI} exited ${code}: ${stderr.slice(0, 200)}`));
      } else {
        resolve(stdout);
      }
    });
    proc.on('error', reject);
  });
}

function extractJSON(text) {
  // Scan for JSON objects using brace counting (handles arbitrary nesting depth).
  // Scan from end so the last JSON object in output wins (it's usually the answer).
  const starts = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') starts.push(i);
  }
  for (let si = starts.length - 1; si >= 0; si--) {
    const start = starts[si];
    let depth = 0;
    let inString = false;
    let escape = false;
    let end = -1;
    for (let j = start; j < text.length; j++) {
      const ch = text[j];
      if (escape) { escape = false; continue; }
      if (ch === '\\' && inString) { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === '{') depth++;
      else if (ch === '}') { if (--depth === 0) { end = j; break; } }
    }
    if (end === -1) continue;
    try {
      const obj = JSON.parse(text.slice(start, end + 1));
      if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) return obj;
    } catch { continue; }
  }
  throw new Error(`No valid JSON object found in output:\n${text.slice(0, 500)}`);
}

const MAX_SKILL_CHARS = 25000;

async function buildPrompt(scenario) {
  let skillContent = '';
  try {
    const raw = await scenario.loadContent();
    skillContent = raw.length > MAX_SKILL_CHARS ? raw.slice(0, MAX_SKILL_CHARS) + '\n...(truncated)' : raw;
  } catch { /* proceed without it */ }

  const fields = Object.entries(scenario.schema.properties)
    .map(([k, v]) => {
      if (v.type === 'boolean') return `"${k}": true|false`;
      if (v.type === 'number') return `"${k}": number`;
      if (v.type === 'array') return `"${k}": [string, ...]`;
      if (v.type === 'string' && v.enum) return `"${k}": one of ${JSON.stringify(v.enum)}`;
      if (v.type === 'string') return `"${k}": string`;
      return `"${k}": ...`;
    })
    .join(', ');

  const skillSection = skillContent ? `\n\nSkill reference:\n---\n${skillContent}\n---` : '';

  return `You are following the ${scenario.skill} skill.${skillSection}

Evaluate this scenario and respond with ONLY a JSON object — no prose, no code fences, no markdown.

Scenario: ${scenario.prompt}

Required JSON (include ALL fields):
{${fields}, "explanation": "brief reason"}`;
}

const MAX_RETRIES = 3;

async function evalWithCLI(scenario, workdir) {
  const prompt = await buildPrompt(scenario);
  const attempts = [];

  const needed = Math.ceil(MAX_RETRIES / 2);
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const raw = await runCLI(prompt, workdir);
      const output = extractJSON(raw);
      scenario.assert(output);
      attempts.push({ pass: true, output });
    } catch (err) {
      attempts.push({ pass: false, error: err.message });
    }
    const passed = attempts.filter(a => a.pass).length;
    const failed = attempts.length - passed;
    if (passed >= needed || failed >= needed) break;
  }

  const passed = attempts.filter(a => a.pass).length;
  return { passed, total: attempts.length, attempts };
}

let scenarios = SCENARIOS;
if (idFilter) {
  scenarios = scenarios.filter(s => idFilter.includes(s.id));
  if (scenarios.length === 0) {
    console.error(`No scenarios found for ids: ${idFilter.join(',')}`);
    process.exit(1);
  }
}
if (skillFilter) {
  scenarios = scenarios.filter(s => s.skill === skillFilter);
  if (scenarios.length === 0) {
    console.error(`No scenarios found for skill: ${skillFilter}`);
    process.exit(1);
  }
}
if (limitFilter && limitFilter > 0) {
  scenarios = scenarios.slice(0, limitFilter);
}

const workdir = await mkdtemp(join(tmpdir(), 'fw-eval-cli-'));
process.on('exit', () => { rm(workdir, { recursive: true, force: true }).catch(() => {}); });

const results = [];

describe(`Skill CLI evals (${CLI})`, { concurrency: 6 }, () => {
  for (const scenario of scenarios) {
    test(`[${scenario.id}] ${scenario.label}`, async () => {
      const { passed, total, attempts } = await evalWithCLI(scenario, workdir);

      const result = {
        id: scenario.id,
        skill: scenario.skill,
        label: scenario.label,
        passed,
        total,
        pass: passed >= Math.ceil(total / 2),
        attempts: attempts.map(a => ({ pass: a.pass, error: a.error ?? null })),
        cli: CLI,
      };
      results.push(result);

      assert.ok(
        result.pass,
        `[${scenario.id}] failed ${total - passed}/${total} attempts. Last: ${attempts.at(-1)?.error}`,
      );
    });
  }
});

after(async () => {
  await writeFile(
    join(__dirname, 'eval-cli-results.json'),
    JSON.stringify({ cli: CLI, timestamp: new Date().toISOString(), results }, null, 2),
    'utf8',
  );
});
