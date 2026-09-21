import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'sticky-rail-blur-overlay',
  displayName: 'Sticky Rail, Oversized Mark, Frosted Overlay',
  reference: { site: 'AREA 17', url: 'https://area17.com/' },
  layout: 'split',
  menuArchitecture: 'dropdown',
  mobilePattern: 'overlay-fullscreen',
  scrollBehavior: 'sticky',
  motionIntensity: 2,
  density: 'balanced',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  comfortableItems: [3, 7],
  maxLabelChars: 16,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  tone: ['editorial', 'institutional', 'restrained', 'typographic'],
  industries: ['agency', 'architecture', 'consultancy', 'publishing', 'education'],
  notes:
    'Brand mark is intentionally larger than the 64px rail and overflows below it. ' +
    'Below 1000px the links are replaced by a frosted full-viewport overlay ' +
    '(blur(30px), 0.5s opacity fade, staggered links). Unlike the reference, ' +
    'the scroll lock is released on close — the reference leaves body overflow hidden.',
};
