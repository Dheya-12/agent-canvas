import type { NavbarMeta } from '../../core/types';

export const meta: NavbarMeta = {
  id: 'colour-block-grid',
  displayName: 'Colour-Block Grid',
  reference: { site: 'OFFF Barcelona', url: 'https://www.offf.barcelona/' },
  layout: 'edge',
  menuArchitecture: 'inline',
  mobilePattern: 'inline',
  scrollBehavior: 'static',
  motionIntensity: 1,
  density: 'compact',
  themes: ['light'],
  supportsDropdowns: true,
  supportsCta: true,
  supportsSecondaryAction: true,
  supportsSocials: true,
  comfortableItems: [3, 9],
  maxLabelChars: 20,
  rtlSupport: 'full',
  dependencies: [],
  assets: [],
  referenceFixture: 'manyItems',
  tone: ['loud', 'playful', 'graphic', 'editorial', 'poster-like'],
  industries: ['events', 'festivals', 'arts', 'culture', 'music', 'education', 'media'],
  notes:
    'Navigation is not a row of links: each item becomes a full-bleed coloured ' +
    'strip, laid out in three columns whose widths the reference holds at ' +
    '29% / 35.5% / 35.5%. The action is a tall block filling the last column in ' +
    'the largest type in the bar. Colours are assigned by position from an ' +
    'overridable palette (--nb-block-1..6, --nb-cta-bg); the COLOUR SYSTEM is the ' +
    'design, the specific hues are brand identity, so the shipped palette is a ' +
    'generic vivid set rather than the reference’s. This is the only navbar here ' +
    'that gets LOUDER with more items, so it suits a content-heavy events site ' +
    'and overwhelms a restrained one. Below 1024px it collapses to a 28px row - ' +
    'the action block on one side, a Menu control on the other - revealing the ' +
    'blocks only when opened; stacking them instead produced a 396px bar. ' +
    'Light only — the ' +
    'blocks supply the colour, so a dark variant would fight them.',
};
