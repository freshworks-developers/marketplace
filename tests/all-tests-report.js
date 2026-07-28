import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadEvalBundle,
  loadE2eBundle,
  evalBundleStats,
  e2eBundleStats,
  bundleAgentLabels,
  formatAgentLabel,
} from './lib/agent-bundles.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const R = p => join(__dirname, p);

// ── Data loaders ──────────────────────────────────────────────────────────

async function readJSON(path) {
  try { return JSON.parse(await readFile(path, 'utf8')); }
  catch { return null; }
}

async function readNDJSON(path) {
  let text;
  try { text = await readFile(path, 'utf8'); }
  catch { return []; }
  return text.split('\n').filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
}

function extractTests(events) {
  const passOrFail = events.filter(e => e.type === 'test:pass' || e.type === 'test:fail');
  if (!passOrFail.length) return [];
  return passOrFail
    .filter(e => !/\.test\.(m?js|cjs)$/.test(e.data.name))
    .map(e => ({
      name: e.data.name,
      pass: e.type === 'test:pass',
      duration_ms: Math.round(e.data.details?.duration_ms ?? 0),
      error: e.data.details?.error?.message ?? null,
      nesting: e.data.nesting,
      file: e._file ?? null,
    }));
}

function skillFromName(name) {
  const m = name.match(/^(fw-[a-z-]+)/);
  return m ? m[1] : 'other';
}

function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const k = keyFn(item);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(item);
  }
  return map;
}

