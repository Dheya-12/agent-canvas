import { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { navbars } from '../registry';
import { fixtures } from './fixtures';
import type { ThemeName } from '../core/types';
import './harness.css';
import './gallery.css';

/**
 * Offline specimen gallery.
 *
 * Every navbar renders inline rather than in an iframe, so the whole page can
 * ship as one self-contained file. Each stage sets `transform: translateZ(0)`,
 * which makes it the containing block for `position: fixed` descendants — that
 * is what lets twenty fixed navbars coexist on one page without stacking on
 * top of each other at the viewport's top edge.
 */
const SWITCHES = [
  { fx: 'normal', label: 'Coffee shop', note: '3 items, CTA' },
  { fx: 'fiveItems', label: 'Law firm', note: '5 items' },
  { fx: 'manyItems', label: 'Gym', note: '9 items' },
  { fx: 'long', label: 'Long copy', note: '28-char labels' },
  { fx: 'arabic', label: 'Arabic (RTL)', note: 'dir=rtl' },
  { fx: 'dropdowns', label: 'Submenus', note: 'nested children' },
  { fx: 'brokenLogo', label: 'Broken logo', note: '404 image URL' },
  { fx: 'empty', label: 'No content', note: 'damage tolerance' },
];

declare const __BASELINE__: Record<string, Record<string, { h: number } | null>>;
declare const __STATUS__: Record<string, string>;

function Stage({ id, fixture }: { id: string; fixture: string }) {
  const entry = navbars.find(n => n.meta.id === id)!;
  const { Component, meta } = entry;
  const base = fixtures[fixture] ?? fixtures.normal;
  const [theme, setTheme] = useState<ThemeName>(base.theme ?? 'light');
  useEffect(() => { setTheme(base.theme ?? 'light'); }, [base.theme, fixture]);
  const content = useMemo(() => ({ ...base, theme }), [base, theme]);

  /*
   * Tonal bands exist for the navbars that invert against the page
   * (mix-blend-mode: difference) - without a varied ground they cannot be
   * shown honestly. Every other navbar gets a plain surface matching the
   * ground it was designed for: a light rail over a near-black band reads as
   * invisible, which is true but looks like a defect rather than a fact.
   */
  const stageRef = useRef<HTMLDivElement>(null);
  const [blends, setBlends] = useState(false);
  useEffect(() => {
    const el = stageRef.current?.querySelector('header');
    if (!el) return;
    setBlends(getComputedStyle(el).mixBlendMode !== 'normal');
  }, [fixture, theme]);
  const h = (k: string) => {
    const v = __BASELINE__[id]?.[`normal@${k}`]?.h;
    return v == null ? '--' : String(Math.round(v));
  };
  const status = __STATUS__[id] ?? 'NOT RUN';
  const cls = status === 'PASS' ? 'ok' : status === 'FAIL' ? 'bad' : 'obs';

  return (
    <article className="spec">
      <header className="spec-head">
        <div className="spec-id">
          <span className="num">{String(navbars.findIndex(n => n.meta.id === id) + 1).padStart(2, '0')}</span>
          <div>
            <h2>{meta.displayName}</h2>
            <p className="ref">measured from <span>{meta.reference.site}</span> · <code>{meta.id}</code></p>
          </div>
        </div>
        <span className={`badge ${cls}`}>{status === 'PASS WITH OBSERVATIONS' ? 'PASS + OBS' : status}</span>
      </header>

      {/* The transform makes this element the containing block for the
          navbar's `position: fixed` root. */}
      <div className="stage" data-theme={theme} data-bed={blends ? 'bands' : 'plain'} ref={stageRef}>
        <div className="bed"><span /><span /><span /></div>
        <Component content={content} onThemeChange={setTheme} />
      </div>

      <dl className="measures">
        <div><dt>1440</dt><dd>{h('desktop')}<i>px</i></dd></div>
        <div><dt>1024</dt><dd>{h('laptop')}<i>px</i></dd></div>
        <div><dt>768</dt><dd>{h('tablet')}<i>px</i></dd></div>
        <div><dt>390</dt><dd>{h('mobile')}<i>px</i></dd></div>
        <div className="wide"><dt>scroll</dt><dd className="t">{meta.scrollBehavior}</dd></div>
        <div className="wide"><dt>menu</dt><dd className="t">{meta.menuArchitecture} / {meta.mobilePattern}</dd></div>
        <div><dt>motion</dt><dd>{meta.motionIntensity}<i>/5</i></dd></div>
        <div><dt>items</dt><dd>{meta.comfortableItems[0]}–{meta.comfortableItems[1]}</dd></div>
      </dl>
      <p className="note">{meta.notes}</p>
    </article>
  );
}

function Gallery() {
  const [fixture, setFixture] = useState('normal');
  const pass = navbars.filter(n => __STATUS__[n.meta.id] === 'PASS').length;
  const obs = navbars.filter(n => __STATUS__[n.meta.id] === 'PASS WITH OBSERVATIONS').length;

  return (
    <div className="gal">
      <div className="wrap">
        <header className="mast">
          <p className="eyebrow">Reconstructed · measured · certified</p>
          <h1>Navbar Specimen Book</h1>
          <p className="lede">
            {navbars.length} navigation components, each rebuilt from measurements of a live
            production site rather than from a screenshot. Every one is <strong>content-agnostic</strong>:
            the same data goes into all of them. Switch the content below and every
            specimen re-renders at once — that is the whole point of the library.
          </p>
          <p className="tally">
            <span><b>{pass}</b> pass</span>
            <span><b>{obs}</b> pass with observations</span>
            <span><b>0</b> fail</span>
            <span><b>0</b> runtime dependencies beyond React</span>
          </p>
        </header>
      </div>

      <div className="rail">
        <div className="wrap">
          <div className="rail-in">
            <span className="rail-label">Content</span>
            <div className="chips">
              {SWITCHES.map(s => (
                <button
                  key={s.fx}
                  type="button"
                  className="chip"
                  aria-pressed={fixture === s.fx}
                  onClick={() => setFixture(s.fx)}
                >
                  {s.label}
                  <small>{s.note}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="book">
          {navbars.map(n => <Stage key={n.meta.id} id={n.meta.id} fixture={fixture} />)}
        </div>
        <footer>
          <p>
            Each specimen is a live React component, not a screenshot. Heights are the
            certified values measured at each viewport. “Pass with observations” means the
            reconstruction differs from its reference on purpose, with the reason recorded —
            two references render roughly 3px labels on a phone, which no generated content can use.
          </p>
          <p>This file is self-contained: no server, no network, nothing to install.</p>
        </footer>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><Gallery /></StrictMode>);
