import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const SPKI = 'KnP1OnzHv/y42eRQmbGwoYTHcSJF448m6CU5mdngwKk=';
const EV = path.resolve('evidence');
const VIEWPORTS = [
  { k: 'desktop', width: 1440, height: 900 },
  { k: 'laptop',  width: 1024, height: 768 },
  { k: 'tablet',  width: 768,  height: 1024 },
  { k: 'mobile',  width: 390,  height: 844 },
];

/* ---------- in-page analysis (runs in browser) ---------- */
import { ANALYZE } from './analyze.mjs';
/* ---------- driver ---------- */
async function dismiss(page) {
  const pats = [/accept all/i, /accept cookies/i, /^accept$/i, /agree/i, /got it/i, /allow all/i, /^ok$/i, /continue/i];
  for (const p of pats) {
    try {
      const b = page.getByRole('button', { name: p }).first();
      if (await b.isVisible({ timeout: 250 })) { await b.click({ timeout: 900 }); await page.waitForTimeout(500); return true; }
    } catch {}
  }
  return false;
}

async function shot(page, file, opts = {}) {
  try {
    await page.screenshot({ path: file, timeout: 12000, animations: 'disabled', ...opts });
    return true;
  } catch {
    try { await page.screenshot({ path: file, timeout: 8000, ...opts }); return true; } catch { return false; }
  }
}

