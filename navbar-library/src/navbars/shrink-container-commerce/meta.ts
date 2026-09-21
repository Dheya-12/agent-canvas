import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'shrink-container-commerce',
  displayName: 'Shrinking Contained Rail',
  reference: { site: 'Bonhomme', url: 'https://bonhomme.fr/' },
  layout: 'split',
  menuArchitecture: 'dropdown',
  mobilePattern: 'drawer',
  scrollBehavior: 'shrink',
  motionIntensity: 1,
  density: 'balanced',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  supportsUtilities: true,
  comfortableItems: [3, 7],
  maxLabelChars: 18,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  referenceFixture: 'commerceWide',
  tone: ['retail', 'warm', 'catalogue', 'established', 'approachable'],
  industries: ['ecommerce', 'fashion', 'food & drink', 'homeware', 'hospitality', 'retail'],
  notes:
    'The only rail in the library that SHRINKS on scroll: bar, mark and wordmark ' +
    'all reduce together (104px to 91px, 0.15s linear), which suits a catalogue ' +
    'page where the bar must stay present but stop dominating. It is also the only ' +
    'one carrying a solid surface at rest rather than sitting transparent over ' +
    'content, and it holds its contents in a 1220px max-width container rather ' +
    'than running to the viewport edges - so it pairs with contained page layouts, ' +
    'not full-bleed heroes. Items sit flush with internal padding rather than a ' +
    'gap, and the row is allowed to wrap, which is why the reference is TALLER at ' +
    '1024 (130px) than at 1440 (104px). `utilities` render as labelled text ' +
    'controls with an optional count rather than icons.',
};
