import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'fluid-rail-pill',
  displayName: 'Fluid Rail with Pill CTA',
  reference: { site: 'Cuberto', url: 'https://cuberto.com/' },
  layout: 'split',
  menuArchitecture: 'dropdown',
  mobilePattern: 'drawer',
  scrollBehavior: 'hide-on-scroll',
  motionIntensity: 3,
  density: 'airy',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  comfortableItems: [2, 6],
  maxLabelChars: 14,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  tone: ['contemporary', 'confident', 'product-led', 'clean'],
  industries: ['design studio', 'software', 'agency', 'saas', 'consultancy'],
  notes:
    'All desktop dimensions are viewport-relative (5vw bar, 7.5vw gutters, 1.25vw links), ' +
    'so the rail keeps its proportions at any width instead of stepping at breakpoints. ' +
    'Below 768px it becomes a detached translucent card that expands in place.',
};
