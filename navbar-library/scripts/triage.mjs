import fs from 'node:fs';
const sites = JSON.parse(fs.readFileSync('scripts/sites.json', 'utf8'));
const rows = [];
for (const s of sites) {
  const p = `evidence/${s.id}/inspection.json`;
  if (!fs.existsSync(p)) { rows.push({ ...s, verdict: 'NO-DATA', detail: 'inspection never produced a record' }); continue; }
  const r = JSON.parse(fs.readFileSync(p, 'utf8'));
  const d = r.viewports?.desktop?.initial;
  const vpCount = Object.values(r.viewports || {}).filter(v => v.initial?.found).length;
  let verdict, detail;
  if (!r.ok && r.errors?.length) { verdict = 'ERROR'; detail = r.errors[0]; }
  else if (r.status && r.status >= 400) { verdict = 'BLOCKED'; detail = `HTTP ${r.status}`; }
  else if (!d?.found) { verdict = 'NAV-NOT-FOUND'; detail = `page loaded (HTTP ${r.status}) but no navbar candidate scored above threshold`; }
  else if ((d.interactiveCount || 0) === 0) { verdict = 'NAV-WEAK'; detail = `container found (${Math.round(d.container.rect.h)}px ${d.container.position}) but 0 interactive children detected`; }
  else { verdict = 'USABLE'; detail = `${Math.round(d.container.rect.h)}px ${d.container.position}, ${d.interactiveCount} interactive, ${vpCount}/4 viewports`; }
  rows.push({ ...s, verdict, detail, status: r.status, vpCount });
}
const order = { USABLE: 0, 'NAV-WEAK': 1, 'NAV-NOT-FOUND': 2, BLOCKED: 3, ERROR: 4, 'NO-DATA': 5 };
rows.sort((a, b) => order[a.verdict] - order[b.verdict] || a.id.localeCompare(b.id));
const counts = {};
for (const r of rows) counts[r.verdict] = (counts[r.verdict] || 0) + 1;
console.log('SUMMARY:', JSON.stringify(counts));
for (const r of rows) console.log(`${r.verdict.padEnd(14)} ${r.id.padEnd(18)} ${r.detail}`);
fs.writeFileSync('reports/accessibility.json', JSON.stringify({ generatedAt: new Date().toISOString(), counts, rows }, null, 1));
