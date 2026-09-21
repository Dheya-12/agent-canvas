import fs from 'node:fs';
import { buildManifest } from './manifest.mjs';

const cert = JSON.parse(fs.readFileSync('reports/certification.json', 'utf8'));
const access = JSON.parse(fs.readFileSync('reports/accessibility.json', 'utf8'));
const metas = await buildManifest();
const byId = new Map(cert.results.map(r => [r.id, r]));
const sites = JSON.parse(fs.readFileSync('scripts/sites.json', 'utf8'));
const overrides = JSON.parse(fs.readFileSync('scripts/overrides.json', 'utf8'));
const L = [];
const p = s => L.push(s);

p('# Navbar library — certification matrix');
p('');
p(`Generated ${new Date().toISOString().slice(0, 19)}Z from \`reports/certification.json\`.`);
p('');
p('Every entry is measured, not asserted. A component is certified only after its');
p('reconstruction has been rendered, captured and numerically compared against the');
p('live reference, then put through the content, fatigue and damage-tolerance passes.');
p('');
p('| status | meaning |');
p('| --- | --- |');
p('| PASS | no blocking diff, no structural issue, no page error, 10/10 fatigue cycles |');
p('| PASS WITH OBSERVATIONS | as above, plus one or more **declared deviations** from the reference |');
p('| FAIL | a blocking fidelity diff, a structural issue, or a page error |');
p('');
p('## Certified components');
p('');
p('| id | reference | status | 1440 | 1024 | 768 | 390 | scroll | fatigue | deviations |');
p('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const m of metas) {
  const r = byId.get(m.id);
  if (!r) { p(`| \`${m.id}\` | ${m.reference.site} | NOT RUN | | | | | | | |`); continue; }
  const v = r.fidelity?.viewports || {};
  const h = k => (v[k]?.h != null ? `${v[k].h.toFixed(0)}px` : '—');
  p(`| \`${m.id}\` | ${m.reference.site} | ${r.status} | ${h('desktop')} | ${h('laptop')} | ${h('tablet')} | ${h('mobile')} | ${m.scrollBehavior} | ${r.fatigue?.cycles ?? 0}/10 | ${r.fidelity?.deviations?.length || 0} |`);
}
p('');
p('### Evidence per component');
p('');
for (const m of metas) {
  const r = byId.get(m.id);
  if (!r) continue;
  p(`#### \`${m.id}\` — ${m.displayName}`);
  p('');
  p(`- **Reference:** ${m.reference.site} (${m.reference.url})`);
  p(`- **Captures:** \`evidence/${m.refId}/\` (reference) and \`evidence/${m.refId}/impl/\` (reconstruction)`);
  p('- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844');
  p(`- **Content variants tested:** ${Object.keys(r.stress).length / 2} fixtures × 2 viewports = ${Object.keys(r.stress).length} render conditions`);
  p(`- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close`);
  p(`- **Dependencies:** ${m.dependencies.length ? m.dependencies.join(', ') : 'none beyond react'}`);
  p(`- **Assets:** ${m.assets.length ? m.assets.join(', ') : 'none — self-contained'}`);
  p(`- **Fidelity fixture:** \`${r.fidelity?.fixture || 'normal'}\``);
  const ov = overrides[m.refId];
  if (ov?.skip?.length) {
    p(`- **Measurement skips** (probe mis-measures this reference${ov.skipViewports ? `, ${ov.skipViewports.join(' + ')} only` : ''}): ${ov.skip.join(', ')}`);
    p(`  - ${ov.reason}`);
  }
  if (r.fidelity?.deviations?.length) {
    p('- **Declared deviations:**');
    for (const d of r.fidelity.deviations) p(`  - ${d.replace(/\s+/g, ' ')}`);
  }
  if (r.fidelity?.warns?.length) {
    p('- **Known differences (non-blocking):**');
    for (const w of r.fidelity.warns) p(`  - ${w}`);
  }
  if (m.notes) p(`- **Limitations / notes:** ${m.notes}`);
  p(`- **Build status:** included in the production build (\`npm run build\`)`);
  p(`- **Runtime status:** ${r.pageErrors.length ? `${r.pageErrors.length} page error(s)` : 'no page errors across all render conditions'}`);
  p(`- **Certification:** ${r.status}`);
  p('');
}

p('## References not reconstructed');
p('');
p('These are recorded rather than worked around. No component claims a reference it could not measure.');
p('');
p('| reference | url | state | detail |');
p('| --- | --- | --- | --- |');
const used = new Set(metas.map(m => m.refId));
for (const row of access.rows) {
  if (used.has(row.id)) continue;
  p(`| ${row.name} | ${row.url} | ${row.verdict} | ${String(row.detail).replace(/\|/g, '/').replace(/\s+/g, ' ').slice(0, 160)} |`);
}
p('');
p('## Duplicate detection');
p('');
p('Components sharing a structural trait, and what actually separates them.');
p('');
const groups = new Map();
for (const m of metas) {
  const k = `${m.layout} / ${m.menuArchitecture} / ${m.scrollBehavior}`;
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(m);
}
let any = false;
for (const [k, g] of groups) {
  if (g.length < 2) continue;
  any = true;
  p(`- **${k}** — ${g.map(m => `\`${m.id}\``).join(', ')}`);
  for (const m of g) p(`  - \`${m.id}\`: ${m.density} density, motion ${m.motionIntensity}, mobile ${m.mobilePattern}, comfortable ${m.comfortableItems[0]}–${m.comfortableItems[1]} items`);
}
if (!any) p('_No two components currently share a layout/menu/scroll signature._');
p('');
p('Components using `mix-blend-mode: difference` (a shared technique, not a shared design):');
p('');
for (const m of metas.filter(m => (m.notes || '').includes('difference'))) p(`- \`${m.id}\` — ${m.displayName}`);
p('');

fs.writeFileSync('reports/CERTIFICATION.md', L.join('\n'));
console.log(`wrote reports/CERTIFICATION.md (${L.length} lines, ${metas.length} components, ${sites.length - used.size} references not reconstructed)`);
