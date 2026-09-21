import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

/**
 * Diagnostic for references the generic probe cannot resolve. Dumps every
 * plausible navigation container with the information needed to choose a
 * per-site selector, instead of guessing one.
 */
const SPKI = 'KnP1OnzHv/y42eRQmbGwoYTHcSJF448m6CU5mdngwKk=';
const sites = JSON.parse(fs.readFileSync('scripts/sites.json', 'utf8'));
const ids = process.argv.slice(2);

for (const id of ids) {
  const site = sites.find(s => s.id === id);
  if (!site) { console.log(`\n### ${id}: not in sites.json`); continue; }
  fs.mkdirSync(`evidence/${id}`, { recursive: true });
  const browser = await chromium.launch({ args: ['--no-sandbox', `--ignore-certificate-errors-spki-list=${SPKI}`] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' });
  console.log(`\n### ${id} (${site.url})`);
  try {
    await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(6500);
    await page.screenshot({ path: `evidence/${id}/probe-top.png`, clip: { x: 0, y: 0, width: 1440, height: 200 }, timeout: 10000 }).catch(() => {});
    const scan = () => page.evaluate(() => {
      const sel = e => {
        const t = e.tagName.toLowerCase();
        const id = e.id ? `#${e.id}` : '';
        const cls = (typeof e.className === 'string' ? e.className : '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(c => `.${c}`).join('');
        return t + id + cls;
      };
      const rows = [];
      // Deliberately unfiltered by tag or class: these references defeated
      // the tag/class heuristic, so the diagnostic must not repeat it.
      for (const e of document.querySelectorAll('body *')) {
        const c = getComputedStyle(e), r = e.getBoundingClientRect();
        if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) < 0.02) continue;
        if (r.width < 150 || r.height < 6 || r.height > 400) continue;
        if (r.top > 300 || r.bottom < 0) continue;
        if (!e.querySelector('a,button,[role="button"]')) continue;
        // Skip a parent that merely wraps a single candidate child.
        if (e.children.length === 1 && e.children[0].getBoundingClientRect().height >= r.height - 2) continue;
        const links = e.querySelectorAll('a,button,[role="button"]');
        const texts = [...links].map(a => (a.textContent || a.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ')).filter(Boolean).slice(0, 7);
        rows.push({
          sel: sel(e),
          box: `${Math.round(r.width)}x${Math.round(r.height)}@${Math.round(r.x)},${Math.round(r.y)}`,
          pos: c.position, z: c.zIndex, bg: c.backgroundColor, blend: c.mixBlendMode,
          links: links.length, texts,
        });
      }
      return rows.slice(0, 14);
    });

    const show = (label, rows) => {
      console.log(`  [${label}]${rows.length ? '' : ' (no candidate containers)'}`);
      for (const r of rows) {
        console.log(`    ${r.sel.padEnd(40)} ${r.box.padEnd(20)} ${r.pos.padEnd(8)} z=${String(r.z).padEnd(6)} links=${String(r.links).padEnd(3)} ${r.texts.join(' | ').slice(0, 84)}`);
      }
    };
    show('at top', await scan());

    // Several references hide the bar over the hero and reveal it on scroll,
    // so the absence of a bar at rest is not the absence of a bar.
    await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
    await page.waitForTimeout(1800);
    show('after scroll 900', await scan());
    await page.screenshot({ path: `evidence/${id}/probe-scrolled.png`, clip: { x: 0, y: 0, width: 1440, height: 200 }, timeout: 10000 }).catch(() => {});
  } catch (e) {
    console.log('  ERR', String(e.message).split('\n')[0].slice(0, 120));
  }
  await browser.close().catch(() => {});
}
