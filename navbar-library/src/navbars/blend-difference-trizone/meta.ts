import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'blend-difference-trizone',
  displayName: 'Blend-Difference Tri-Zone Monospace Rail',
  reference: { site: 'Studio Freight', url: 'https://studiofreight.com/' },
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
  comfortableItems: [2, 6],
  maxLabelChars: 12,
  rtlSupport: 'partial',
  dependencies: [],
  assets: [],
  tone: ['experimental', 'technical', 'monospace', 'editorial', 'studio'],
  industries: ['design studio', 'motion', 'creative technology', 'music', 'portfolio'],
  notes:
    'The rail has no background of its own — mix-blend-mode: difference inverts it ' +
    'against the page, so it stays legible over light and dark sections with no scroll ' +
    'listener. Requires page content behind it to read correctly; over a mid-grey ' +
    'background the inverted text can approach low contrast. Dropdown panels and the ' +
    'mobile panel opt out of the blend (isolation: isolate) because text-over-text ' +
    'difference blending is unreadable. RTL is partial: the off-centre cluster is ' +
    'mirrored, but the composition was designed left-to-right.',
};
