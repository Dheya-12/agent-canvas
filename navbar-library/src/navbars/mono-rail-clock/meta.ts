import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'mono-rail-clock',
  displayName: 'Monospace Rail with Live Clock',
  reference: { site: 'Koto', url: 'https://koto.studio/' },
  layout: 'split',
  menuArchitecture: 'dropdown',
  mobilePattern: 'overlay-fullscreen',
  scrollBehavior: 'static',
  motionIntensity: 2,
  density: 'compact',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  supportsClock: true,
  comfortableItems: [3, 7],
  maxLabelChars: 12,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  referenceFixture: 'clocked',
  tone: ['technical', 'studio', 'dark-first', 'monospace', 'understated'],
  industries: ['design studio', 'branding', 'software', 'creative technology', 'music'],
  notes:
    'Dark-first monospace rail, inset 16px from the top, with uppercase 12px links ' +
    'on a measured 36px gap and an accent-coloured mark (--nb-accent). The only ' +
    'navbar here carrying a LIVE CLOCK: it is minute-aligned rather than drifting ' +
    'on a 60s interval, renders only after mount so server and client markup ' +
    'agree, and falls back to UTC if given an invalid time zone - the zone arrives ' +
    'as generated content. Needs a monospace face to read as intended; the digits ' +
    'are set tabular so the clock does not jitter on each tick.',
};
