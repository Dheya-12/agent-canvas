import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'stacked-column-micro',
  displayName: 'Stacked-Column Micro Nav',
  reference: { site: 'Zajno', url: 'https://zajno.com/' },
  layout: 'split-center',
  menuArchitecture: 'inline',
  mobilePattern: 'drawer',
  scrollBehavior: 'static',
  motionIntensity: 1,
  density: 'compact',
  themes: ['light', 'dark'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  comfortableItems: [2, 6],
  maxLabelChars: 14,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  tone: ['minimal', 'typographic', 'understated', 'editorial', 'portfolio'],
  industries: ['design studio', 'portfolio', 'photography', 'publishing', 'architecture'],
  notes:
    'Navigation is stacked into vertical columns rather than laid out as a row, so ' +
    'the bar is only a few lines tall. The bar is absolute, not fixed: it scrolls ' +
    'away with the page, which suits sites with a strong hero. Children continue ' +
    'the stack indented rather than opening a panel, since a floating dropdown ' +
    'would be out of scale at this type size. Below 700px the columns collapse into ' +
    'one disclosure stack. DEVIATION: the reference type is 0.833vw, reaching 6.4px ' +
    'at 768 and 3.2px at 390; the fluid ramp is kept but floored at 11px.',
};
