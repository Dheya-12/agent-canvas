import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'chunky-pill-emblem',
  displayName: 'Chunky Control Rail with Accent Pill',
  reference: { site: 'Lando Norris', url: 'https://landonorris.com/' },
  layout: 'split-center',
  menuArchitecture: 'dropdown',
  mobilePattern: 'overlay-fullscreen',
  scrollBehavior: 'static',
  motionIntensity: 3,
  density: 'balanced',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  comfortableItems: [0, 4],
  maxLabelChars: 12,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  tone: ['bold', 'sporty', 'high-energy', 'consumer', 'merch-led'],
  industries: ['sports', 'personal brand', 'entertainment', 'fitness', 'retail', 'music'],
  notes:
    'Controls are sized off the BAR rather than the type - a 60px rounded square in ' +
    'an 83px rail - which gives the bar a physical, product-like weight. The burger ' +
    'is present at every width including desktop, so inline links are optional and ' +
    'the full index is always one tap away; this is the one navbar in the library ' +
    'that works with zero items. `cta` takes a high-visibility accent pill, set via ' +
    '--nb-accent (default #d2ff00) and meant to be overridden per brand; ' +
    '--nb-menu sets the deep-tone menu surface. `secondaryAction` renders as the ' +
    'centred circular emblem, using its `icon` or the first two characters of its ' +
    'label. Overlay labels roll vertically on hover, as in the reference.',
};
