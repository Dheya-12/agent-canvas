import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { buildManifest } from '../scripts/manifest.mjs';
import { collect, BASELINE_FIXTURES } from '../scripts/baseline.mjs';

/**
 * Regression suite for the navbar library.
 *
 * Hermetic by design: it renders the built library against the local preview
 * and never reaches a third-party site. Fidelity against the live references
 * is a separate, network-dependent verification (scripts/compare.mjs) and
 * cannot be a regression test - five references are blocked and eight have no
 * navbar at all.
 *
 * Three groups:
 *   1. GEOMETRY   - the shipped, certified geometry has not moved.
 *   2. CONTRACT   - every navbar survives degenerate and hostile content.
 *   3. INVARIANTS - rules that must hold for every navbar, forever.
 */
const BASE = process.env.HARNESS || 'http://127.0.0.1:4174';
const TOL = { h: 1.5, y: 1.5, gutter: 2 };

let passed = 0;
const failures = [];
const ok = (name) => { passed++; void name; };
const fail = (name, detail) => failures.push({ name, detail });
const near = (a, b, t) => a != null && b != null && Math.abs(a - b) <= t;

async function geometry(page, baseline, metas) {
  for (const m of metas) {
    const want = baseline.navbars[m.id];
    if (!want) { fail(`geometry/${m.id}`, 'no baseline entry - run scripts/baseline.mjs after adding a navbar'); continue; }
    const got = await collect(page, m.id);
    for (const key of Object.keys(want)) {
      const w = want[key], g = got[key];
      const t = `geometry/${m.id}/${key}`;
      if (!w) { ok(t); continue; }
      if (!g) { fail(t, 'navbar no longer renders a <header>'); continue; }
      if (!near(g.h, w.h, TOL.h)) { fail(t, `height ${g.h} vs baseline ${w.h}`); continue; }
      if (!near(g.y, w.y, TOL.y)) { fail(t, `top offset ${g.y} vs baseline ${w.y}`); continue; }
      if (g.position !== w.position) { fail(t, `position ${g.position} vs baseline ${w.position}`); continue; }
      if (g.controls !== w.controls) { fail(t, `${g.controls} controls vs baseline ${w.controls}`); continue; }
      if (w.lead != null && !near(g.lead, w.lead, TOL.gutter)) { fail(t, `leading gutter ${g.lead} vs baseline ${w.lead}`); continue; }
      if (w.trail != null && !near(g.trail, w.trail, TOL.gutter)) { fail(t, `trailing gutter ${g.trail} vs baseline ${w.trail}`); continue; }
      ok(t);
    }
  }
}

/** Content that must never break a navbar. */
const HOSTILE = ['empty', 'brokenLogo', 'longWords', 'manyItems', 'arabic', 'oneItem', 'noCta'];

async function contract(page, metas) {
  for (const m of metas) {
    for (const fx of HOSTILE) {
      for (const [w, hgt] of [[1440, 900], [390, 844]]) {
        const t = `contract/${m.id}/${fx}@${w}`;
        const errs = [];
        const onErr = e => errs.push(String(e.message).split('\n')[0].slice(0, 110));
        page.on('pageerror', onErr);
        await page.setViewportSize({ width: w, height: hgt });
        await page.goto(`${BASE}/?nav=${m.id}&fixture=${fx}`, { waitUntil: 'load', timeout: 20000 });
        await page.waitForTimeout(220);
        const r = await page.evaluate(() => {
          const h = document.querySelector('header');
          if (!h) return { noHeader: true };
          const b = h.getBoundingClientRect();
          return {
            height: +b.height.toFixed(1),
            overflows: document.documentElement.scrollWidth > window.innerWidth + 1,
            scrollW: document.documentElement.scrollWidth,
            viewportW: window.innerWidth,
          };
        });
        page.off('pageerror', onErr);
        if (r.noHeader) fail(t, 'no <header> rendered');
        else if (errs.length) fail(t, `page error: ${errs[0]}`);
        else if (r.height <= 0) fail(t, 'header collapsed to zero height');
        else if (r.overflows) fail(t, `document overflows horizontally (${r.scrollW} > ${r.viewportW})`);
        else ok(t);
      }
    }
  }
}

