import fs from 'node:fs';
import path from 'node:path';
import { buildManifest } from './manifest.mjs';

const metas = await buildManifest();
const cert = JSON.parse(fs.readFileSync('reports/certification.json', 'utf8'));
const base = JSON.parse(fs.readFileSync('reports/baseline.json', 'utf8'));
const byId = new Map(cert.results.map(r => [r.id, r]));

/** Content conditions the gallery can switch every specimen to at once. */
const SWITCHES = [
  { fx: 'normal', label: 'Coffee shop', note: '3 items, CTA' },
  { fx: 'fiveItems', label: 'Law firm', note: '5 items' },
  { fx: 'manyItems', label: 'Gym', note: '9 items' },
  { fx: 'long', label: 'Long copy', note: '28-char labels' },
  { fx: 'arabic', label: 'Arabic (RTL)', note: 'dir=rtl' },
  { fx: 'dropdowns', label: 'Submenus', note: 'nested children' },
  { fx: 'empty', label: 'No content', note: 'damage tolerance' },
];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const h = (id, k) => {
  const v = base.navbars[id]?.[`normal@${k}`]?.h;
  return v == null ? '--' : `${Math.round(v)}`;
};

const rows = metas.map((m, i) => {
  const r = byId.get(m.id);
  const status = r?.status ?? 'NOT RUN';
  const cls = status === 'PASS' ? 'ok' : status === 'FAIL' ? 'bad' : 'obs';
  const shortStatus = status === 'PASS WITH OBSERVATIONS' ? 'PASS + OBS' : status;
  const devs = r?.fidelity?.deviations?.length ?? 0;
  return `
  <article class="spec" id="${esc(m.id)}">
    <header class="spec-head">
      <div class="spec-id">
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <div>
          <h2>${esc(m.displayName)}</h2>
          <p class="ref">measured from <span>${esc(m.reference.site)}</span> &middot; <code>${esc(m.id)}</code></p>
        </div>
      </div>
      <div class="spec-meta">
        <span class="badge ${cls}">${esc(shortStatus)}</span>
        <a class="open" href="app.html?nav=${esc(m.id)}&amp;fixture=normal" target="_blank" rel="noopener">Open full size &rarr;</a>
      </div>
    </header>

    <div class="stage" data-nav="${esc(m.id)}">
      <iframe title="${esc(m.displayName)} preview" loading="lazy" src="app.html?nav=${esc(m.id)}&amp;fixture=normal&amp;preview=1"></iframe>
    </div>

    <dl class="measures">
      <div><dt>1440</dt><dd>${h(m.id, 'desktop')}<i>px</i></dd></div>
      <div><dt>1024</dt><dd>${h(m.id, 'laptop')}<i>px</i></dd></div>
      <div><dt>768</dt><dd>${h(m.id, 'tablet')}<i>px</i></dd></div>
      <div><dt>390</dt><dd>${h(m.id, 'mobile')}<i>px</i></dd></div>
      <div class="wide"><dt>scroll</dt><dd class="t">${esc(m.scrollBehavior)}</dd></div>
      <div class="wide"><dt>menu</dt><dd class="t">${esc(m.menuArchitecture)} / ${esc(m.mobilePattern)}</dd></div>
      <div><dt>motion</dt><dd>${m.motionIntensity}<i>/5</i></dd></div>
      <div><dt>items</dt><dd>${m.comfortableItems[0]}&ndash;${m.comfortableItems[1]}</dd></div>
      ${devs ? `<div class="wide"><dt>deviations</dt><dd class="t warnt">${devs} declared</dd></div>` : ''}
    </dl>

    <p class="note">${esc(m.notes || '')}</p>
  </article>`;
}).join('\n');

