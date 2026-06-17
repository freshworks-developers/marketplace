/**
 * Reads e2e-results.json and writes e2e-report.html.
 * Run automatically by e2e.sh, or manually: node tests/e2e-report.js
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let raw;
try {
  raw = await readFile(join(__dirname, 'e2e-results.json'), 'utf8');
} catch {
  console.log('No e2e-results.json found — run ./tests/e2e.sh first.');
  process.exit(0);
}

const { timestamp, branch, client, outputDir, overall, passed, failed, warned, checks } = JSON.parse(raw);
const date = new Date(timestamp).toISOString().split('T')[0];
const time = new Date(timestamp).toISOString().split('T')[1].replace('.000Z', ' UTC');
const total = passed + failed;
const allPass = overall === 'pass';

// ─── group checks by phase ───────────────────────────────────────────────────
const phases = {};
for (const c of checks) {
  if (!phases[c.phase]) phases[c.phase] = [];
  phases[c.phase].push(c);
}

// ─── status badge ────────────────────────────────────────────────────────────
const statusBadge = allPass
  ? `<span class="badge pass">✅ ${passed}/${total} passed</span>`
  : `<span class="badge fail">❌ ${failed} failed &nbsp;·&nbsp; ${passed}/${total} passed</span>`;

// ─── phase cards ─────────────────────────────────────────────────────────────
const phaseCards = Object.entries(phases).map(([phase, items]) => {
  const phasePass = items.every(i => i.status !== 'fail');
  const phaseIcon = phasePass ? '✅' : '❌';

  const rows = items.map(i => {
    const icon = i.status === 'pass' ? '✅' : i.status === 'fail' ? '❌' : '⚠️';
    const rowClass = i.status === 'fail' ? 'row-fail' : i.status === 'warn' ? 'row-warn' : '';
    return `
      <tr class="${rowClass}">
        <td class="result-cell">${icon}</td>
        <td>${i.label}</td>
      </tr>`;
  }).join('');

  return `
  <div class="card">
    <h2>${phaseIcon} ${phase}</h2>
    <table>
      <thead>
        <tr>
          <th style="width:48px;text-align:center">Status</th>
          <th>Check</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}).join('');

// ─── failures summary ────────────────────────────────────────────────────────
const failures = checks.filter(c => c.status === 'fail');
const warnings = checks.filter(c => c.status === 'warn');

const failureSection = failures.length > 0 ? `
  <div class="card">
    <h2>❌ Failures</h2>
    ${failures.map(f => `
    <div class="failure-block">
      <strong>${f.phase}</strong> — ${f.label}
    </div>`).join('')}
  </div>` : '';

const warningSection = warnings.length > 0 ? `
  <div class="card">
    <h2>⚠️ Warnings</h2>
    ${warnings.map(w => `
    <div class="warning-block">
      <strong>${w.phase}</strong> — ${w.label}
    </div>`).join('')}
  </div>` : '';

// ─── HTML ────────────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E2E Test Report — ${date}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #1a1a2e;
      background: #f5f5f7;
      padding: 32px 24px;
    }

    .container { max-width: 860px; margin: 0 auto; }

    header {
      background: #fff;
      border-radius: 12px;
      padding: 24px 28px;
      margin-bottom: 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }

    header h1 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 12px;
      color: #0f0f23;
    }

    .meta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
      font-size: 13px;
      color: #555;
    }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 13px;
    }
    .badge.pass { background: #d1fae5; color: #065f46; }
    .badge.fail { background: #fee2e2; color: #991b1b; }

    .meta-item { display: flex; align-items: center; gap: 6px; }

    .tag {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .card {
      background: #fff;
      border-radius: 12px;
      padding: 24px 28px;
      margin-bottom: 20px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }

    .card h2 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 14px;
      color: #0f0f23;
    }

    table { width: 100%; border-collapse: collapse; }

    th {
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #666;
      padding: 6px 10px;
      border-bottom: 2px solid #e5e7eb;
    }

    td { padding: 9px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }

    .row-fail td { background: #fff5f5; }
    .row-warn td { background: #fffbeb; }

    .result-cell { font-size: 15px; text-align: center; }

    code {
      background: #f3f4f6;
      padding: 1px 6px;
      border-radius: 4px;
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 12px;
    }

    .failure-block {
      border-left: 3px solid #f87171;
      padding: 10px 14px;
      margin-bottom: 10px;
      background: #fff5f5;
      border-radius: 0 8px 8px 0;
      font-size: 13px;
    }

    .warning-block {
      border-left: 3px solid #fbbf24;
      padding: 10px 14px;
      margin-bottom: 10px;
      background: #fffbeb;
      border-radius: 0 8px 8px 0;
      font-size: 13px;
    }

    .all-pass {
      text-align: center;
      padding: 20px;
      color: #065f46;
      font-weight: 600;
      font-size: 15px;
    }

    footer {
      text-align: center;
      font-size: 12px;
      color: #999;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>E2E Test Report</h1>
      <div class="meta">
        ${statusBadge}
        <span class="meta-item">📅 ${date} ${time}</span>
        <span class="meta-item">Branch: <span class="tag">${branch}</span></span>
        <span class="meta-item">Client: <span class="tag">${client}</span></span>
        ${warned > 0 ? `<span class="meta-item">⚠️ ${warned} warning${warned > 1 ? 's' : ''}</span>` : ''}
      </div>
    </header>

    ${phaseCards}

    ${failureSection}
    ${warningSection}

    ${failures.length === 0 && warnings.length === 0 ? `
    <div class="card">
      <p class="all-pass">🎉 All ${total} checks passed</p>
    </div>` : ''}

    <footer>Generated by <code>./tests/e2e.sh</code> · output dir: <code>${outputDir}</code></footer>
  </div>
</body>
</html>
`;

await writeFile(join(__dirname, 'e2e-report.html'), html, 'utf8');
console.log(`  tests/e2e-report.html`);
