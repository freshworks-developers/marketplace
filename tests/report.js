/**
 * Reads eval-results.json and writes eval-report.html.
 * Run automatically after: npm run eval
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let raw;
try {
  raw = await readFile(join(__dirname, 'eval-results.json'), 'utf8');
} catch {
  console.log('No eval-results.json found — run "npm run eval" with ANTHROPIC_API_KEY set.');
  process.exit(0);
}

const { model, timestamp, results } = JSON.parse(raw);
const date = new Date(timestamp).toISOString().split('T')[0];
const passed = results.filter(r => r.pass).length;
const total = results.length;
const allPass = passed === total;

// ---------------------------------------------------------------------------
// HTML report
// ---------------------------------------------------------------------------

const statusBadge = allPass
  ? `<span class="badge pass">✅ ${passed}/${total} passed</span>`
  : `<span class="badge fail">❌ ${total - passed} failed &nbsp;·&nbsp; ${passed}/${total} passed</span>`;

const htmlRows = results.map(r => {
  const icon = r.pass ? '✅' : '❌';
  const rowClass = r.pass ? 'row-pass' : 'row-fail';
  return `
    <tr class="${rowClass}">
      <td><code>${r.id}</code></td>
      <td><span class="skill-tag">${r.skill}</span></td>
      <td>${r.label}</td>
      <td class="result-cell">${icon}</td>
      <td class="attempts-cell">${r.passed}/${r.total}</td>
    </tr>`;
}).join('');

const failureDetails = results
  .filter(r => !r.pass)
  .map(r => {
    const lastErr = r.attempts.findLast(a => !a.pass)?.error ?? 'unknown';
    return `
    <div class="failure-block">
      <h3>❌ <code>${r.id}</code> — ${r.label}</h3>
      <p><strong>Error:</strong> <code>${lastErr}</code></p>
    </div>`;
  }).join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Skill Eval Report — ${date}</title>
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

    .container { max-width: 960px; margin: 0 auto; }

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
      margin-bottom: 10px;
      color: #0f0f23;
    }

    .meta { display: flex; gap: 20px; flex-wrap: wrap; align-items: center; font-size: 13px; color: #555; }

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 13px;
    }
    .badge.pass { background: #d1fae5; color: #065f46; }
    .badge.fail { background: #fee2e2; color: #991b1b; }

    .card {
      background: #fff;
      border-radius: 12px;
      padding: 24px 28px;
      margin-bottom: 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }

    .card h2 { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #0f0f23; }

    table { width: 100%; border-collapse: collapse; }

    th {
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #666;
      padding: 8px 12px;
      border-bottom: 2px solid #e5e7eb;
    }

    td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }

    tr:last-child td { border-bottom: none; }

    .row-fail td { background: #fff5f5; }

    .result-cell { font-size: 16px; text-align: center; }
    .attempts-cell { text-align: center; color: #666; font-size: 13px; }

    .skill-tag {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }

    code {
      background: #f3f4f6;
      padding: 1px 6px;
      border-radius: 4px;
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 12px;
    }

    .failure-block {
      border-left: 3px solid #f87171;
      padding: 12px 16px;
      margin-bottom: 12px;
      background: #fff5f5;
      border-radius: 0 8px 8px 0;
    }

    .failure-block h3 { font-size: 14px; margin-bottom: 6px; }
    .failure-block p { font-size: 13px; color: #444; }

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
      <h1>Skill Eval Report</h1>
      <div class="meta">
        ${statusBadge}
        <span>📅 ${date}</span>
        <span>🤖 <code>${model}</code></span>
      </div>
    </header>

    <div class="card">
      <h2>Results</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Skill</th>
            <th>Scenario</th>
            <th style="text-align:center">Result</th>
            <th style="text-align:center">Attempts</th>
          </tr>
        </thead>
        <tbody>
          ${htmlRows}
        </tbody>
      </table>
    </div>

    ${failureDetails ? `
    <div class="card">
      <h2>Failures</h2>
      ${failureDetails}
    </div>` : `
    <div class="card">
      <p class="all-pass">🎉 All ${total} scenarios passed</p>
    </div>`}

    <footer>Generated by <code>npm run eval</code></footer>
  </div>
</body>
</html>
`;

await writeFile(join(__dirname, 'eval-report.html'), html, 'utf8');

console.log(`\nReport written (${passed}/${total} passed):`);
console.log(`  tests/eval-report.html`);
