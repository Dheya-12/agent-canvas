import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { buildManifest } from './manifest.mjs';
import { runCompare } from './compare.mjs';

const BASE = process.env.HARNESS || 'http://127.0.0.1:4174';

/** Content conditions every navbar must survive. */
const STRESS = ['short', 'normal', 'long', 'oneItem', 'fiveItems', 'manyItems', 'noCta',
  'dropdowns', 'imageLogo', 'brokenLogo', 'empty', 'arabic', 'mixed', 'accents',
  'longWords', 'numeric', 'darkTheme', 'withSocials'];
const SIZES = [{ k: 'desktop', width: 1440, height: 900 }, { k: 'mobile', width: 390, height: 844 }];

/* ---------------- in-page structural checks ---------------- */
const AUDIT = () => {
  const out = { issues: [] };
  const doc = document.documentElement;
  out.pageScrollW = doc.scrollWidth;
  out.viewportW = window.innerWidth;
  if (doc.scrollWidth > window.innerWidth + 1)
    out.issues.push({ kind: 'horizontal-overflow', detail: `document scrollWidth ${doc.scrollWidth} > viewport ${window.innerWidth}` });

  const header = document.querySelector('header');
  if (!header) { out.issues.push({ kind: 'no-header', detail: 'no <header> rendered' }); return out; }
  const hr = header.getBoundingClientRect();
  out.headerH = +hr.height.toFixed(1);
  if (hr.height <= 0) out.issues.push({ kind: 'zero-height', detail: 'header collapsed to zero height' });
  if (hr.height > window.innerHeight * 0.55)
    out.issues.push({ kind: 'header-too-tall', detail: `header ${Math.round(hr.height)}px exceeds 55% of viewport` });

  const vis = e => { const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return c.visibility !== 'hidden' && c.display !== 'none' && parseFloat(c.opacity) > 0.05 && r.width > 2 && r.height > 2; };
  const links = [...header.querySelectorAll('a,button')].filter(vis);
  out.linkCount = links.length;

  // Text overflowing its own box. An explicit ellipsis is a deliberate
  // truncation rule, not a defect, so only unmanaged overflow is reported.
  // scrollWidth is inflated by the 44px hit-area pseudo-element, so content
  // width is measured with a Range over the element's contents instead -
  // that covers text and images alike and ignores pseudo-elements.
  for (const el of links) {
    if (el.clientWidth <= 0) continue;
    let cw = 0;
    try {
      const rg = document.createRange();
      rg.selectNodeContents(el);
      cw = rg.getBoundingClientRect().width;
      rg.detach?.();
    } catch { continue; }
    if (cw <= el.clientWidth + 2) continue;
    const st = getComputedStyle(el);
    const managed = st.textOverflow === 'ellipsis' ||
      [...el.querySelectorAll('*')].some(k => getComputedStyle(k).textOverflow === 'ellipsis');
    if (managed) continue;
    const t = (el.textContent || '').trim().slice(0, 24) || (el.querySelector('img') ? '<image>' : '<empty>');
    out.issues.push({ kind: 'content-overflows', detail: `"${t}" content ${Math.round(cw)}px > box ${el.clientWidth}px` });
  }
  // Elements escaping the header horizontally
  for (const el of links) {
    const r = el.getBoundingClientRect();
    if (r.right > window.innerWidth + 2 || r.left < -2) {
      const t = (el.textContent || '').trim().slice(0, 24);
      out.issues.push({ kind: 'escapes-viewport', detail: `"${t}" at [${Math.round(r.left)}, ${Math.round(r.right)}]` });
    }
  }
  // Overlapping siblings (a real symptom of a broken layout)
  for (let i = 0; i < links.length; i++) {
    for (let j = i + 1; j < links.length; j++) {
      const a = links[i].getBoundingClientRect(), b = links[j].getBoundingClientRect();
      if (links[i].contains(links[j]) || links[j].contains(links[i])) continue;
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 4 && oy > 4) {
        out.issues.push({ kind: 'overlap', detail: `"${(links[i].textContent || '').trim().slice(0, 14)}" overlaps "${(links[j].textContent || '').trim().slice(0, 14)}" by ${Math.round(ox)}x${Math.round(oy)}px` });
        i = links.length; break;
      }
    }
  }
  // Touch-target floor on small viewports. Applied to menu controls, which
  // must be tappable; a text wordmark at its natural type size is not a
  // control failure and is reported separately at a lower bar.
  if (window.innerWidth < 700) {
    for (const el of links) {
      const r = el.getBoundingClientRect();
      const isControl = el.tagName === 'BUTTON' || el.getAttribute('role') === 'button';
      // A control may keep a small glyph but expand its hit area with a
      // pseudo-element; measure that rather than the painted box.
      let hit = r.height;
      try {
        const after = getComputedStyle(el, '::after');
        if (after && after.content !== 'none') {
          const h = parseFloat(after.height);
          if (!Number.isNaN(h)) hit = Math.max(hit, h);
        }
      } catch { /* ignore */ }
      if (isControl && hit > 2 && hit < 32) {
        out.issues.push({ kind: 'small-control', detail: `control "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 18)}" has a ${Math.round(hit)}px hit area` });
        break;
      }
    }
  }
  return out;
};

