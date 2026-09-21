import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'centred-cluster-float',
  displayName: 'Centred Floating Cluster',
  reference: { site: 'Bakken & Baeck', url: 'https://bakkenbaeck.com/' },
  layout: 'centered',
  menuArchitecture: 'dropdown',
  mobilePattern: 'drawer',
  scrollBehavior: 'static',
  motionIntensity: 1,
  density: 'compact',
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
  referenceFixture: 'fiveItems',
  tone: ['modern', 'calm', 'product-led', 'studio', 'approachable'],
  industries: ['agency', 'software', 'saas', 'consultancy', 'design studio'],
  notes:
    'The whole navigation - mark, links and action - is a single cluster held on ' +
    'the viewport axis rather than spread to the edges, so the bar reads as one ' +
    'object floating over a full-bleed page. The bar spans the viewport but is ' +
    'pointer-events: none, so it never swallows clicks meant for the content ' +
    'behind it; only the controls opt back in. Because the cluster is centred, ' +
    'total label length matters more than item count: long labels push the mark ' +
    'and action outward symmetrically. Below 640px the cluster stops being centred ' +
    'and becomes mark-left / controls-right with a dropdown card.',
};
