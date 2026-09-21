import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getNavbar, navbars } from '../registry';
import { fixtures } from './fixtures';
import './harness.css';

/**
 * Capture harness. The comparison rig drives it purely through the URL:
 *   /?nav=<id>&fixture=<name>[&theme=light|dark][&dir=rtl]
 */
function App() {
  const q = new URLSearchParams(location.search);
  const id = q.get('nav') || navbars[0]?.meta.id;
  const fixtureName = q.get('fixture') || 'normal';
  const entry = id ? getNavbar(id) : undefined;

  const base = fixtures[fixtureName] ?? fixtures.normal;
  const initialTheme = (q.get('theme') as 'light' | 'dark' | null) ?? base.theme ?? 'light';
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  useEffect(() => { setTheme(initialTheme); }, [initialTheme]);
  const dir = (q.get('dir') as 'ltr' | 'rtl' | null) ?? base.dir ?? 'ltr';
  const content = { ...base, theme, dir };

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.documentElement.dir = dir;
    document.documentElement.lang = content.locale || 'en';
  }, [theme, dir, content.locale]);

  if (!entry) {
    return (
      <main style={{ padding: 40, fontFamily: 'monospace' }}>
        <h1>Navbar not found: {String(id)}</h1>
        <ul>{navbars.map(n => <li key={n.meta.id}><a href={`/?nav=${n.meta.id}`}>{n.meta.id}</a> — {n.meta.displayName}</li>)}</ul>
      </main>
    );
  }

  const { Component } = entry;
  return (
    <>
      <Component content={content} onThemeChange={setTheme} />
      <div className="spacer" />
      <div className="filler" id="filler">
        {['ONE', 'TWO', 'THREE', 'FOUR'].map(t => <section key={t}>{t}</section>)}
      </div>
    </>
  );
}

const el = document.getElementById('root')!;
createRoot(el).render(<StrictMode><App /></StrictMode>);
// Signal to the capture rig that React has mounted.
requestAnimationFrame(() => { document.documentElement.dataset.ready = '1'; });