function slugify(s) {
  return String(s).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function fileLabel(filename) {
  if (!filename) return 'Other';
  return filename
    .replace(/\.test\.(m?js|cjs)$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ── Load ──────────────────────────────────────────────────────────────────

const [overall, installerEvents, staticEvents, regexEvalEvents, evalBundleRaw, e2eBundleRaw] = await Promise.all([
  readJSON(R('all-tests-results.json')),
  readNDJSON(R('installer-results.ndjson')),
  readNDJSON(R('static-results.ndjson')),
  readNDJSON(R('eval-regex-results.ndjson')),
  loadEvalBundle(__dirname),
  loadE2eBundle(__dirname),
]);

const installerTests = extractTests(installerEvents);
const staticTests = extractTests(staticEvents);
const regexEvalTests = extractTests(regexEvalEvents);

// Treat stale result files as absent when the current run skipped that layer
const layerSkipped = (name) =>
  overall?.layers?.find(l => l.name === name)?.passes === 'skipped';
const evalBundle = layerSkipped('LLM Eval Tests (CLI)') ? null : evalBundleRaw;
const e2eBundle = layerSkipped('E2E Tests') ? null : e2eBundleRaw;

const date = overall
  ? new Date(overall.timestamp).toISOString().split('T')[0]
  : new Date().toISOString().split('T')[0];

// ── HTML helpers ──────────────────────────────────────────────────────────

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function layerAgentNote(layerName) {
  if (layerName === 'LLM Eval Tests (CLI)' && evalBundle?.runs?.length) {
    const labels = bundleAgentLabels(evalBundle);
    return evalBundle.mode === 'multi' ? labels.join(', ') : (labels[0] ?? null);
  }
  if (layerName === 'E2E Tests' && e2eBundle?.runs?.length) {
    if (e2eBundle.mode === 'multi') {
      return e2eBundle.runs.map(r => {
        let label = formatAgentLabel(r.agent);
        if (r.workflow) label += ` (${r.workflow})`;
        return label;
      }).join(', ');
    }
    const run = e2eBundle.runs[0];
    const parts = [formatAgentLabel(run.agent)];
    if (run.workflow) parts.push(run.workflow);
    return parts.join(' · ');
  }
  return null;
}

function agentTag(agent, { prefix = 'Agent' } = {}) {
  const label = formatAgentLabel(agent);
  if (!label) return '';
  return `<span class="agent-tag">${prefix}: ${esc(label)}</span>`;
}

function badge(pass, fail) {
  const total = pass + fail;
  if (total === 0) return '<span class="badge skip">Skipped</span>';
  if (fail === 0) return `<span class="badge pass">${pass} passed</span>`;
  return `<span class="badge fail">${fail} failed <span class="badge-sep">·</span> ${pass}/${total}</span>`;
}

function statusIcon(pass) {
  return `<span class="status-icon ${pass ? 'pass' : 'fail'}" aria-hidden="true"></span>`;
}

function e2eStatusIcon(status) {
  const cls = status === 'pass' ? 'pass' : status === 'warn' ? 'warn' : 'fail';
  return `<span class="status-icon ${cls}" aria-hidden="true"></span>`;
}

function subTabsBar(groups, ns, failCountFn) {
  const entries = [...groups.entries()];
  return `<div class="sub-tabs">
    ${entries.map(([key, items], i) => {
      const fails = failCountFn(items);
      const badgeCls = fails > 0 ? 'fail' : 'pass';
      const badgeText = fails > 0 ? fails : items.length;
      return `<button class="sub-tab${i === 0 ? ' active' : ''}" data-sub-tab="${slugify(ns + '-' + key)}">${esc(key)} <span class="sub-badge ${badgeCls}">${badgeText}</span></button>`;
    }).join('\n    ')}
  </div>`;
}

function subPanels(groups, ns, renderContent) {
  return [...groups.entries()].map(([key, items], i) => `<div class="sub-panel${i === 0 ? ' active' : ''}" id="sub-${slugify(ns + '-' + key)}">
    ${renderContent(key, items)}
  </div>`).join('\n  ');
}

function testTable(items) {
  const rows = items.map(t => `
      <tr class="${t.pass ? '' : 'row-fail'}">
        <td class="icon-cell">${statusIcon(t.pass)}</td>
        <td class="name-cell">${esc(t.name)}</td>
        <td class="dur-cell">${t.duration_ms}<span class="dur-unit">ms</span></td>
        <td class="err-cell">${t.error ? `<code>${esc(t.error.slice(0, 160))}</code>` : '<span class="muted">—</span>'}</td>
      </tr>`).join('');
  return `<div class="table-wrap"><table>
    <thead><tr><th></th><th>Test</th><th>Duration</th><th>Error</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function nodeTestPanel(tests, ns, groupKeyFn) {
  if (!tests.length) return '<p class="empty">No data — run the all-tests suite first.</p>';
  const pass = tests.filter(t => t.pass).length;
  const fail = tests.length - pass;
  const groups = groupBy(tests, groupKeyFn);
  const failCount = items => items.filter(t => !t.pass).length;
  if (groups.size <= 1) {
    return `
    <div class="layer-bar">${badge(pass, fail)}</div>
    ${testTable(tests)}`;
  }
  return `
    <div class="layer-bar">${badge(pass, fail)}</div>
    ${subTabsBar(groups, ns, failCount)}
    ${subPanels(groups, ns, (_key, items) => testTable(items))}`;
}

function runSummaryTable(headers, rows) {
  return `<div class="table-wrap agent-summary"><table>
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.join('')}</tbody>
  </table></div>`;
}

function evalSingleRunPanel(run) {
  const { results, agent } = run;
  const pass = results.filter(r => r.pass).length;
  const fail = results.length - pass;
  const groups = groupBy(results, r => r.skill);
  const failCount = items => items.filter(r => !r.pass).length;
  const agentHtml = agentTag(agent);
  const renderTable = (_key, items) => {
    const rows = items.map(r => `
      <tr class="${r.pass ? '' : 'row-fail'}">
        <td class="icon-cell">${statusIcon(r.pass)}</td>
        <td><code class="id-tag">${esc(r.id)}</code></td>
        <td class="name-cell">${esc(r.label)}</td>
        <td class="att-cell">${r.passed}/${r.total}</td>
      </tr>`).join('');
    return `<div class="table-wrap"><table>
      <thead><tr><th></th><th>ID</th><th>Scenario</th><th>Retries</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  };
  if (groups.size <= 1) {
    return `
    <div class="layer-bar">${badge(pass, fail)} ${agentHtml}</div>
    ${renderTable(null, results)}`;
  }
  return `
    <div class="layer-bar">${badge(pass, fail)} ${agentHtml}</div>
    ${subTabsBar(groups, `eval-${agent}`, failCount)}
    ${subPanels(groups, `eval-${agent}`, renderTable)}`;
}

function evalPanel(bundle) {
  if (!bundle?.runs?.length) {
    return '<p class="empty">No eval data — run <code>npm run eval</code> or <code>bash tests/eval/run-all-eval-cli.sh</code>.</p>';
  }
  if (bundle.mode === 'single' && bundle.runs.length === 1) {
    return evalSingleRunPanel(bundle.runs[0]);
  }

  const stats = evalBundleStats(bundle);
  const summaryRows = bundle.runs.map(run => {
    const rate = run.total > 0 ? Math.round((run.passed / run.total) * 100) : 0;
    return `<tr class="${run.failed > 0 ? 'row-fail' : ''}">
      <td class="name-cell">${esc(formatAgentLabel(run.agent))}</td>
      <td class="att-cell">${run.passed}/${run.total}</td>
      <td class="att-cell">${run.failed}</td>
      <td class="att-cell">${rate}%</td>
    </tr>`;
  });

  const agentTabs = subTabsBar(
    new Map(bundle.runs.map(run => [formatAgentLabel(run.agent), [run]])),
    'eval-agent',
    items => items[0]?.failed ?? 0,
  );

  const renderAgentTable = (_agent, results) => {
    const groups = groupBy(results, r => r.skill);
    const failCount = items => items.filter(r => !r.pass).length;
    if (groups.size <= 1) {
      const rows = results.map(r => `
        <tr class="${r.pass ? '' : 'row-fail'}">
          <td class="icon-cell">${statusIcon(r.pass)}</td>
          <td><code class="id-tag">${esc(r.id)}</code></td>
          <td class="name-cell">${esc(r.label)}</td>
          <td class="att-cell">${r.passed}/${r.total}</td>
        </tr>`).join('');
      return `<div class="table-wrap"><table>
        <thead><tr><th></th><th>ID</th><th>Scenario</th><th>Retries</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
    }
    return `${subTabsBar(groups, `eval-${_agent}`, failCount)}
    ${subPanels(groups, `eval-${_agent}`, (_key, items) => {
      const rows = items.map(r => `
        <tr class="${r.pass ? '' : 'row-fail'}">
          <td class="icon-cell">${statusIcon(r.pass)}</td>
          <td><code class="id-tag">${esc(r.id)}</code></td>
          <td class="name-cell">${esc(r.label)}</td>
          <td class="att-cell">${r.passed}/${r.total}</td>
        </tr>`).join('');
      return `<div class="table-wrap"><table>
        <thead><tr><th></th><th>ID</th><th>Scenario</th><th>Retries</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
    })}`;
  };

  const agentPanels = bundle.runs.map((run, i) => `
    <div class="sub-panel${i === 0 ? ' active' : ''}" id="sub-${slugify(`eval-agent-${formatAgentLabel(run.agent)}`)}">
      <div class="layer-bar">${badge(run.passed, run.failed)} ${agentTag(run.agent)}</div>
      ${renderAgentTable(run.agent, run.results)}
    </div>`).join('');

  return `
    <div class="layer-bar">${badge(stats.passed, stats.failed)} <span class="meta-tag">${bundle.runs.length} agents</span></div>
    ${runSummaryTable(['Agent', 'Passed', 'Failed', 'Rate'], summaryRows)}
    ${agentTabs}
    ${agentPanels}`;
}

function e2eSingleRunPanel(run) {
  const { checks, passed, failed, agent, workflow, warned = 0 } = run;
  const e2eMeta = [
    agent ? agentTag(agent) : '',
    workflow ? `<span class="meta-tag">Workflow: ${esc(workflow)}</span>` : '',
  ].filter(Boolean).join(' ');
  const groups = groupBy(checks, c => c.phase);
  const failCount = items => items.filter(c => c.status === 'fail').length;
  const renderTable = (_key, items) => {
    const rows = items.map(c => {
      const cls = c.status === 'fail' ? 'row-fail' : c.status === 'warn' ? 'row-warn' : '';
      return `
      <tr class="${cls}">
        <td class="icon-cell">${e2eStatusIcon(c.status)}</td>
        <td class="name-cell">${esc(c.label)}</td>
      </tr>`;
    }).join('');
    return `<div class="table-wrap"><table>
      <thead><tr><th></th><th>Check</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  };
  const layerBar = `<div class="layer-bar">${badge(passed, failed)} ${warned ? `<span class="badge warn">${warned} warning${warned > 1 ? 's' : ''}</span>` : ''} ${e2eMeta}</div>`;
  if (groups.size <= 1) {
    const rows = checks.map(c => {
      const cls = c.status === 'fail' ? 'row-fail' : c.status === 'warn' ? 'row-warn' : '';
      return `
      <tr class="${cls}">
        <td class="icon-cell">${e2eStatusIcon(c.status)}</td>
        <td class="phase-cell">${esc(c.phase)}</td>
        <td class="name-cell">${esc(c.label)}</td>
      </tr>`;
    }).join('');
    return `${layerBar}
    <div class="table-wrap"><table>
      <thead><tr><th></th><th>Phase</th><th>Check</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  }
  return `${layerBar}
    ${subTabsBar(groups, `e2e-${agent}-${workflow ?? 'run'}`, failCount)}
    ${subPanels(groups, `e2e-${agent}-${workflow ?? 'run'}`, renderTable)}`;
}

function e2ePanel(bundle) {
  if (!bundle?.runs?.length) {
    return '<p class="empty">No E2E data — run with <code>--e2e</code> or <code>bash tests/e2e/run-all-e2e.sh</code>.</p>';
  }
  if (bundle.mode === 'single' && bundle.runs.length === 1) {
    return e2eSingleRunPanel(bundle.runs[0]);
  }

  const stats = e2eBundleStats(bundle);
  const summaryRows = bundle.runs.map(run => `
    <tr class="${run.failed > 0 ? 'row-fail' : ''}">
      <td class="name-cell">${esc(formatAgentLabel(run.agent))}</td>
      <td class="name-cell">${esc(run.workflow ?? '—')}</td>
      <td class="att-cell">${run.passed ?? 0}</td>
      <td class="att-cell">${run.failed ?? 0}</td>
      <td class="att-cell">${run.warned ?? 0}</td>
      <td class="att-cell">${run.failed > 0 ? 'Failed' : 'Passed'}</td>
    </tr>`);

  const runGroups = new Map(bundle.runs.map(run => [
    `${formatAgentLabel(run.agent)} · ${run.workflow ?? 'run'}`,
    [run],
  ]));
  const failCount = runs => runs.filter(r => (r.failed ?? 0) > 0).length;
  const runTabs = subTabsBar(runGroups, 'e2e-run', failCount);
  const runPanels = bundle.runs.map((run, i) => `
    <div class="sub-panel${i === 0 ? ' active' : ''}" id="sub-${slugify(`e2e-run-${formatAgentLabel(run.agent)} · ${run.workflow ?? 'run'}`)}">
      ${e2eSingleRunPanel(run)}
    </div>`).join('');

  return `
    <div class="layer-bar">${badge(stats.passed, stats.failed)} ${stats.warned ? `<span class="badge warn">${stats.warned} warning${stats.warned > 1 ? 's' : ''}</span>` : ''} <span class="meta-tag">${bundle.runs.length} runs</span></div>
    ${runSummaryTable(['Agent', 'Workflow', 'Passed', 'Failed', 'Warnings', 'Status'], summaryRows)}
    ${runTabs}
    ${runPanels}`;
}

const LAYER_META = {
  'Installer Tests': {
    tab: 'installer',
    scope: 'Install, update, and uninstall lifecycle for Claude, Cursor, and Codex — real CLI runs in isolated temp directories.',
    run: 'Always runs · ~2 min',
    description: 'Unit and integration tests for the full install/update/uninstall lifecycle. Runs the real CLI in isolated temp dirs. Covers MCP merge, fenced block parsing, version checks, Claude/Cursor/Codex installers, and meta scripts.',
  },
  'Static Skill Tests': {
    tab: 'static',
    scope: 'Skill file structure, manifests, and shared scripts — no API calls; catches structural regressions in milliseconds.',
    run: 'Always runs · <1 sec',
    description: 'No API calls. Validates skill file structure, manifests, shared scripts, and version locks against known-good patterns. Catches structural regressions in milliseconds.',
  },
  'Regex Eval Tests': {
    tab: 'evals-regex',
    scope: 'Each SKILL.md is checked against every eval scenario rule — fast, deterministic content gate before any LLM run.',
    run: 'Always runs · ~80ms',
    description: 'Checks that each SKILL.md contains the rules and content required by every eval scenario. No LLM needed — fast and deterministic. First gate against skill content regressions.',
  },
  'LLM Eval Tests (CLI)': {
    tab: 'evals-cli',
    scope: 'Scenarios run through claude --print; responses must match expected agent behavior — catches reasoning failures regex cannot.',
    run: 'Opt-in · --llm-eval · ~15 min',
    description: 'Sends each scenario to <code>claude --print</code> and verifies the model\'s response matches expected agent behavior. Catches reasoning failures that regex cannot detect. Requires claude CLI with active subscription.',
  },
  'E2E Tests': {
    tab: 'e2e',
    scope: 'End-to-end path from fw-dev-tools install through agent session, build validation, and meta tracking across the full stack.',
    run: 'Opt-in · --e2e · ~30–60 min',
    description: 'Full end-to-end workflow — installs fw-dev-tools, runs a real agent session, validates build output and meta tracking. Catches integration failures across the entire stack.',
  },
};

function summaryPanel(layers) {
  if (!layers) return '<p class="empty">No results — run the all-tests suite first.</p>';

  let totalPassed = 0;
  let totalFailed = 0;

  const cards = layers.map(l => {
    const meta = LAYER_META[l.name] ?? { tab: null, scope: '', description: '', run: '' };
    const skipped = l.passes === 'skipped';
    const live = liveCountMap[l.name];
    const passes = skipped ? null : (live?.passes ?? parseInt(l.passes, 10) ?? 0);
    const fails  = skipped ? null : (live?.fails  ?? parseInt(l.fails,  10) ?? 0);
    const total = passes !== null ? passes + fails : 0;
    // Trust live test counts when available; exit_code alone can be stale after partial re-runs.
    const failed = skipped ? false : (total > 0 ? fails > 0 : l.exit_code !== 0);

    if (!skipped) {
      totalPassed += passes;
      totalFailed += fails;
    }

    const statusCls = skipped ? 'card-skipped' : failed ? 'card-fail' : 'card-pass';
    const statusLabel = skipped ? 'Skipped' : failed ? 'Failed' : 'Passed';
    const scopeLine = meta.scope || meta.description;
    const onclick = meta.tab ? ` onclick="switchTab('${meta.tab}')"` : '';
    const scoreText = skipped ? '—' : `${passes}/${total}`;

    const agentNote = layerAgentNote(l.name);
    const metaLine = agentNote
      ? `${meta.run} · Agent: ${agentNote}`
      : meta.run;

    return `<button type="button" class="layer-row ${statusCls}"${onclick}${meta.tab ? '' : ' disabled'}>
      <span class="layer-row-body">
        <span class="layer-row-title">${esc(l.name)}</span>
        <span class="layer-row-scope">${esc(scopeLine)}</span>
        <span class="layer-row-meta">${esc(metaLine)}</span>
      </span>
      <span class="layer-row-score">${scoreText}</span>
      <span class="layer-row-pill ${statusCls}">${statusLabel}</span>
      <span class="layer-row-chevron" aria-hidden="true">›</span>
    </button>`;
  }).join('');

  const grandTotal = totalPassed + totalFailed;
  const passRate = grandTotal > 0 ? Math.round((totalPassed / grandTotal) * 100) : 0;

  const hero = `<section class="summary-hero">
    <div class="stat-card">
      <span class="stat-label">Tests</span>
      <span class="stat-value">${grandTotal}</span>
    </div>
    <div class="stat-card stat-pass">
      <span class="stat-label">Passed</span>
      <span class="stat-value">${totalPassed}</span>
    </div>
    <div class="stat-card stat-fail">
      <span class="stat-label">Failed</span>
      <span class="stat-value">${totalFailed}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Pass rate</span>
      <span class="stat-value">${passRate}<span class="stat-suffix">%</span></span>
    </div>
  </section>`;

  return `${hero}<h2 class="summary-section-title">Test layers</h2><div class="layer-list">${cards}</div>`;
}

// ── Live counts override (beats stale all-tests-results.json) ────────────

// Build a map of layer-name → {passes, fails} from the actual result files
// so the summary card always shows counts consistent with the detail tabs.
const liveCountMap = {
  'Installer Tests':     { passes: installerTests.filter(t => t.pass).length,  fails: installerTests.filter(t => !t.pass).length },
  'Static Skill Tests':  { passes: staticTests.filter(t => t.pass).length,     fails: staticTests.filter(t => !t.pass).length },
  'Regex Eval Tests':    { passes: regexEvalTests.filter(t => t.pass).length,  fails: regexEvalTests.filter(t => !t.pass).length },
  ...(evalBundle ? {
    'LLM Eval Tests (CLI)': (() => {
      const s = evalBundleStats(evalBundle);
      return { passes: s.passed, fails: s.failed };
    })(),
  } : {}),
  ...(e2eBundle ? {
    'E2E Tests': (() => {
      const s = e2eBundleStats(e2eBundle);
      return { passes: s.passed, fails: s.failed };
    })(),
  } : {}),
};

// ── Tab badge counts ──────────────────────────────────────────────────────

function tabCount(tests) {
  if (!tests.length) return '';
  const fail = tests.filter(t => !t.pass).length;
  return fail ? ` <span class="tab-badge fail">${fail}</span>` : ` <span class="tab-badge pass">${tests.length}</span>`;
}

const regexEvalFail = regexEvalTests.filter(t => !t.pass).length;
const evalStats = evalBundle ? evalBundleStats(evalBundle) : null;
const e2eStats = e2eBundle ? e2eBundleStats(e2eBundle) : null;
const evalFail = evalStats ? evalStats.failed : -1;
const e2eFail = e2eStats ? e2eStats.failed : -1;
const evalTabCount = evalStats ? evalStats.total : 0;
const e2eTabCount = e2eStats ? e2eStats.checks : 0;

const overallPass = overall ? overall.overall === 'pass' : null;
const overallBadge = overallPass === null
  ? '<span class="badge skip">No data yet</span>'
  : overallPass
    ? '<span class="badge pass">All layers passed</span>'
    : '<span class="badge fail">Some layers failed</span>';

const runAgentNotes = [];
if (evalBundle?.runs?.length) {
  const label = evalBundle.mode === 'multi'
    ? `LLM eval: ${bundleAgentLabels(evalBundle).join(', ')}`
    : `LLM eval: ${formatAgentLabel(evalBundle.runs[0].agent)}`;
  runAgentNotes.push(label);
}
if (e2eBundle?.runs?.length) {
  const label = e2eBundle.mode === 'multi'
    ? `E2E: ${e2eBundle.runs.length} runs (${bundleAgentLabels(e2eBundle).join(', ')})`
    : `E2E: ${formatAgentLabel(e2eBundle.runs[0].agent)}${e2eBundle.runs[0].workflow ? ` · ${e2eBundle.runs[0].workflow}` : ''}`;
  runAgentNotes.push(label);
}
const headerAgentsHtml = runAgentNotes.length
  ? `<p class="header-agents">${runAgentNotes.map(esc).join(' · ')}</p>`
  : '';

const evalAgentTab = evalBundle?.runs?.length
  ? (evalBundle.mode === 'multi'
    ? ` <span class="tab-agent">${bundleAgentLabels(evalBundle).length} agents</span>`
    : ` <span class="tab-agent">${esc(formatAgentLabel(evalBundle.runs[0].agent))}</span>`)
  : '';
const e2eAgentTab = e2eBundle?.runs?.length
  ? (e2eBundle.mode === 'multi'
    ? ` <span class="tab-agent">${bundleAgentLabels(e2eBundle).length} agents</span>`
    : ` <span class="tab-agent">${esc(formatAgentLabel(e2eBundle.runs[0].agent))}</span>`)
  : '';

// ── Full HTML ─────────────────────────────────────────────────────────────

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All Tests Report — ${date}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f7f8fa;
      --bg-accent: #eef1f6;
      --surface: #ffffff;
      --surface-raised: #fbfcfd;
      --border: #e4e8ef;
      --border-soft: #eef1f5;
      --text: #1a1f2e;
      --text-secondary: #5c6578;
      --text-muted: #8b95a8;
      --accent: #3b5bdb;
      --accent-soft: #edf2ff;
      --pass: #0d9488;
      --pass-bg: #f0fdfa;
      --pass-border: #99f6e4;
      --fail: #e11d48;
      --fail-bg: #fff1f2;
      --fail-border: #fecdd3;
      --warn: #d97706;
      --warn-bg: #fffbeb;
      --shadow-sm: 0 1px 2px rgba(26, 31, 46, 0.04);
      --shadow-md: 0 12px 40px rgba(26, 31, 46, 0.07);
      --radius: 16px;
      --radius-sm: 12px;
      --font: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --mono: ui-monospace, "SF Mono", "Cascadia Code", monospace;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font);
      font-size: 15px;
      line-height: 1.6;
      color: var(--text);
      background:
        radial-gradient(ellipse 70% 45% at 50% -10%, rgba(59, 91, 219, 0.07), transparent),
        linear-gradient(180deg, var(--bg-accent) 0%, var(--bg) 50%);
      min-height: 100vh;
      padding: 36px 24px 56px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .container { max-width: 1120px; margin: 0 auto; }

    .report-shell {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: calc(var(--radius) + 4px);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    /* ── Header ── */
    .page-header {
      padding: 28px 32px 0;
      background: linear-gradient(180deg, var(--surface-raised) 0%, var(--surface) 100%);
      border-bottom: 1px solid var(--border-soft);
    }

    .header-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .header-brand { flex: 1; min-width: 0; }

    .eyebrow {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 8px;
    }

    .page-header h1 {
      font-family: var(--font);
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.025em;
      line-height: 1.25;
      color: var(--text);
      margin-bottom: 4px;
    }

    .header-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .meta {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      align-items: center;
    }

    .meta-date {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      background: var(--surface);
      border: 1px solid var(--border);
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    /* ── Badges ── */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 12px;
      letter-spacing: 0.01em;
      border: 1px solid transparent;
    }
    .badge.pass  { background: var(--pass-bg); color: #047857; border-color: var(--pass-border); }
    .badge.fail  { background: var(--fail-bg); color: #b91c1c; border-color: var(--fail-border); }
    .badge.skip  { background: #f1f5f9; color: var(--text-muted); border-color: var(--border); }
    .badge.warn  { background: var(--warn-bg); color: #b45309; border-color: #fde68a; }
    .badge-sep { opacity: 0.45; margin: 0 2px; }

    /* ── Tabs ── */
    .tabs {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
      margin: 0 -32px;
      padding: 0 32px;
      border-top: 1px solid var(--border-soft);
    }
    .tabs::-webkit-scrollbar { display: none; }

    .tab {
      background: none;
      border: none;
      padding: 12px 16px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      transition: color 0.15s, background 0.15s;
      display: flex;
      align-items: center;
      gap: 7px;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
    }

    .tab:hover { color: var(--text-secondary); background: rgba(37, 99, 235, 0.04); }
    .tab.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
      font-weight: 600;
      background: transparent;
    }

    .tab-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }
    .tab-badge.pass { background: var(--pass-bg); color: var(--pass); }
    .tab-badge.fail { background: var(--fail-bg); color: var(--fail); }
    .tab-badge.skip { background: #f1f5f9; color: var(--text-muted); }

    /* ── Panels ── */
    .panel { display: none; }
    .panel.active { display: block; animation: fadeIn 0.25s ease; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card { padding: 28px 32px 32px; }

    /* ── Summary hero stats ── */
    .summary-hero {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }

    @media (max-width: 720px) {
      .summary-hero { grid-template-columns: repeat(2, 1fr); }
    }

    .stat-card {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: var(--radius-sm);
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: none;
    }

    .stat-card.stat-pass {
      background: #eef6f2;
      border-color: #cfe8dc;
    }
    .stat-card.stat-fail {
      background: #f8eeee;
      border-color: #e8cccc;
    }

    .stat-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }

    .stat-value {
      font-family: var(--font);
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -0.03em;
      line-height: 1;
      color: var(--text);
      font-variant-numeric: tabular-nums;
    }

    .stat-suffix { font-size: 16px; font-weight: 600; color: var(--text-secondary); margin-left: 1px; }

    .summary-section-title {
      font-family: var(--font);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    /* ── Layer rows (single-line list) ── */
    .layer-list {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      background: var(--surface);
      box-shadow: var(--shadow-sm);
    }

    .layer-row {
      display: grid;
      grid-template-columns: 1fr auto auto 18px;
      align-items: center;
      gap: 16px;
      width: 100%;
      min-height: 88px;
      padding: 20px 22px 20px 18px;
      border: none;
      border-bottom: 1px solid var(--border-soft);
      background: var(--surface);
      text-align: left;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s ease;
      border-left: 3px solid transparent;
    }

    .layer-row:last-child { border-bottom: none; }
    .layer-row:hover:not(:disabled) { background: #f8fafc; }
    .layer-row:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: -2px;
      z-index: 1;
    }
    .layer-row:disabled { cursor: default; opacity: 0.65; }

    .layer-row.card-pass { border-left-color: var(--pass); }
    .layer-row.card-fail { border-left-color: var(--fail); background: #fffcfc; }
    .layer-row.card-skipped { border-left-color: #d1d5db; }

    .layer-row-body {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding-right: 8px;
    }

    .layer-row-title {
      font-family: var(--font);
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text);
      line-height: 1.3;
    }

    .layer-row-scope {
      font-size: 13px;
      font-weight: 400;
      color: var(--text-secondary);
      line-height: 1.55;
    }

    .layer-row-meta {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-muted);
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .layer-row-score {
      font-family: var(--font);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--text-secondary);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .layer-row.card-pass .layer-row-score { color: var(--pass); }
    .layer-row.card-fail .layer-row-score { color: var(--fail); }

    .layer-row-pill {
      font-family: var(--font);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 5px 10px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .layer-row-pill.card-pass { background: var(--pass-bg); color: var(--pass); }
    .layer-row-pill.card-fail { background: var(--fail-bg); color: var(--fail); }
    .layer-row-pill.card-skipped { background: #f1f5f9; color: var(--text-muted); }

    .layer-row-chevron {
      font-family: var(--font);
      font-size: 18px;
      line-height: 1;
      color: #c8ced8;
      font-weight: 400;
      transition: color 0.15s, transform 0.15s;
    }
    .layer-row:hover:not(:disabled) .layer-row-chevron {
      color: var(--text-secondary);
      transform: translateX(2px);
    }

    @media (max-width: 720px) {
      .layer-row {
        grid-template-columns: 1fr auto;
        grid-template-rows: auto auto;
        gap: 10px 12px;
        padding: 18px 16px;
        min-height: 0;
      }
      .layer-row-pill { grid-column: 2; grid-row: 1; align-self: start; }
      .layer-row-score { grid-column: 2; grid-row: 2; justify-self: end; }
      .layer-row-chevron { display: none; }
    }

    /* ── Layer bar ── */
    .layer-bar {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-soft);
    }

    .meta-tag {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
      padding: 4px 10px;
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 999px;
    }

    .agent-tag {
      font-size: 12px;
      font-weight: 600;
      color: var(--accent);
      padding: 4px 10px;
      background: var(--accent-soft);
      border: 1px solid #c7d7fe;
      border-radius: 999px;
      white-space: nowrap;
    }

    .header-agents {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .tab-agent {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    .tab.active .tab-agent { color: var(--accent); }

    /* ── Sub-tabs ── */
    .sub-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 18px;
    }

    .sub-tab {
      background: var(--surface-raised);
      border: 1px solid var(--border);
      padding: 6px 14px;
      border-radius: 999px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .sub-tab:hover { border-color: #cbd5e1; color: var(--text); }
    .sub-tab.active {
      background: var(--accent-soft);
      border-color: #93c5fd;
      color: var(--accent);
      font-weight: 600;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
    }

    .sub-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
    }
    .sub-badge.pass { background: var(--pass-bg); color: var(--pass); }
    .sub-badge.fail { background: var(--fail-bg); color: var(--fail); }

    .sub-panel { display: none; }
    .sub-panel.active { display: block; animation: fadeIn 0.2s ease; }

    /* ── Tables ── */
    .table-wrap {
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      overflow: hidden;
      background: var(--surface);
    }

    table { width: 100%; border-collapse: collapse; }

    th {
      text-align: left;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      padding: 11px 16px;
      background: #f8fafc;
      border-bottom: 1px solid var(--border);
    }

    td {
      padding: 11px 16px;
      border-bottom: 1px solid var(--border-soft);
      vertical-align: middle;
    }

    tr:last-child td { border-bottom: none; }
    tbody tr { transition: background 0.12s; }
    tbody tr:hover td { background: #fafbfe; }
    .row-fail td { background: #fff8f8; }
    .row-fail:hover td { background: #fff1f1; }
    .row-warn td { background: #fffdf5; }

    .icon-cell { width: 44px; text-align: center; }
    .name-cell { color: var(--text); font-size: 13px; }
    .dur-cell {
      width: 88px;
      text-align: right;
      color: var(--text-muted);
      font-family: var(--mono);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }
    .dur-unit { font-size: 10px; opacity: 0.7; margin-left: 1px; }
    .att-cell { width: 80px; text-align: center; color: var(--text-secondary); font-variant-numeric: tabular-nums; }
    .err-cell { max-width: 380px; }

    .phase-cell {
      white-space: nowrap;
      font-size: 12px;
      color: var(--text-muted);
      width: 200px;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-icon {
      display: inline-block;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .status-icon.pass { background: #22c55e; box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18); }
    .status-icon.fail { background: #ef4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.16); }
    .status-icon.warn { background: #f59e0b; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18); }

    .id-tag {
      background: #f1f5f9;
      padding: 3px 8px;
      border-radius: 6px;
      font-family: var(--mono);
      font-size: 11px;
      white-space: nowrap;
      color: #334155;
      border: 1px solid var(--border-soft);
    }

    code {
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 5px;
      font-family: var(--mono);
      font-size: 11px;
      color: #334155;
      word-break: break-word;
    }

    .agent-summary { margin-bottom: 20px; }
    .agent-summary th, .agent-summary td { font-size: 13px; }

    .empty {
      color: var(--text-muted);
      padding: 48px 24px;
      text-align: center;
      font-size: 14px;
      background: var(--surface-raised);
      border: 1px dashed var(--border);
      border-radius: var(--radius-sm);
    }

    footer {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 24px;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="report-shell">
    <div class="page-header">
      <div class="header-top">
        <div class="header-brand">
          <span class="eyebrow">fw-dev-tools</span>
          <h1>All Tests Report</h1>
          <p class="header-subtitle">Installer · Static · Regex · LLM · E2E</p>
          ${headerAgentsHtml}
        </div>
        <div class="meta">
          ${overallBadge}
          <span class="meta-date">${date}</span>
        </div>
      </div>
      <div class="tabs">
      <button class="tab active" data-tab="summary">Summary</button>
      <button class="tab" data-tab="installer">Installer${tabCount(installerTests)}</button>
      <button class="tab" data-tab="static">Static${tabCount(staticTests)}</button>
      <button class="tab" data-tab="evals-regex">Regex Evals${regexEvalTests.length > 0 ? (regexEvalFail > 0 ? ` <span class="tab-badge fail">${regexEvalFail}</span>` : ` <span class="tab-badge pass">${regexEvalTests.length}</span>`) : ''}</button>
      <button class="tab" data-tab="evals-cli">LLM Evals${evalAgentTab}${evalFail >= 0 ? (evalFail > 0 ? ` <span class="tab-badge fail">${evalFail}</span>` : ` <span class="tab-badge pass">${evalTabCount}</span>`) : ' <span class="tab-badge skip">skipped</span>'}</button>
      <button class="tab" data-tab="e2e">E2E${e2eAgentTab}${e2eFail >= 0 ? (e2eFail > 0 ? ` <span class="tab-badge fail">${e2eFail}</span>` : ` <span class="tab-badge pass">${e2eTabCount}</span>`) : ' <span class="tab-badge skip">skipped</span>'}</button>
      </div>
    </div>

    <div class="panel active" id="panel-summary">
      <div class="card">
        ${summaryPanel(overall?.layers)}
      </div>
    </div>

    <div class="panel" id="panel-installer">
      <div class="card">
        ${nodeTestPanel(installerTests, 'installer', t => fileLabel(t.file))}
      </div>
    </div>

    <div class="panel" id="panel-static">
      <div class="card">
        ${nodeTestPanel(staticTests, 'static', t => skillFromName(t.name))}
      </div>
    </div>

    <div class="panel" id="panel-evals-regex">
      <div class="card">
        ${nodeTestPanel(regexEvalTests, 'regex-eval', t => skillFromName(t.name))}
      </div>
    </div>

    <div class="panel" id="panel-evals-cli">
      <div class="card">
        ${evalBundle ? evalPanel(evalBundle) : '<p class="empty">LLM Evals not run — use <code>--llm-eval</code> flag.</p>'}
      </div>
    </div>

    <div class="panel" id="panel-e2e">
      <div class="card">
        ${e2ePanel(e2eBundle)}
      </div>
    </div>
    </div>

    <footer>Generated by fw-dev-tools all-tests suite · ${date}</footer>
  </div>

  <script>
    // Main tabs
    document.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
      });
    });

    // Sub-tabs — scoped to their card container so different tabs don't interfere
    document.querySelectorAll('.sub-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const subTabBar = btn.closest('.sub-tabs');
        const container = subTabBar.parentElement;
        subTabBar.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
        container.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('sub-' + btn.dataset.subTab).classList.add('active');
      });
    });

    // switchTab — used by Summary layer card "View details →" buttons
    function switchTab(tabId) {
      const btn = document.querySelector('.tab[data-tab="' + tabId + '"]');
      if (!btn) return;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-' + tabId).classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  </script>
</body>
</html>
`;

await writeFile(R('all-tests-report.html'), html, 'utf8');

const iCount = installerTests.length;
const sCount = staticTests.length;
const rCount = regexEvalTests.length;
const eCount = evalStats?.total ?? 0;
const e2Count = e2eStats?.checks ?? 0;
console.log(`\nReport written: tests/all-tests-report.html`);
console.log(`  Installer ${iCount} · Static ${sCount} · Regex Evals ${rCount} · LLM Evals ${eCount || 'skipped'}${evalBundle?.mode === 'multi' ? ` (${evalBundle.runs.length} agents)` : ''} · E2E ${e2Count || 'skipped'}${e2eBundle?.mode === 'multi' ? ` (${e2eBundle.runs.length} runs)` : ''}`);
