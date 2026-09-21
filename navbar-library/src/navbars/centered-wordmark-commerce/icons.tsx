import type { NavUtility } from '../../core/types';

/** Minimal inline glyph set, so the navbar carries no asset dependency. */
export function UtilityIcon({ name }: { name?: NavUtility['icon'] }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'search':
      return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="6" {...p} /><path d="M13.5 13.5 17 17" {...p} /></svg>;
    case 'wishlist':
      return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 16.5 3.8 10.4a3.6 3.6 0 0 1 5.1-5.1l1.1 1.1 1.1-1.1a3.6 3.6 0 1 1 5.1 5.1Z" {...p} /></svg>;
    case 'account':
      return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="7" r="3.2" {...p} /><path d="M3.8 17a6.2 6.2 0 0 1 12.4 0" {...p} /></svg>;
    case 'cart':
      return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 6h11l-1 10.5h-9Z" {...p} /><path d="M7.3 6V4.6a2.7 2.7 0 0 1 5.4 0V6" {...p} /></svg>;
    case 'globe':
      return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5" {...p} /><path d="M3.5 10h13M10 3.5c3.5 4 3.5 9 0 13-3.5-4-3.5-9 0-13Z" {...p} /></svg>;
    default:
      return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.5" {...p} /></svg>;
  }
}