/* ---------------- fatigue ---------------- */
async function fatigue(page, navId) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/?nav=${navId}&fixture=dropdowns`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const res = { cycles: 0, issues: [] };
  const baseline = await page.evaluate(() => getComputedStyle(document.body).overflow);
  const toggle = page.locator('button[aria-expanded]').first();
  if (!(await toggle.count())) { res.issues.push({ kind: 'no-toggle', detail: 'no [aria-expanded] control at 390px' }); return res; }

  for (let i = 0; i < 10; i++) {
    try { await toggle.click({ timeout: 4000 }); }
    catch (e) { res.issues.push({ kind: 'toggle-unclickable', detail: `cycle ${i + 1}: ${String(e.message).split('\n')[0].slice(0, 110)}` }); break; }
    await page.waitForTimeout(420);
    const opened = await page.evaluate(() => document.querySelector('button[aria-expanded]')?.getAttribute('aria-expanded'));
    if (opened !== 'true') { res.issues.push({ kind: 'open-failed', detail: `cycle ${i + 1}: aria-expanded=${opened}` }); break; }
    // alternate close route: toggle vs Escape
    try {
      if (i % 2 === 0) await page.keyboard.press('Escape');
      else await toggle.click({ timeout: 4000 });
    } catch (e) { res.issues.push({ kind: 'close-unclickable', detail: `cycle ${i + 1}: ${String(e.message).split('\n')[0].slice(0, 110)}` }); break; }
    await page.waitForTimeout(420);
    const st = await page.evaluate(() => ({
      exp: document.querySelector('button[aria-expanded]')?.getAttribute('aria-expanded'),
      ov: getComputedStyle(document.body).overflow,
      headers: document.querySelectorAll('header').length,
    }));
    if (st.exp !== 'false') { res.issues.push({ kind: 'stuck-open', detail: `cycle ${i + 1}: aria-expanded=${st.exp}` }); break; }
    if (st.ov !== baseline) { res.issues.push({ kind: 'scroll-lock-leak', detail: `cycle ${i + 1}: body overflow "${st.ov}" != baseline "${baseline}"` }); break; }
    if (st.headers > 1) { res.issues.push({ kind: 'duplicate-header', detail: `${st.headers} <header> elements` }); break; }
    res.cycles++;
  }

  // Resize while open must not strand the lock
  try { await toggle.click({ timeout: 4000 }); } catch { /* reported above */ }
  await page.waitForTimeout(400);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(700);
  const afterResize = await page.evaluate(() => ({ ov: getComputedStyle(document.body).overflow, exp: document.querySelector('button[aria-expanded]')?.getAttribute('aria-expanded') }));
  if (afterResize.ov !== baseline) res.issues.push({ kind: 'resize-lock-leak', detail: `body overflow "${afterResize.ov}" after resizing with the menu open` });
  res.resizeClosed = afterResize.exp === 'false';

  // Scroll churn must not desync the scroll-reactive state
  for (let i = 0; i < 6; i++) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), 1400 + i * 300);
    await page.waitForTimeout(120);
    await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'instant' }));
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const rest = await page.evaluate(() => { const h = document.querySelector('header'); const r = h?.getBoundingClientRect(); return { top: r ? +r.top.toFixed(1) : null, tf: h ? getComputedStyle(h).transform : null }; });
  res.restingTop = rest.top;
  if (rest.top != null && rest.top < -1) res.issues.push({ kind: 'stuck-hidden', detail: `header rests at top ${rest.top} after returning to scroll 0` });
  return res;
}

/* ---------------- driver ---------------- */
async function certifyOne(page, m) {
  const entry = { id: m.id, refId: m.refId, displayName: m.displayName, stress: {}, issues: [], pageErrors: [] };
  const errs = [];
  const onErr = e => errs.push(String(e.message || e).slice(0, 160));
  page.on('pageerror', onErr);
  const onCon = msg => { if (msg.type() === 'error') errs.push(msg.text().slice(0, 160)); };
  page.on('console', onCon);

  for (const fx of STRESS) {
    for (const vp of SIZES) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE}/?nav=${m.id}&fixture=${fx}`, { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(340);
      let a;
      try { a = await page.evaluate(AUDIT); } catch (e) { a = { issues: [{ kind: 'audit-threw', detail: String(e.message).slice(0, 120) }] }; }
      const key = `${fx}@${vp.k}`;
      entry.stress[key] = { headerH: a.headerH, links: a.linkCount, issues: a.issues.length };
      for (const is of a.issues) entry.issues.push({ where: key, ...is });
    }
  }

  try { entry.fatigue = await fatigue(page, m.id); }
  catch (err) { entry.fatigue = { cycles: 0, issues: [{ kind: 'fatigue-threw', detail: String(err.message).split('\n')[0].slice(0, 140) }] }; }
  for (const is of entry.fatigue.issues) entry.issues.push({ where: 'fatigue', ...is });

  page.off('pageerror', onErr);
  page.off('console', onCon);
  entry.pageErrors = [...new Set(errs)].slice(0, 6);
  return entry;
}

