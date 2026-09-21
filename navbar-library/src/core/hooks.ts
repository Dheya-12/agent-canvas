import { useCallback, useEffect, useRef, useState } from 'react';

/** SSR-safe layout effect. */
const useIso = typeof window === 'undefined' ? useEffect : useEffect;

/**
 * Scroll state shared by every scroll-reactive navbar.
 * One passive listener, rAF-throttled, removed on unmount.
 */
export interface ScrollState {
  y: number;
  /** true once past `threshold` */
  past: boolean;
  /** 'up' | 'down' — direction of the last meaningful move */
  dir: 'up' | 'down';
  /** true when the bar should be hidden (scrolling down, past threshold) */
  hidden: boolean;
  atTop: boolean;
}

export function useScrollState(threshold = 60, hideAfter = 140): ScrollState {
  const [s, setS] = useState<ScrollState>({ y: 0, past: false, dir: 'up', hidden: false, atTop: true });
  const last = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const read = () => {
      ticking.current = false;
      const y = window.scrollY || 0;
      const prev = last.current;
      // Ignore sub-pixel jitter so direction does not thrash.
      const delta = y - prev;
      if (Math.abs(delta) < 2) return;
      last.current = y;
      const dir = delta > 0 ? 'down' : 'up';
      setS({
        y,
        past: y > threshold,
        dir,
        hidden: dir === 'down' && y > hideAfter,
        atTop: y <= 2,
      });
    };
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(read);
    };
    last.current = window.scrollY || 0;
    // Seed immediately so a mid-page refresh does not flash the wrong state.
    setS(p => ({ ...p, y: last.current, past: last.current > threshold, atTop: last.current <= 2 }));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, hideAfter]);

  return s;
}

/**
 * Body scroll lock that survives repeated open/close cycles and nesting.
 * Reference-counted at module scope: two navbars on one page cannot leave
 * the body permanently locked, and an unmount while open always unlocks.
 */
let lockCount = 0;
let saved: { overflow: string; paddingRight: string; top: string; position: string; width: string } | null = null;
let savedY = 0;

function applyLock() {
  if (typeof document === 'undefined') return;
  if (lockCount++ > 0) return;
  const b = document.body;
  saved = {
    overflow: b.style.overflow,
    paddingRight: b.style.paddingRight,
    top: b.style.top,
    position: b.style.position,
    width: b.style.width,
  };
  savedY = window.scrollY || 0;
  const sbw = window.innerWidth - document.documentElement.clientWidth;
  b.style.overflow = 'hidden';
  if (sbw > 0) b.style.paddingRight = `${sbw}px`;
}

function releaseLock() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) return;
  if (--lockCount > 0) return;
  const b = document.body;
  if (saved) {
    b.style.overflow = saved.overflow;
    b.style.paddingRight = saved.paddingRight;
    b.style.top = saved.top;
    b.style.position = saved.position;
    b.style.width = saved.width;
    saved = null;
  }
  void savedY;
}

export function useScrollLock(active: boolean) {
  const held = useRef(false);
  useEffect(() => {
    if (active && !held.current) { held.current = true; applyLock(); }
    else if (!active && held.current) { held.current = false; releaseLock(); }
  }, [active]);
  // Unmount while open must still release.
  useEffect(() => () => { if (held.current) { held.current = false; releaseLock(); } }, []);
}

/** Escape-to-close, registered only while open. */
export function useEscape(active: boolean, onEscape: () => void) {
  const cb = useRef(onEscape);
  cb.current = onEscape;
  useEffect(() => {
    if (!active || typeof window === 'undefined') return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') cb.current(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [active]);
}

/** Matches a media query with one listener; SSR renders the `false` branch. */
export function useMedia(query: string): boolean {
  const [m, setM] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const h = () => setM(mq.matches);
    h();
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [query]);
  return m;
}

/**
 * Closes the menu when the viewport crosses out of mobile range.
 * Without this, resizing while the drawer is open strands the lock.
 */
export function useCloseOnDesktop(open: boolean, close: () => void, query = '(min-width: 1000px)') {
  const isDesktop = useMedia(query);
  const cb = useRef(close);
  cb.current = close;
  useEffect(() => { if (isDesktop && open) cb.current(); }, [isDesktop, open]);
}

/** Honors prefers-reduced-motion for every animated navbar. */
export function useReducedMotion(): boolean {
  return useMedia('(prefers-reduced-motion: reduce)');
}

/** Image logo with graceful text fallback (damage tolerance). */
export function useImageFallback(src?: string) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [src]);
  const onError = useCallback(() => setFailed(true), []);
  return { show: !!src && !failed, onError };
}

/** Stable menu open/close with a guarded toggle (no double-fire). */
export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen(v => !v), []);
  return { open, onOpen, onClose, onToggle, setOpen };
}

void useIso;
