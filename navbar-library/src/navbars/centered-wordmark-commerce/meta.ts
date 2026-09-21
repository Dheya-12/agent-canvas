import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'centered-wordmark-commerce',
  displayName: 'Centred Wordmark Commerce Rail with Mega Panel',
  reference: { site: 'House of Spoils', url: 'https://houseofspoils.com/' },
  layout: 'centered',
  menuArchitecture: 'mega',
  mobilePattern: 'drawer',
  scrollBehavior: 'transparent-to-solid',
  motionIntensity: 2,
  density: 'balanced',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  supportsUtilities: true,
  comfortableItems: [2, 5],
  maxLabelChars: 22,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  tone: ['premium', 'editorial', 'retail', 'refined', 'photographic'],
  industries: ['ecommerce', 'fashion', 'homeware', 'art', 'beauty', 'hospitality'],
  referenceFixture: 'commerce',
  notes:
    'Built for commerce: `utilities` render as a trailing icon cluster (inline SVG, ' +
    'no asset dependency, optional count badge), `secondaryAction` as a locale or ' +
    'currency selector, and items with children open a full-width mega panel. ' +
    'The wordmark is absolutely centred on the viewport axis, so it stays on axis ' +
    'however wide the flanking clusters grow. Designed to sit transparent over hero ' +
    'imagery and take a solid surface once scrolled.',
};