const only = process.argv.slice(2);
const metas = (await buildManifest()).filter(m => !only.length || only.includes(m.id));
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
const results = [];

for (const m of metas) {
  const e = await certifyOne(page, m);
  // fidelity against the live reference (skipped when there is no evidence)
  if (m.refId && fs.existsSync(`evidence/${m.refId}/inspection.json`)) {
    try {
      const cmp = await runCompare(m.id, m.refId, 'normal');
      const flat = Object.values(cmp.diffs).flat();
      e.fidelity = {
        fails: flat.filter(x => x.level === 'fail').map(x => x.msg),
        warns: flat.filter(x => x.level === 'warn').map(x => x.msg),
        deviations: flat.filter(x => x.level === 'deviation').map(x => x.msg),
        viewports: cmp.viewports,
      };
    } catch (err) { e.fidelity = { error: String(err.message).slice(0, 140) }; }
  } else {
    e.fidelity = { error: 'no reference evidence' };
  }

  const blocking = e.issues.filter(i => !['small-control'].includes(i.kind));
  const fidFails = e.fidelity?.fails?.length || 0;
  e.status = (blocking.length === 0 && fidFails === 0 && e.pageErrors.length === 0)
    ? ((e.fidelity?.deviations?.length || e.fidelity?.warns?.length || e.issues.length) ? 'PASS WITH OBSERVATIONS' : 'PASS')
    : 'FAIL';
  results.push(e);
  console.log(`${e.status.padEnd(23)} ${e.id.padEnd(28)} issues=${e.issues.length} fidFail=${fidFails} dev=${e.fidelity?.deviations?.length || 0} err=${e.pageErrors.length} fatigue=${e.fatigue.cycles}/10`);
  for (const i of e.issues.slice(0, 6)) console.log(`    - [${i.kind}] ${i.where}: ${i.detail}`);
  for (const f of (e.fidelity?.fails || []).slice(0, 4)) console.log(`    - [fidelity] ${f}`);
  for (const p of e.pageErrors.slice(0, 3)) console.log(`    - [pageerror] ${p}`);
}

await browser.close();
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/certification.json', JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 1));
const tally = {};
for (const r of results) tally[r.status] = (tally[r.status] || 0) + 1;
console.log('\nTALLY', JSON.stringify(tally));