async function invariants(page, metas) {
  for (const m of metas) {
    // A collapsing navbar must expose a disclosure control at phone width,
    // and it must release the scroll lock when closed.
    if (m.mobilePattern !== 'inline') {
      const t = `invariant/${m.id}/disclosure`;
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${BASE}/?nav=${m.id}&fixture=dropdowns`, { waitUntil: 'load' });
      await page.waitForTimeout(260);
      // The invariant is absolute, not relative: a CLOSED navbar must leave
      // the page scrollable. Comparing against an overflow sampled after
      // mount hides a navbar that locks from mount and never releases -
      // it looks consistent with itself.
      const atRest = await page.evaluate(() => getComputedStyle(document.body).overflow);
      if (atRest === 'hidden') { fail(t, `page is scroll-locked with the menu CLOSED (body overflow "${atRest}")`); continue; }
      const toggle = page.locator('button[aria-expanded]').first();
      if (!(await toggle.count())) { fail(t, 'metadata declares a collapsing mobile pattern but no [aria-expanded] control exists at 390px'); continue; }
      await toggle.click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(420);
      const opened = await page.evaluate(() => document.querySelector('button[aria-expanded]')?.getAttribute('aria-expanded'));
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      const after = await page.evaluate(() => ({
        exp: document.querySelector('button[aria-expanded]')?.getAttribute('aria-expanded'),
        ov: getComputedStyle(document.body).overflow,
      }));
      if (opened !== 'true') fail(t, `toggle did not open (aria-expanded=${opened})`);
      else if (after.exp !== 'false') fail(t, `Escape did not close the menu (aria-expanded=${after.exp})`);
      else if (after.ov === 'hidden') fail(t, `scroll lock leaked after close: body overflow "${after.ov}"`);
      else if (after.ov !== atRest) fail(t, `body overflow "${after.ov}" does not return to its at-rest value "${atRest}"`);
      else ok(t);
    }

    // Metadata must describe what the component actually does.
    const t2 = `invariant/${m.id}/metadata`;
    const problems = [];
    if (m.comfortableItems[0] > m.comfortableItems[1]) problems.push('comfortableItems range is inverted');
    if (!m.themes.length) problems.push('declares no themes');
    if (m.dependencies.length) problems.push(`declares runtime dependencies (${m.dependencies.join(', ')}) - the library is meant to have none`);
    if (!m.industries.length || !m.tone.length) problems.push('missing planner-facing descriptors');
    problems.length ? fail(t2, problems.join('; ')) : ok(t2);
  }
}

/* ---------------- run ---------------- */
const baseline = JSON.parse(fs.readFileSync('reports/baseline.json', 'utf8'));
const metas = await buildManifest();
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();

console.log(`navbar-library regression suite`);
console.log(`  ${metas.length} navbars | baseline ${baseline.generatedAt.slice(0, 19)}Z | fixtures ${BASELINE_FIXTURES.join(', ')}\n`);

await geometry(page, baseline, metas);
console.log(`geometry    ${passed} checks passed`);
const afterGeom = passed;
await contract(page, metas);
console.log(`contract    ${passed - afterGeom} checks passed`);
const afterContract = passed;
await invariants(page, metas);
console.log(`invariants  ${passed - afterContract} checks passed`);

await browser.close();

if (failures.length) {
  console.log(`\n${failures.length} FAILURE(S):`);
  for (const f of failures.slice(0, 40)) console.log(`  ✗ ${f.name}\n      ${f.detail}`);
  process.exit(1);
}
console.log(`\nALL ${passed} CHECKS PASSED`);
