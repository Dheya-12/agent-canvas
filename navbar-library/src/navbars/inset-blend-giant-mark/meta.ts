import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'inset-blend-giant-mark',
  displayName: 'Inset Blend Rail with Oversized Wordmark',
  reference: { site: 'Obys', url: 'https://obys.agency/' },
  layout: 'split-center',
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
  comfortableItems: [2, 5],
  maxLabelChars: 10,
  rtlSupport: 'partial',
  dependencies: [],
  assets: [],
  tone: ['bold', 'brand-forward', 'experimental', 'studio', 'fashion'],
  industries: ['design studio', 'fashion', 'creative technology', 'portfolio', 'music'],
  notes:
    'Inset 0.7vw from every edge, so page content shows around the rail. Shares ' +
    'mix-blend-mode: difference and a three-zone composition with ' +
    'blend-difference-trizone; the difference is the scale system (fully fluid vw ' +
    'here vs fixed px there) and the oversized wordmark, which occupies the full ' +
    'rail height. DEVIATION: the reference lets link type scale to ~3px at 390px ' +
    'wide; that is legible only for its own two-word labels, so this version keeps ' +
    'the fluid ramp but floors it at 12px.',
};
