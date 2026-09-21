import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { buildManifest } from './manifest.mjs';

/**
 * Records the CURRENT rendered geometry of every navbar as a baseline.
 *
 * This is deliberately independent of the live references: five of them are
 * blocked and eight have no navbar at all, so a suite that reaches the
 * network is not a regression suite. Fidelity against the real sites is
 * verified separately by compare.mjs; this locks in what we shipped.
 */
const BASE = process.env.HARNESS || 'http://127.0.0.1:4174';
const VIEWPORTS = [
  { k: 'desktop', width: 1440, height: 900 },
  { k: 'laptop', width: 1024, height: 768 },
  { k: 'tablet', width: 768, height: 1024 },
  { k: 'mobile', width: 390, height: 844 },
];
/** Fixtures whose geometry is pinned. Kept small so the baseline stays readable. */
export const BASELINE_FIXTURES = ['normal', 'fiveItems', 'long'];

export const MEASURE = () => {
  const h = document.querySelector('header');
  if (!h) return null;
  const r = h.getBoundingClientRect();
  const c = getComputedStyle(h);
  const vis = e => {
    const s = getComputedStyle(e), b = e.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0.05 && b.width > 2 && b.height > 2;
  };
  const links = [...h.querySelectorAll('a,button')].filter(vis);
  const xs = links.map(e => e.getBoundingClientRect().x);
  const rights = links.map(e => e.getBoundingClientRect().right);
  return {
    h: +r.height.toFixed(1),
    y: +r.top.toFixed(1),
    position: c.position,
    zIndex: c.zIndex,
    controls: links.length,
    lead: xs.length ? +Math.min(...xs).toFixed(1) : null,
    trail: rights.length ? +(r.width - Math.max(...rights)).toFixed(1) : null,
    docScrollW: document.documentElement.scrollWidth,
  };
};

export async function collect(page, id) {
  const out = {};
  for (const fx of BASELINE_FIXTURES) {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE}/?nav=${id}&fixture=${fx}`, { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(300);
      out[`${fx}@${vp.k}`] = await page.evaluate(MEASURE);
    }
  }
  return out;
}

if (process.argv[1].endsWith('baseline.mjs')) {
  const metas = await buildManifest();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const baseline = { generatedAt: new Date().toISOString(), fixtures: BASELINE_FIXTURES, navbars: {} };
  for (const m of metas) {
    baseline.navbars[m.id] = await collect(page, m.id);
    console.log(`recorded ${m.id}`);
  }
  await browser.close();
  fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync('reports/baseline.json', JSON.stringify(baseline, null, 1));
  console.log(`\nbaseline written: ${metas.length} navbars x ${BASELINE_FIXTURES.length} fixtures x 4 viewports`);
}