async function run(site) {
  const dir = path.join(EV, site.id);
  fs.mkdirSync(dir, { recursive: true });
  const rec = { id: site.id, name: site.name, url: site.url, at: new Date().toISOString(), viewports: {}, errors: [] };

  const browser = await chromium.launch({ args: ['--no-sandbox', `--ignore-certificate-errors-spki-list=${SPKI}`, '--disable-dev-shm-usage'] });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  const page = await ctx.newPage();
  const consoleErrs = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 140)); });

  try {
    const resp = await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 50000 });
    rec.status = resp ? resp.status() : null;
    rec.finalUrl = page.url();
    await page.waitForTimeout(5200);           // let hero/loader animations settle
    rec.cookieDismissed = await dismiss(page);
    await page.waitForTimeout(600);
    rec.title = (await page.title()).slice(0, 90);

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(1600);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(900);

      const v = {};
      try { v.initial = await page.evaluate(ANALYZE); } catch (e) { v.initialErr = e.message.slice(0, 120); }
      const clipH = Math.min(vp.height, Math.max(200, Math.round((v.initial?.container?.rect?.h || 90) + 130)));
      await shot(page, path.join(dir, `${vp.k}-initial.png`), { clip: { x: 0, y: 0, width: vp.width, height: clipH } });

      // scrolled state
      await page.evaluate(() => window.scrollTo({ top: 1100, behavior: 'instant' }));
      await page.waitForTimeout(1500);
      try { v.scrolled = await page.evaluate(ANALYZE); } catch (e) { v.scrolledErr = e.message.slice(0, 120); }
      await shot(page, path.join(dir, `${vp.k}-scrolled.png`), { clip: { x: 0, y: 0, width: vp.width, height: clipH } });

      // further scroll -> detect hide-on-scroll-down / show-on-scroll-up
      await page.evaluate(() => window.scrollTo({ top: 2200, behavior: 'instant' }));
      await page.waitForTimeout(1100);
      try { v.deepScroll = (await page.evaluate(ANALYZE))?.container?.rect; } catch {}
      await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
      await page.waitForTimeout(1100);
      try { v.scrollUp = (await page.evaluate(ANALYZE))?.container?.rect; } catch {}

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(900);

      // menu-open state (mobile/tablet primarily)
      if (vp.k === 'mobile' || vp.k === 'tablet') {
        const opened = await page.evaluate(() => {
          const isVis = e => { const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && r.width > 8 && r.height > 8; };
          const cands = [...document.querySelectorAll('button,a,[role="button"],[class*="burger" i],[class*="menu" i],[class*="toggle" i],[class*="hamburger" i]')].filter(isVis);
          const top = cands.filter(e => { const r = e.getBoundingClientRect(); return r.top < 140 && r.width < 220 && r.height < 140; });
          const scored = top.map(e => {
            const t = ((e.getAttribute('aria-label') || '') + ' ' + (e.textContent || '') + ' ' + (typeof e.className === 'string' ? e.className : '')).toLowerCase();
            let s = 0;
            if (/burger|hamburger/.test(t)) s += 50;
            if (/\bmenu\b/.test(t)) s += 30;
            if (/toggle|open|nav/.test(t)) s += 12;
            if (e.querySelector('svg,span,i')) s += 6;
            const r = e.getBoundingClientRect();
            if (r.x > innerWidth * 0.55) s += 12;
            return { e, s };
          }).filter(o => o.s > 0).sort((a, b) => b.s - a.s);
          if (!scored.length) return null;
          const el = scored[0].e;
          const d = { label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30), cls: (typeof el.className === 'string' ? el.className : '').slice(0, 60) };
          el.click();
          return d;
        });
        await page.waitForTimeout(1500);
        if (opened) {
          v.menuToggle = opened;
          await shot(page, path.join(dir, `${vp.k}-menu-open.png`), { fullPage: false });
          v.menuOpen = await page.evaluate(() => {
            const b = getComputedStyle(document.body);
            const ov = [...document.querySelectorAll('body *')].filter(e => {
              const c = getComputedStyle(e), r = e.getBoundingClientRect();
              return (c.position === 'fixed' || c.position === 'absolute') && r.width > innerWidth * 0.55 && r.height > innerHeight * 0.35 && c.display !== 'none' && parseFloat(c.opacity) > 0.05 && e.querySelectorAll('a').length >= 2;
            });
            const o = ov[0];
            if (!o) return { overlayFound: false, bodyOverflow: b.overflow, bodyPosition: b.position };
            const c = getComputedStyle(o), r = o.getBoundingClientRect();
            return {
              overlayFound: true, bodyOverflow: b.overflow, bodyPosition: b.position,
              bg: c.backgroundColor, w: Math.round(r.width), h: Math.round(r.height),
              x: Math.round(r.x), y: Math.round(r.y), transform: c.transform,
              transition: c.transition, backdropFilter: c.backdropFilter, zIndex: c.zIndex,
              links: [...o.querySelectorAll('a')].slice(0, 14).map(a => {
                const ac = getComputedStyle(a);
                return { t: (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28), fs: ac.fontSize, fw: ac.fontWeight, tt: ac.textTransform, ls: ac.letterSpacing, ff: ac.fontFamily.split(',')[0].replace(/["']/g, '') };
              }),
            };
          });
          // close again (fatigue signal)
          await page.keyboard.press('Escape').catch(() => {});
          await page.waitForTimeout(700);
          v.afterClose = await page.evaluate(() => ({ bodyOverflow: getComputedStyle(document.body).overflow }));
        }
      }

      // desktop hover on a nav link
      if (vp.k === 'desktop' && v.initial?.interactive?.length > 1) {
        try {
          const tgt = v.initial.interactive.filter(o => o.text && !o.hasImg)[1] || v.initial.interactive[1];
          if (tgt) {
            await page.mouse.move(tgt.rect.x + tgt.rect.w / 2, tgt.rect.y + tgt.rect.h / 2);
            await page.waitForTimeout(950);
            await shot(page, path.join(dir, `desktop-hover.png`), { clip: { x: 0, y: 0, width: vp.width, height: clipH } });
            v.hoverTarget = tgt.text;
            await page.mouse.move(5, 600);
            await page.waitForTimeout(400);
          }
        } catch (e) { v.hoverErr = e.message.slice(0, 90); }
      }

      rec.viewports[vp.k] = v;
    }
    rec.consoleErrors = consoleErrs.slice(0, 6);
    rec.ok = true;
  } catch (e) {
    rec.ok = false;
    rec.errors.push(e.message.slice(0, 220));
  } finally {
    await browser.close().catch(() => {});
  }
  fs.writeFileSync(path.join(dir, 'inspection.json'), JSON.stringify(rec, null, 1));
  return rec;
}

const sites = JSON.parse(fs.readFileSync('scripts/sites.json', 'utf8'));
const only = process.argv.slice(2);
const targets = only.length ? sites.filter(s => only.includes(s.id)) : sites;
for (const s of targets) {
  const t = Date.now();
  try {
    const r = await run(s);
    const d = r.viewports?.desktop?.initial;
    console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${s.id.padEnd(18)} ${String(r.status).padEnd(4)} nav=${d?.found ? `${Math.round(d.container.rect.h)}px/${d.container.position}/${d.interactiveCount}links` : 'NOT-FOUND'} ${((Date.now() - t) / 1000).toFixed(0)}s ${r.errors[0] || ''}`);
  } catch (e) {
    console.log(`FAIL ${s.id} ${e.message.slice(0, 100)}`);
  }
}
