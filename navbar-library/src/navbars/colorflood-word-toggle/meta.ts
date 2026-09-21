import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'colorflood-word-toggle',
  displayName: 'Colour-Flood Menu with Word Toggle',
  reference: { site: 'Locomotive', url: 'https://locomotive.ca/' },
  layout: 'split-center',
  menuArchitecture: 'dropdown',
  mobilePattern: 'overlay-fullscreen',
  scrollBehavior: 'static',
  motionIntensity: 3,
  density: 'airy',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  comfortableItems: [2, 5],
  maxLabelChars: 12,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  tone: ['bold', 'colourful', 'confident', 'studio', 'youthful'],
  industries: ['design studio', 'agency', 'events', 'education', 'sports', 'retail'],
  notes:
    'Inline type is as large as the wordmark (26px), so this rail suits few, short ' +
    'labels. Below 1024px the control is the WORD "Menu" at rail type size, not a ' +
    'burger glyph. Opening floods the viewport with a single saturated colour, set ' +
    'via --nb-accent (default #312dfb) and intended to be overridden per brand. ' +
    'The flood sits below the rail in z-order so the rail stays interactive; while ' +
    'open the rail drops its difference blend so it reads against the accent. ' +
    'Third navbar using difference blending, alongside blend-difference-trizone ' +
    '(fixed-px monospace) and inset-blend-giant-mark (fluid vw, inset): this one is ' +
    'fixed-px with large type and a colour-flood menu. ' +
    'Unlike the reference, the overlay locks body scroll.',
};
