import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { ANALYZE } from './analyze.mjs';

/* Documented corrections where the automated probe mis-measures a reference.
 * An override suppresses one metric for one site and must carry a reason and
 * the visual evidence that settles it — it never turns a diff into a pass. */
const OVERRIDES = JSON.parse(fs.readFileSync(new URL('./overrides.json', import.meta.url), 'utf8'));

const BASE = process.env.HARNESS || 'http://127.0.0.1:4174';
const OUT = path.resolve('evidence');
const VIEWPORTS = [
  { k: 'desktop', width: 1440, height: 900 },
  { k: 'laptop',  width: 1024, height: 768 },
  { k: 'tablet',  width: 768,  height: 1024 },
  { k: 'mobile',  width: 390,  height: 844 },
];

/** Numeric tolerances for certification. */
const TOL = { height: 4, x: 8, fontSize: 1.2 };
const numeric = v => parseFloat(String(v)) || 0;

function diffOne(ref, impl, vp, refId) {
  const o = OVERRIDES[refId];
  // An override may be scoped to specific viewports; elsewhere the metric stands.
  const inScope = !o?.skipViewports || o.skipViewports.includes(vp);
  const skip = new Set(inScope ? (o?.skip || []) : []);
  const out = [];
  if (!ref?.found) return [{ level: 'info', msg: `no reference measurement at ${vp}` }];
  if (!impl?.found) return [{ level: 'fail', msg: `reconstruction navbar not detected at ${vp}` }];

  const rc = ref.container, ic = impl.container;
  const dh = Math.abs(rc.rect.h - ic.rect.h);
  if (dh > TOL.height && !skip.has('height')) out.push({ level: dh > TOL.height * 3 ? 'fail' : 'warn', msg: `height ${ic.rect.h.toFixed(1)} vs ref ${rc.rect.h.toFixed(1)} (Δ${dh.toFixed(1)}px)` });
  if (rc.position !== ic.position) out.push({ level: 'warn', msg: `position ${ic.position} vs ref ${rc.position}` });
  if (Math.abs(numeric(rc.zIndex) - numeric(ic.zIndex)) > 0 && numeric(rc.zIndex) > 0)
    out.push({ level: 'info', msg: `z-index ${ic.zIndex} vs ref ${rc.zIndex}` });

  // Gutter: leftmost interactive element's x
  const rx = ref.logo?.rect?.x, ix = impl.logo?.rect?.x;
  if (rx != null && ix != null && !skip.has('startGutter')) {
    const d = Math.abs(rx - ix);
    if (d > TOL.x) out.push({ level: d > TOL.x * 3 ? 'fail' : 'warn', msg: `start gutter ${ix.toFixed(1)} vs ref ${rx.toFixed(1)} (Δ${d.toFixed(1)}px)` });
  }
  // Right gutter from rightmost interactive
  const rr = Math.max(...(ref.interactive || []).map(o => o.rect.x + o.rect.w), 0);
  const ir = Math.max(...(impl.interactive || []).map(o => o.rect.x + o.rect.w), 0);
  if (rr > 0 && ir > 0 && !skip.has('endGutter')) {
    const d = Math.abs((rc.rect.w - rr) - (ic.rect.w - ir));
    if (d > TOL.x) out.push({ level: d > TOL.x * 3 ? 'fail' : 'warn', msg: `end gutter Δ${d.toFixed(1)}px` });
  }
  // Link type scale: median font-size of non-logo text links
  // (mobile link typography is certified separately, in the open state)
  const fs_ = a => { const n = (a || []).filter(o => o.text && !o.hasImg).map(o => numeric(o.fontSize)).sort((x, y) => x - y); return n[Math.floor(n.length / 2)]; };
  const rf = fs_(ref.interactive), iff = fs_(impl.interactive);
  if (rf && iff && vp !== 'mobile' && !skip.has('linkFontSize')) {
    const d = Math.abs(rf - iff);
    if (d > TOL.fontSize) out.push({ level: d > TOL.fontSize * 3 ? 'fail' : 'warn', msg: `link font-size ${iff}px vs ref ${rf}px (Δ${d.toFixed(1)})` });
  }
  return out;
}

