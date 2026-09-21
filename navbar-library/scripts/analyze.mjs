/* Shared page-analysis probe. Identical code runs against the reference
 * site and against our reconstruction, so the two measurement sets are
 * produced the same way and are therefore comparable. */
export const ANALYZE = () => {
  const px = v => Math.round(parseFloat(v) || 0);
  const vis = e => {
    const c = getComputedStyle(e);
    return c.display !== 'none' && c.visibility !== 'hidden' && parseFloat(c.opacity) > 0.01;
  };

  // Candidate navbar containers
  const all = [...document.querySelectorAll('body *')];
  const cands = [];
  for (const e of all) {
    const c = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    if (!vis(e)) continue;
    if (r.width < Math.min(280, innerWidth * 0.5)) continue;
    if (r.height < 16 || r.height > innerHeight * 0.6) continue;
    if (r.top > 180 || r.bottom < 0) continue;
    const tag = e.tagName;
    const id = (e.id || '') + ' ' + (typeof e.className === 'string' ? e.className : '');
    const links = e.querySelectorAll('a,button').length;
    let s = 0;
    if (tag === 'HEADER') s += 40;
    if (tag === 'NAV') s += 30;
    if (/header|navbar|nav\b|topbar|masthead/i.test(id)) s += 25;
    if (c.position === 'fixed') s += 30;
    if (c.position === 'sticky') s += 25;
    if (c.position === 'absolute') s += 10;
    if (px(c.zIndex) > 1) s += 10;
    s += Math.min(links, 10) * 3;
    if (r.top <= 4) s += 10;
    if (r.width > innerWidth * 0.85) s += 10;
    if (links === 0) s -= 30;
    if (r.height > 200) s -= 15;
    cands.push({ e, s, r, c, tag, links });
  }
  cands.sort((a, b) => b.s - a.s);
  if (!cands.length) return { found: false };

  // Prefer the outermost among top-scoring overlapping candidates
  let best = cands[0];
  for (const cd of cands.slice(0, 12)) {
    if (cd.s >= best.s - 12 && cd.e.contains(best.e) && cd.e !== best.e && cd.r.height <= best.r.height * 2.4) best = cd;
  }
  const el = best.e;
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();

  const styleOf = e => {
    const c = getComputedStyle(e), r = e.getBoundingClientRect();
    return {
      rect: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
      font: `${c.fontFamily}`.split(',')[0].replace(/["']/g, ''),
      fontSize: c.fontSize, fontWeight: c.fontWeight, lineHeight: c.lineHeight,
      letterSpacing: c.letterSpacing, textTransform: c.textTransform, color: c.color,
      bg: c.backgroundColor, radius: c.borderRadius, border: c.borderWidth + ' ' + c.borderStyle + ' ' + c.borderColor,
      padding: c.padding, transition: c.transition === 'all 0s ease 0s' ? '' : c.transition,
      mixBlendMode: c.mixBlendMode, opacity: c.opacity, transform: c.transform,
    };
  };

  // interactive descendants
  const inter = [...el.querySelectorAll('a,button,[role="button"]')]
    .filter(vis)
    .map(e => {
      const r = e.getBoundingClientRect();
      return {
        tag: e.tagName,
        text: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
        aria: e.getAttribute('aria-label') || '',
        cls: (typeof e.className === 'string' ? e.className : '').slice(0, 60),
        hasImg: !!e.querySelector('img,svg'),
        ...styleOf(e),
      };
    })
    .filter(o => o.rect.w > 0 && o.rect.h > 0)
    .slice(0, 28);

  // logo guess = leftmost interactive with image, or first
  const byX = [...inter].sort((a, b) => a.rect.x - b.rect.x);
  const logo = byX.find(o => o.hasImg) || byX[0] || null;

  // fonts actually used
  const fonts = [...new Set([...el.querySelectorAll('*')].slice(0, 200)
    .map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '')))].slice(0, 6);

  return {
    found: true,
    selectorTag: el.tagName,
    selectorCls: (typeof el.className === 'string' ? el.className : '').slice(0, 90),
    score: best.s,
    container: {
      ...styleOf(el),
      position: cs.position, top: cs.top, left: cs.left, right: cs.right,
      zIndex: cs.zIndex, backdropFilter: cs.backdropFilter, boxShadow: cs.boxShadow,
      display: cs.display, justifyContent: cs.justifyContent, alignItems: cs.alignItems,
      gap: cs.gap, width: cs.width, height: cs.height,
      paddingTop: cs.paddingTop, paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft,
    },
    interactive: inter,
    logo,
    fonts,
    docBg: getComputedStyle(document.body).backgroundColor,
    interactiveCount: inter.length,
  };
};
