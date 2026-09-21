import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'tall-padded-pushdown',
  displayName: 'Tall Padded Rail with Push-Down Sheet',
  reference: { site: 'ManvsMachine', url: 'https://mvsm.com/' },
  layout: 'split',
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
  maxLabelChars: 14,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  referenceFixture: 'withSocials',
  tone: ['crafted', 'quiet', 'studio', 'premium', 'motion-led'],
  industries: ['motion', 'film', 'design studio', 'animation', 'portfolio'],
  notes:
    'Height comes from vertical padding (48px above and below a 28px row) rather ' +
    'than a set height, so the rail breathes with its type and needs page ' +
    'whitespace to match. Gutters are symmetric with the padding at 54px. Socials ' +
    'render in the bar beside the links rather than in a footer, which is unusual ' +
    'and suits studios with one or two channels - more than three will crowd the ' +
    'row. The menu is parked above the viewport and pushes down into it, links ' +
    'trailing in from above. Shares a tall silhouette with tall-airy-dual-trigger ' +
    'but differs in composition (no centre link row, no persistent desktop ' +
    'trigger), type (mixed-case 20px vs uppercase 14px) and reveal direction.',
};
