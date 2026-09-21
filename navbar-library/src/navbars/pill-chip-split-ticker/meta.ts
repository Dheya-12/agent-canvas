import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'pill-chip-split-ticker',
  displayName: 'Pill-Chip Split Rail with Centre Announcement',
  reference: { site: 'Instrument', url: 'https://www.instrument.com/' },
  layout: 'split-center',
  menuArchitecture: 'dropdown',
  mobilePattern: 'overlay-fullscreen',
  scrollBehavior: 'transparent-to-solid',
  motionIntensity: 2,
  density: 'compact',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  comfortableItems: [4, 8],
  maxLabelChars: 12,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  tone: ['modern', 'confident', 'agency', 'editorial', 'playful'],
  industries: ['agency', 'software', 'media', 'entertainment', 'events'],
  notes:
    'Navigation renders as pill chips, not plain links. `items` split at their ' +
    'midpoint into a left and a right cluster (odd counts give the extra item to ' +
    'the left so the centre stays centred); `cta` joins the right cluster as a ' +
    'filled chip; `secondaryAction` becomes the centred announcement line. ' +
    'Combines two scroll responses: transparent-to-solid AND hide-on-scroll. ' +
    'Needs at least 4 items to read as split - below that use a split layout. ' +
    'ADDITION: the reference carries no brand mark in the rail at all; one is ' +
    'rendered below 1024px so the collapsed bar is not anonymous.',
};
