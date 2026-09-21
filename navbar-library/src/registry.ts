import type { NavbarEntry, NavbarMeta, NavbarProps } from './core/types';

/**
 * Registry built by scanning src/navbars/<id>/{index.tsx,meta.ts}.
 * Adding a navbar means adding its folder — nothing here changes.
 */
const metaMods = import.meta.glob<{ meta: NavbarMeta }>('./navbars/*/meta.ts', { eager: true });
const compMods = import.meta.glob<{ default: React.ComponentType<NavbarProps> }>('./navbars/*/index.tsx', { eager: true });

const byId = new Map<string, NavbarEntry>();

for (const [path, mod] of Object.entries(metaMods)) {
  const folder = path.split('/')[2];
  const comp = compMods[`./navbars/${folder}/index.tsx`];
  if (!comp?.default) {
    console.warn(`[navbar-registry] ${folder} has meta.ts but no default export in index.tsx`);
    continue;
  }
  const meta = mod.meta;
  if (meta.id !== folder) {
    console.warn(`[navbar-registry] ${folder}: meta.id "${meta.id}" does not match folder name`);
  }
  byId.set(meta.id, { meta, Component: comp.default });
}

export const navbars: NavbarEntry[] = [...byId.values()].sort((a, b) => a.meta.id.localeCompare(b.meta.id));
export const navbarIds = navbars.map(n => n.meta.id);
export const getNavbar = (id: string): NavbarEntry | undefined => byId.get(id);
export const allMeta = (): NavbarMeta[] => navbars.map(n => n.meta);

/** Minimal capability filter a planner can use before ranking. */
export function selectNavbars(q: {
  itemCount?: number;
  needsDropdowns?: boolean;
  needsCta?: boolean;
  theme?: 'light' | 'dark';
  maxMotion?: number;
  rtl?: boolean;
  layout?: NavbarMeta['layout'];
}): NavbarMeta[] {
  return allMeta().filter(m => {
    if (q.needsDropdowns && !m.supportsDropdowns) return false;
    if (q.needsCta && !m.supportsCta) return false;
    if (q.theme && !m.themes.includes(q.theme)) return false;
    if (typeof q.maxMotion === 'number' && m.motionIntensity > q.maxMotion) return false;
    if (q.rtl && m.rtlSupport === 'none') return false;
    if (q.layout && m.layout !== q.layout) return false;
    if (typeof q.itemCount === 'number' && (q.itemCount < m.comfortableItems[0] || q.itemCount > m.comfortableItems[1])) return false;
    return true;
  });
}
