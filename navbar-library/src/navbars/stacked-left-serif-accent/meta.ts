import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'stacked-left-serif-accent',
  displayName: 'Stacked-Left Nav with Centred Serif Wordmark',
  reference: { site: 'Griflan Design', url: 'https://griflan.com/' },
  layout: 'split-center',
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
  comfortableItems: [3, 6],
  maxLabelChars: 16,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  contentOverflowsBar: true,
  referenceFixture: 'dropdowns',
  tone: ['editorial', 'warm', 'crafted', 'brand-led', 'serif'],
  industries: ['branding', 'design studio', 'publishing', 'hospitality', 'wine & spirits'],
  notes:
    'Three zones on three different alignments: navigation stacked VERTICALLY ' +
    'hard-left, a serif wordmark centred on the viewport axis, and the actions ' +
    'right. All of it deliberately overflows a very shallow bar (2.5vw), so the ' +
    'page beneath needs top whitespace to receive it. Dark-first, with one hot ' +
    'accent (--nb-accent) carrying both actions and the disclosure chevrons, and a ' +
    'serif face (--nb-serif) for the mark and the primary action. Because the nav ' +
    'is a stack rather than a row, item COUNT costs vertical space instead of ' +
    'horizontal: six items already reach about 9vw down the page. Children expand ' +
    'in place, indented, rather than opening a floating panel. ' +
    'DEVIATION: the reference scales type at a strict 1vw, reaching 7.7px at 768; ' +
    'the fluid ramp is kept but floored at 12px.',
};
