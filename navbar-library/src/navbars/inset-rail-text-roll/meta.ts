import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'inset-rail-text-roll',
  displayName: 'Inset Rail with Rolling Labels',
  reference: { site: 'Merci-Michel', url: 'https://merci-michel.com/' },
  layout: 'split',
  menuArchitecture: 'dropdown',
  mobilePattern: 'inline',
  scrollBehavior: 'static',
  motionIntensity: 3,
  density: 'compact',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: false,
  comfortableItems: [2, 5],
  maxLabelChars: 10,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  tone: ['playful', 'crafted', 'studio', 'boutique', 'interactive'],
  industries: ['design studio', 'motion', 'gaming', 'advertising', 'portfolio'],
  notes:
    'Absolute rather than fixed: the rail scrolls away with the page instead of ' +
    'following it, and is inset 45px from each side rather than full-bleed. The ' +
    'interaction signature is a vertical label roll on hover, built from two ' +
    'stacked copies of each label in a clipped box (the duplicate is aria-hidden). ' +
    'IMPORTANT CONSTRAINT: the row stays horizontal at every width - the reference ' +
    'provides no burger and no overflow menu - so this navbar needs few items with ' +
    'short labels. Above roughly 5 items or 10 characters a label it will crowd on ' +
    'a phone. Choose a collapsing navbar for content-heavy sites.',
};
