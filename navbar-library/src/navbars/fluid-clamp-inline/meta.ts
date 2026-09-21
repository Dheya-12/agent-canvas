import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'fluid-clamp-inline',
  displayName: 'Fluid-Clamp Inline Rail',
  reference: { site: 'North Kingdom', url: 'https://www.northkingdom.com/' },
  layout: 'split',
  menuArchitecture: 'dropdown',
  mobilePattern: 'inline',
  scrollBehavior: 'static',
  motionIntensity: 1,
  density: 'airy',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: false,
  comfortableItems: [2, 5],
  maxLabelChars: 10,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  referenceFixture: 'noCta',
  tone: ['confident', 'studio', 'spacious', 'typographic', 'playful'],
  industries: ['design studio', 'games', 'entertainment', 'advertising', 'portfolio'],
  notes:
    'The bar holds 80px at every viewport while its TYPE ramps fluidly - ' +
    'clamp(16px, 3.964px + 1.4159vw, 24.354px), solved from the reference and ' +
    'reproducing its 24.35 / 18.46 / 16 / 16 measurements exactly - so the rail ' +
    'reads large on a desktop without a breakpoint step. The mark is taller than ' +
    'the content box and overflows it. IMPORTANT CONSTRAINT: links stay inline at ' +
    'every width; the reference provides no burger, so this suits few short labels ' +
    'and is a poor fit for deep navigation. ADDITION: below 768px the link rail ' +
    'scrolls horizontally with a soft edge mask, because the reference only ever ' +
    'carries four short labels and generated content can exceed the row.',
};
