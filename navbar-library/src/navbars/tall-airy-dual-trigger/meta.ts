import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'tall-airy-dual-trigger',
  displayName: 'Tall Airy Rail with Persistent Menu Trigger',
  reference: { site: 'BASIC/DEPT', url: 'https://www.basicagency.com/' },
  layout: 'split-center',
  menuArchitecture: 'dropdown',
  mobilePattern: 'overlay-fullscreen',
  scrollBehavior: 'hide-on-scroll',
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
  tone: ['editorial', 'premium', 'restrained', 'brand-led', 'spacious'],
  industries: ['agency', 'branding', 'architecture', 'consultancy', 'luxury'],
  notes:
    'Unusually tall (126px at 1440, stepping to 101 / 88 / 70) with an 80px gutter ' +
    'and links spaced a full 60px apart, so it needs generous page whitespace to ' +
    'read as intended. Typographic signature is uppercase on NEGATIVE tracking. ' +
    'The "Menu" trigger is present at every width - at desktop it sits alongside ' +
    'the inline links rather than replacing them, offering a second route into a ' +
    'fuller index. The rail hides on scroll-down but never while the menu is open.',
};
