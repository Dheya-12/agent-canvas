import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'lightweight-type-theme-switch',
  displayName: 'Light-Weight Type Rail with Theme Switch',
  reference: { site: 'Stink Studios', url: 'https://www.stinkstudios.com/' },
  layout: 'split',
  menuArchitecture: 'dropdown',
  mobilePattern: 'drawer',
  scrollBehavior: 'hide-on-scroll',
  motionIntensity: 2,
  density: 'balanced',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  supportsThemeToggle: true,
  comfortableItems: [2, 6],
  maxLabelChars: 12,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  referenceFixture: 'themed',
  tone: ['contemporary', 'quiet', 'studio', 'editorial', 'dark-first'],
  industries: ['agency', 'production', 'film', 'design studio', 'software'],
  notes:
    'Dark-first: renders on a dark surface by default. Type is large (23px) but set ' +
    'at weight 300 on negative tracking, so it reads quiet rather than loud - it ' +
    'needs a typeface with a usable light weight. The only navbar in the library ' +
    'with an in-bar light/dark switch: it does NOT own the theme, it renders the ' +
    '`theme` it is given and reports the requested value through `onThemeChange`, ' +
    'so the host stays the single source of truth. Phone menu is a narrow 300px ' +
    'drawer sliding from the trailing edge rather than a full-bleed overlay.',
};