const page = `<title>Navbar Specimen Book</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
  :root {
    --paper: #eef0f2;
    --surface: #ffffff;
    --ink: #12151a;
    --muted: #5e6873;
    --rule: #d3d8de;
    --accent: #0d6d63;
    --ok: #2f6b3a;
    --warn: #a2650c;
    --bad: #a3322a;
    --shadow: 0 1px 0 rgba(18,21,26,.06), 0 8px 26px rgba(18,21,26,.06);
    --ui: 'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --mono: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --paper: #0f1216;
      --surface: #171b21;
      --ink: #e7ebf0;
      --muted: #929cA8;
      --rule: #272d35;
      --accent: #46bcac;
      --ok: #62b36f;
      --warn: #d3a04a;
      --bad: #e08078;
      --shadow: 0 1px 0 rgba(0,0,0,.4), 0 8px 26px rgba(0,0,0,.35);
    }
  }
  :root[data-theme="dark"] {
    --paper: #0f1216; --surface: #171b21; --ink: #e7ebf0; --muted: #929ca8;
    --rule: #272d35; --accent: #46bcac; --ok: #62b36f; --warn: #d3a04a; --bad: #e08078;
    --shadow: 0 1px 0 rgba(0,0,0,.4), 0 8px 26px rgba(0,0,0,.35);
  }

  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: var(--ui);
    font-size: 15px;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 1180px; margin-inline: auto; padding-inline: 20px; }

  /* ---- masthead ---- */
  .mast { padding-block: 44px 26px; border-bottom: 1px solid var(--rule); }
  .eyebrow {
    font-family: var(--mono); font-size: 11.5px; letter-spacing: .13em;
    text-transform: uppercase; color: var(--accent); margin: 0 0 12px;
  }
  .mast h1 {
    margin: 0 0 12px; font-size: clamp(30px, 5vw, 46px); font-weight: 700;
    letter-spacing: -.028em; line-height: 1.05; text-wrap: balance;
  }
  .lede { margin: 0; max-width: 62ch; color: var(--muted); font-size: 16px; }
  .lede strong { color: var(--ink); font-weight: 600; }
  .tally { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 18px; font-family: var(--mono); font-size: 12.5px; color: var(--muted); }
  .tally b { color: var(--ink); font-weight: 500; }

  /* ---- content switcher: the page's thesis, made operable ---- */
  .rail {
    position: sticky; top: env(safe-area-inset-top, 0px); z-index: 20;
    background: color-mix(in srgb, var(--paper) 88%, transparent);
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--rule);
  }
  .rail-in { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding-block: 12px; }
  .rail-label { font-family: var(--mono); font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); flex: 0 0 auto; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip {
    appearance: none; cursor: pointer; font: inherit; font-size: 13px;
    padding: 6px 12px; border-radius: 999px; border: 1px solid var(--rule);
    background: var(--surface); color: var(--ink); transition: border-color .18s, color .18s;
  }
  .chip:hover { border-color: var(--accent); }
  /* The accent is dark enough in light theme and light enough in dark theme
     that a single high-contrast label works on both. */
  .chip[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: var(--surface); }
  .chip small { display: block; font-family: var(--mono); font-size: 10px; opacity: .72; letter-spacing: .04em; }
  .chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  /* ---- specimens ---- */
  .book { padding-block: 30px 70px; display: flex; flex-direction: column; gap: 34px; }
  .spec { background: var(--surface); border: 1px solid var(--rule); border-radius: 10px; box-shadow: var(--shadow); overflow: hidden; }
  .spec-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 18px 20px 14px; }
  .spec-id { display: flex; gap: 14px; align-items: baseline; min-width: 0; }
  .num { font-family: var(--mono); font-size: 12px; color: var(--accent); letter-spacing: .08em; flex: 0 0 auto; }
  .spec h2 { margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -.015em; line-height: 1.25; text-wrap: balance; }
  .ref { margin: 3px 0 0; font-size: 13px; color: var(--muted); }
  .ref span { color: var(--ink); }
  .ref code { font-family: var(--mono); font-size: 12px; }
  .spec-meta { display: flex; align-items: center; gap: 14px; flex: 0 0 auto; }
  .badge {
    font-family: var(--mono); font-size: 10.5px; letter-spacing: .09em; text-transform: uppercase;
    padding: 4px 9px; border-radius: 4px; border: 1px solid currentColor; white-space: nowrap;
  }
  .badge.ok { color: var(--ok); } .badge.obs { color: var(--warn); } .badge.bad { color: var(--bad); }
  .open { font-size: 13px; color: var(--accent); text-decoration: none; white-space: nowrap; border-bottom: 1px solid transparent; }
  .open:hover { border-bottom-color: currentColor; }

  /* The specimen runs at a true 1440 and is scaled down, so the geometry
     on screen is the geometry that was measured. */
  .stage { --w: 1440; --hgt: 200; position: relative; width: 100%; overflow: hidden; border-block: 1px solid var(--rule); background: var(--surface); }
  .stage::after { content: '1440 \\00d7 200'; position: absolute; right: 8px; bottom: 6px; font-family: var(--mono); font-size: 10px; color: var(--muted); opacity: .7; pointer-events: none; }
  .stage iframe { border: 0; width: 1440px; height: 200px; transform-origin: 0 0; display: block; }

  .measures { display: flex; flex-wrap: wrap; gap: 0; margin: 0; padding: 14px 20px 4px; }
  .measures > div { flex: 0 0 auto; min-width: 84px; padding-right: 22px; margin-bottom: 10px; }
  .measures > div.wide { min-width: 168px; }
  .measures dt { font-family: var(--mono); font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
  .measures dd { margin: 1px 0 0; font-family: var(--mono); font-size: 16px; font-variant-numeric: tabular-nums; }
  .measures dd i { font-style: normal; font-size: 11px; color: var(--muted); margin-left: 1px; }
  .measures dd.t { font-size: 13px; }
  .measures dd.warnt { color: var(--warn); }

  .note { margin: 0; padding: 4px 20px 18px; font-size: 13.5px; color: var(--muted); max-width: 88ch; }

  footer { border-top: 1px solid var(--rule); padding-block: 26px 44px; color: var(--muted); font-size: 13px; }
  footer code { font-family: var(--mono); font-size: 12px; color: var(--ink); }

  @media (max-width: 640px) {
    .spec-head { padding: 15px 15px 12px; }
    .measures { padding-inline: 15px; }
    .note { padding-inline: 15px; }
  }
  @media (prefers-reduced-motion: reduce) { * { transition-duration: .01ms !important; } }
</style>

<div class="wrap">
  <header class="mast">
    <p class="eyebrow">Reconstructed &middot; measured &middot; certified</p>
    <h1>Navbar Specimen Book</h1>
    <p class="lede">
      ${metas.length} navigation components, each rebuilt from measurements of a live
      production site rather than from a screenshot. Every one is <strong>content-agnostic</strong>:
      the same data goes into all of them. Switch the content below and watch all
      ${metas.length} re-render at once &mdash; that is the whole point of the library.
    </p>
    <p class="tally">
      <span><b>${cert.results.filter(r => r.status === 'PASS').length}</b> pass</span>
      <span><b>${cert.results.filter(r => r.status === 'PASS WITH OBSERVATIONS').length}</b> pass with observations</span>
      <span><b>${cert.results.filter(r => r.status === 'FAIL').length}</b> fail</span>
      <span><b>0</b> runtime dependencies beyond React</span>
    </p>
  </header>
</div>

<div class="rail">
  <div class="wrap">
    <div class="rail-in">
      <span class="rail-label">Content</span>
      <div class="chips" id="chips">
        ${SWITCHES.map((s, i) => `<button class="chip" type="button" data-fx="${s.fx}" aria-pressed="${i === 0}">${esc(s.label)}<small>${esc(s.note)}</small></button>`).join('\n        ')}
      </div>
    </div>
  </div>
</div>

<div class="wrap">
  <div class="book">
${rows}
  </div>

  <footer>
    <p>
      Each specimen renders at a true 1440&times;200 and is scaled to fit, so what you see is the
      geometry that was measured. Heights are the certified values at each viewport.
      &ldquo;Pass with observations&rdquo; means the reconstruction differs from its reference on
      purpose, with the reason recorded &mdash; two references render ~3px labels on a phone,
      which no generated content can use.
    </p>
    <p>Run locally: <code>npm install &amp;&amp; npm run build &amp;&amp; ./scripts/serve.sh</code>, then <code>npm test</code> for the 557-check regression suite.</p>
  </footer>
</div>

<script>
  // Scale each 1440-wide specimen down to its column, keeping real geometry.
  function fit() {
    document.querySelectorAll('.stage').forEach(function (st) {
      var f = st.querySelector('iframe');
      if (!f) return;
      var k = st.clientWidth / 1440;
      f.style.transform = 'scale(' + k + ')';
      st.style.height = Math.round(200 * k) + 'px';
    });
  }
  window.addEventListener('resize', fit);
  fit();
  window.addEventListener('load', fit);

  // One control swaps the content of every specimen at once.
  document.getElementById('chips').addEventListener('click', function (e) {
    var btn = e.target.closest('.chip');
    if (!btn) return;
    var fx = btn.dataset.fx;
    this.querySelectorAll('.chip').forEach(function (c) {
      c.setAttribute('aria-pressed', String(c === btn));
    });
    document.querySelectorAll('.stage').forEach(function (st) {
      var f = st.querySelector('iframe');
      if (f) f.src = 'app.html?nav=' + st.dataset.nav + '&fixture=' + fx + '&preview=1';
    });
    document.querySelectorAll('.open').forEach(function (a) {
      a.href = a.href.replace(/fixture=[^&]*/, 'fixture=' + fx);
    });
  });
</script>`;

fs.mkdirSync('gallery', { recursive: true });
fs.writeFileSync('gallery/index.html', page);
// Ship the built app beside the gallery so the specimens are live, not images.
fs.copyFileSync('dist/index.html', 'gallery/app.html');
fs.rmSync('gallery/assets', { recursive: true, force: true });
fs.cpSync('dist/assets', 'gallery/assets', { recursive: true });
if (fs.existsSync('dist/logo-sample.svg')) fs.copyFileSync('dist/logo-sample.svg', 'gallery/logo-sample.svg');
const files = fs.readdirSync('gallery/assets');
console.log(`gallery/index.html  (${metas.length} specimens, ${(page.length / 1024).toFixed(0)} kB)`);
console.log(`gallery/app.html + assets: ${files.join(', ')}`);
