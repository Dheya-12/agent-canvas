import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'justified-row-blend',
  displayName: 'Justified Link Row on a Blend Rail',
  reference: { site: 'Studio Dumbar', url: 'https://studiodumbar.com/' },
  layout: 'split',
  menuArchitecture: 'dropdown',
  mobilePattern: 'overlay-fullscreen',
  scrollBehavior: 'static',
  motionIntensity: 2,
  density: 'airy',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  comfortableItems: [3, 6],
  maxLabelChars: 12,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  referenceFixture: 'fiveItems',
  tone: ['editorial', 'graphic', 'studio', 'confident', 'typographic'],
  industries: ['design studio', 'branding', 'publishing', 'arts', 'culture'],
  notes:
    'The links are JUSTIFIED, not gap-spaced: the row occupies a fixed fraction of ' +
    'the bar (from ~51% of the width to the trailing gutter) and distributes items ' +
    'with space-between, so spacing is whatever is left over. Adding an item ' +
    'tightens every gap instead of pushing the row outward, which keeps the ' +
    'trailing edge locked to the gutter - the reason it reads as a measured, ' +
    'graphic composition. The action joins the justified row rather than sitting ' +
    'outside it. Fifth navbar in the library using mix-blend-mode: difference; it ' +
    'is distinguished from the others by the justified row, not by the blend. The ' +
    'phone menu jumps to 60px type, so it reads as a statement rather than a list.',
};