async function capture(page, navId, fixture, vp, dir, extra = {}) {
  const url = `${BASE}/?nav=${navId}&fixture=${fixture}${extra.theme ? `&theme=${extra.theme}` : ''}${extra.dir ? `&dir=${extra.dir}` : ''}`;
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(url, { waitUntil: 'load', timeout: 20000 });
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(650);
  const initial = await page.evaluate(ANALYZE);
  const clipH = Math.min(vp.height, Math.max(200, Math.round((initial?.container?.rect?.h || 90) + 130)));
  await page.screenshot({ path: path.join(dir, `${vp.k}-initial.png`), clip: { x: 0, y: 0, width: vp.width, height: clipH } });

  await page.evaluate(() => window.scrollTo({ top: 1100, behavior: 'instant' }));
  await page.waitForTimeout(700);
  const scrolled = await page.evaluate(ANALYZE);
  await page.screenshot({ path: path.join(dir, `${vp.k}-scrolled.png`), clip: { x: 0, y: 0, width: vp.width, height: clipH } });
  await page.evaluate(() => window.scrollTo({ top: 2200, behavior: 'instant' }));
  await page.waitForTimeout(500);
  const deepScroll = (await page.evaluate(ANALYZE))?.container?.rect;
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  await page.waitForTimeout(700);
  const scrollUp = (await page.evaluate(ANALYZE))?.container?.rect;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  return { initial, scrolled, deepScroll, scrollUp, clipH };
}

export async function runCompare(navId, refId, fixture = 'normal') {
  const dir = path.join(OUT, refId, 'impl');
  fs.mkdirSync(dir, { recursive: true });
  const refPath = path.join(OUT, refId, 'inspection.json');
  const ref = fs.existsSync(refPath) ? JSON.parse(fs.readFileSync(refPath, 'utf8')) : null;

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });

  const ov = OVERRIDES[refId];
  const report = { navId, refId, fixture, overrides: ov ? { skip: ov.skip, reason: ov.reason } : null, at: new Date().toISOString(), viewports: {}, diffs: {}, pageErrors: [] };
  for (const vp of VIEWPORTS) {
    const got = await capture(page, navId, fixture, vp, dir);
    report.viewports[vp.k] = {
      h: got.initial?.container?.rect?.h,
      pos: got.initial?.container?.position,
      scrolledY: got.scrolled?.container?.rect?.y,
      deepY: got.deepScroll?.y,
      upY: got.scrollUp?.y,
      items: got.initial?.interactiveCount,
    };
    report.diffs[vp.k] = diffOne(ref?.viewports?.[vp.k]?.initial, got.initial, vp.k, refId);
  }

  // mobile menu open
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/?nav=${navId}&fixture=${fixture}`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const tog = page.locator('button[aria-expanded]').first();
  if (await tog.count()) {
    await tog.click();
    await page.waitForTimeout(1100);
    await page.screenshot({ path: path.join(dir, 'mobile-menu-open.png') });
    report.menuOpen = await page.evaluate(() => ({
      bodyOverflow: getComputedStyle(document.body).overflow,
      expanded: document.querySelector('button[aria-expanded]')?.getAttribute('aria-expanded'),
    }));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    report.afterEscape = await page.evaluate(() => ({
      bodyOverflow: getComputedStyle(document.body).overflow,
      expanded: document.querySelector('button[aria-expanded]')?.getAttribute('aria-expanded'),
    }));
  }
  report.pageErrors = [...new Set(errs)].slice(0, 8);
  await browser.close();
  fs.writeFileSync(path.join(dir, `compare-${fixture}.json`), JSON.stringify(report, null, 1));
  return report;
}

if (process.argv[1].endsWith('compare.mjs')) {
  const [navId, refId, fixture] = process.argv.slice(2);
  const r = await runCompare(navId, refId, fixture);
  console.log(`\n== ${navId} vs ${refId} [${r.fixture}] ==`);
  for (const [k, v] of Object.entries(r.viewports)) console.log(` ${k}: h=${v.h?.toFixed(1)} pos=${v.pos} scrollY=${v.scrolledY} deepY=${v.deepY} upY=${v.upY} items=${v.items}`);
  for (const [k, d] of Object.entries(r.diffs)) { for (const x of d) console.log(`  [${x.level.toUpperCase()}] ${k}: ${x.msg}`); }
  if (r.menuOpen) console.log(` menuOpen=${JSON.stringify(r.menuOpen)} afterEscape=${JSON.stringify(r.afterEscape)}`);
  if (r.pageErrors.length) console.log(` pageErrors: ${r.pageErrors.join(' | ')}`);
  const fails = Object.values(r.diffs).flat().filter(x => x.level === 'fail').length;
  console.log(` => ${fails === 0 ? 'no blocking diffs' : fails + ' BLOCKING diffs'}`);
}
