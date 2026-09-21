/**
 * Navbar content contract.
 *
 * Every navbar in this library consumes exactly this shape. A planner can
 * populate any navbar without knowing which one it selected, or how that
 * navbar renders internally.
 *
 * Design rule: the DATA interface is normalized; the DESIGN behavior is not.
 * A navbar is free to ignore fields it has no place for (see `NavbarMeta`
 * for what each one actually honors) but must never crash on their presence.
 */

export type ThemeName = 'light' | 'dark';
export type Direction = 'ltr' | 'rtl';

export interface NavbarBrand {
  /** Text wordmark. Always required — it is the fallback when `logo` fails. */
  name: string;
  /** Optional image logo URL. If it fails to load, `name` is rendered instead. */
  logo?: string;
  /** Alt text for `logo`. Defaults to `name`. */
  logoAlt?: string;
  /** Link target for the brand. Defaults to '/'. */
  href?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  /** Sub-navigation. Navbars that declare `supportsDropdowns: false` render
   *  children inside their mobile menu only, never silently dropping them. */
  children?: NavItem[];
  /** Small text marker, e.g. "New". Rendered only where the design has room. */
  badge?: string;
  /** Marks the current page. */
  current?: boolean;
}

export interface NavAction {
  label: string;
  href?: string;
  /** Optional trailing glyph, e.g. '→'. Purely decorative. */
  icon?: string;
}

export interface NavSocial {
  label: string;
  href?: string;
}

/**
 * A compact utility control: search, account, wishlist, cart, locale.
 * Commerce navbars render these as an icon cluster; every other navbar
 * ignores the field. `icon` names a built-in glyph the navbar may draw;
 * `label` is always required and is used for the accessible name.
 */
export interface NavUtility {
  label: string;
  href?: string;
  icon?: 'search' | 'account' | 'wishlist' | 'cart' | 'menu' | 'globe';
  /** Small numeric indicator, e.g. cart count. */
  count?: number;
}

export interface NavbarContent {
  brand: NavbarBrand;
  items: NavItem[];
  /** Primary call to action. `null`/omitted must degrade cleanly. */
  cta?: NavAction | null;
  /** Secondary action (account, cart, language, phone…). Optional. */
  secondaryAction?: NavAction | null;
  socials?: NavSocial[];
  /** Utility controls (search, account, cart...). Honoured only by navbars
   *  whose metadata reports `supportsUtilities`. */
  utilities?: NavUtility[];
  /** Labels for the mobile/overlay menu toggle. */
  menuLabel?: { open: string; close: string };
  /**
   * Opt-in light/dark switch rendered inside the bar. Honoured only by
   * navbars whose metadata reports `supportsThemeToggle`. The navbar does
   * not own the theme: it reports the requested value through
   * `NavbarProps.onThemeChange` and renders whatever `theme` it is given.
   */
  themeToggle?: { toLight: string; toDark: string };
  /**
   * A live clock rendered in the bar, as several studio sites do. Honoured
   * only by navbars whose metadata reports `supportsClock`. `timeZone` is an
   * IANA zone; an invalid one falls back to UTC rather than throwing.
   */
  clock?: { timeZone?: string; label?: string };
  theme?: ThemeName;
  dir?: Direction;
  locale?: string;
}

export interface NavbarProps {
  content: NavbarContent;
  className?: string;
  style?: React.CSSProperties;
  /** Called instead of navigating, so a host router can take over. */
  onNavigate?: (href: string, item?: NavItem) => void;
  /** Called when the in-bar theme switch is used. The host owns the theme. */
  onThemeChange?: (theme: ThemeName) => void;
}

/* ------------------------------------------------------------------ */
/* Selection metadata — what the AI planner reasons over.              */
/* Describes DESIGN CHARACTER, never the original company.             */
/* ------------------------------------------------------------------ */

export type LayoutKind =
  | 'split'          // brand left, nav right
  | 'split-center'   // brand left, nav centered, action right
  | 'centered'       // brand centered
  | 'left-stack'     // everything clustered left
  | 'edge'           // brand hard-left, action hard-right, nothing between
  | 'floating'       // detached pill/card inset from the viewport edges
  | 'minimal';       // brand + single toggle only

export type MenuArchitecture =
  | 'inline'             // links live in the bar at desktop
  | 'overlay-fullscreen' // toggle opens a full-viewport panel
  | 'drawer'             // toggle opens a side panel
  | 'dropdown'           // inline links with hover/click submenus
  | 'mega';              // inline links with full-width panels

export type ScrollBehavior =
  | 'static'
  | 'sticky'
  | 'hide-on-scroll'       // translates out going down, back in going up
  | 'shrink'               // reduces height / scale
  | 'transparent-to-solid';// gains background after threshold

export interface NavbarMeta {
  /** Stable unique id, used by the registry and the planner. */
  id: string;
  /** Design-descriptive name. Deliberately NOT the reference company. */
  displayName: string;
  /** Internal provenance only. */
  reference: { site: string; url: string; inspectedAt?: string };

  layout: LayoutKind;
  menuArchitecture: MenuArchitecture;
  mobilePattern: MenuArchitecture;
  scrollBehavior: ScrollBehavior;

  /** 0 = no motion, 5 = elaborate choreography. */
  motionIntensity: 0 | 1 | 2 | 3 | 4 | 5;
  /** Visual weight of the bar itself. */
  density: 'airy' | 'balanced' | 'compact';

  themes: ThemeName[];
  supportsDropdowns: boolean;
  supportsCta: boolean;
  supportsSecondaryAction: boolean;
  supportsSocials: boolean;
  /** Renders `content.utilities` as a control cluster. */
  supportsUtilities?: boolean;
  /** Renders `content.themeToggle` as an in-bar light/dark switch. */
  supportsThemeToggle?: boolean;
  /** Renders `content.clock` as a live clock in the bar. */
  supportsClock?: boolean;
  /** Item count the design holds without degrading at 1440px. */
  comfortableItems: [min: number, max: number];
  /** Longest single label (chars) that fits at 1440px without wrapping. */
  maxLabelChars: number;

  rtlSupport: 'full' | 'partial' | 'none';
  /** Runtime npm dependencies beyond react. Empty = portable anywhere. */
  dependencies: string[];
  /** Non-code assets required. Empty = self-contained. */
  assets: string[];

  /** Planner-facing descriptors. */
  tone: string[];
  industries: string[];

  /**
   * Fixture in src/dev/fixtures.ts whose SHAPE best matches the reference
   * site, used for the fidelity comparison. Comparing a commerce rail with
   * content that carries no utilities measures nothing, so the shape has to
   * match before the geometry means anything. Defaults to 'normal'.
   */
  referenceFixture?: string;

  notes?: string;
}

export interface NavbarEntry {
  meta: NavbarMeta;
  Component: React.ComponentType<NavbarProps>;
}
