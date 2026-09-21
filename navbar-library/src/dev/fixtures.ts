import type { NavbarContent } from '../core/types';

/** Content conditions every navbar is certified against. */
export const fixtures: Record<string, NavbarContent> = {
  /* The prompt's three baseline conditions ------------------------------ */
  short: {
    brand: { name: 'AI' },
    items: [{ label: 'Work', href: '/work' }, { label: 'About', href: '/about' }],
    cta: { label: 'Go', href: '/go', icon: '→' },
  },
  normal: {
    brand: { name: 'Hejaz Coffee' },
    items: [
      { label: 'Menu', href: '/menu' },
      { label: 'Our Story', href: '/story' },
      { label: 'Locations', href: '/locations' },
    ],
    cta: { label: 'Order Online', href: '/order', icon: '→' },
  },
  long: {
    brand: { name: 'Advanced Automotive Collision & Restoration' },
    items: [
      { label: 'Collision Repair Services', href: '/collision' },
      { label: 'Insurance Claim Assistance', href: '/insurance' },
      { label: 'Vehicle Restoration Projects', href: '/restoration' },
    ],
    cta: { label: 'Schedule an Inspection', href: '/schedule', icon: '→' },
  },

  /* Structural boundary conditions -------------------------------------- */
  oneItem: { brand: { name: 'Solo' }, items: [{ label: 'Contact', href: '/c' }] },
  fiveItems: {
    brand: { name: 'Harrison Law' },
    items: [
      { label: 'Practice', href: '/p' }, { label: 'Attorneys', href: '/a' },
      { label: 'Results', href: '/r' }, { label: 'Insights', href: '/i' },
      { label: 'Careers', href: '/c' },
    ],
    cta: { label: 'Consultation', href: '/consult', icon: '→' },
  },
  manyItems: {
    brand: { name: 'Iron House' },
    items: ['Training', 'Coaches', 'Memberships', 'Classes', 'Nutrition', 'Facilities', 'Shop', 'Blog', 'Careers']
      .map(l => ({ label: l, href: '/' + l.toLowerCase() })),
    cta: { label: 'Join Now', href: '/join' },
  },
  noCta: {
    brand: { name: 'Quiet Studio' },
    items: [{ label: 'Work', href: '/w' }, { label: 'Studio', href: '/s' }, { label: 'Contact', href: '/c' }],
    cta: null,
  },
  dropdowns: {
    brand: { name: 'Northwind Group' },
    items: [
      { label: 'Services', href: '/s', children: [
        { label: 'Strategy', href: '/s/strategy' },
        { label: 'Design', href: '/s/design' },
        { label: 'Engineering', href: '/s/eng' },
      ] },
      { label: 'Work', href: '/work' },
      { label: 'About', href: '/about', children: [
        { label: 'Our Team', href: '/about/team' },
        { label: 'Careers', href: '/about/careers', badge: 'New' },
      ] },
    ],
    cta: { label: 'Contact', href: '/contact', icon: '→' },
    secondaryAction: { label: 'EN', href: '/en' },
  },
  imageLogo: {
    brand: { name: 'Vector Labs', logo: '/logo-sample.svg', logoAlt: 'Vector Labs' },
    items: [{ label: 'Platform', href: '/p' }, { label: 'Pricing', href: '/pr' }, { label: 'Docs', href: '/d' }],
    cta: { label: 'Start free', href: '/start' },
  },
  /* Damage tolerance: logo URL that will 404 -> must fall back to wordmark */
  brokenLogo: {
    brand: { name: 'Fallback Co', logo: '/does-not-exist-404.png' },
    items: [{ label: 'Work', href: '/w' }, { label: 'About', href: '/a' }],
    cta: { label: 'Contact', href: '/c' },
  },
  /* Degenerate content: must not throw */
  empty: { brand: { name: '' }, items: [] },

  /* Internationalization ------------------------------------------------ */
  arabic: {
    brand: { name: 'مقهى الحجاز' },
    items: [
      { label: 'القائمة', href: '/menu' },
      { label: 'قصتنا', href: '/story' },
      { label: 'المواقع', href: '/locations' },
    ],
    cta: { label: 'اطلب الآن', href: '/order' },
    dir: 'rtl',
    locale: 'ar',
  },
  mixed: {
    brand: { name: 'Hejaz مقهى' },
    items: [
      { label: 'Menu القائمة', href: '/menu' },
      { label: 'Our Story', href: '/story' },
      { label: 'المواقع', href: '/locations' },
    ],
    cta: { label: 'Order — اطلب', href: '/order' },
  },
  accents: {
    brand: { name: 'Café Crème Brûlée' },
    items: [
      { label: 'Spécialités', href: '/s' },
      { label: 'Pâtisserie', href: '/p' },
      { label: 'Réservations', href: '/r' },
    ],
    cta: { label: 'Réserver', href: '/book', icon: '→' },
  },
  longWords: {
    brand: { name: 'Donaudampfschifffahrtsgesellschaft' },
    items: [
      { label: 'Rechtsschutzversicherungsgesellschaften', href: '/1' },
      { label: 'Betäubungsmittelverschreibungsverordnung', href: '/2' },
    ],
    cta: { label: 'Kontaktaufnahme', href: '/k' },
  },
  numeric: {
    brand: { name: '24/7 Plumbing & Drain Co. #1' },
    items: [
      { label: '$99 Drain Special', href: '/1' },
      { label: '24/7 Emergency', href: '/2' },
      { label: 'Service Areas (50+)', href: '/3' },
    ],
    cta: { label: 'Call 1-800-555-0199', href: 'tel:18005550199' },
  },
  darkTheme: {
    brand: { name: 'Obsidian' },
    items: [{ label: 'Work', href: '/w' }, { label: 'Studio', href: '/s' }, { label: 'Journal', href: '/j' }],
    cta: { label: 'Get in touch', href: '/c', icon: '→' },
    theme: 'dark',
  },
  commerce: {
    brand: { name: 'House of Linen' },
    items: [
      { label: 'Shop', href: '/shop', children: [
        { label: 'Best Sellers', href: '/shop/best' },
        { label: 'New Arrivals', href: '/shop/new' },
        { label: 'All Prints', href: '/shop/all' },
      ] },
      { label: 'Artists', href: '/artists' },
      { label: 'Gallery Wall Builder', href: '/builder', badge: 'New' },
    ],
    cta: { label: 'Membership', href: '/membership' },
    secondaryAction: { label: 'US / $', href: '/locale' },
    utilities: [
      { label: 'Search', href: '/search', icon: 'search' },
      { label: 'Wishlist', href: '/wishlist', icon: 'wishlist' },
      { label: 'Account', href: '/account', icon: 'account' },
      { label: 'Cart', href: '/cart', icon: 'cart', count: 0 },
    ],
    socials: [{ label: 'Instagram', href: '#' }, { label: 'Spotify', href: '#' }],
  },
  themed: {
    brand: { name: 'Stone & Ridge' },
    items: [
      { label: 'Work', href: '/work' },
      { label: 'About', href: '/about' },
      { label: 'News', href: '/news' },
      { label: 'Contact', href: '/contact' },
    ],
    themeToggle: { toLight: 'Switch to light mode', toDark: 'Switch to dark mode' },
    theme: 'dark',
  },
  withSocials: {
    brand: { name: 'Field Notes' },
    items: [{ label: 'Archive', href: '/a' }, { label: 'About', href: '/ab' }],
    cta: { label: 'Subscribe', href: '/sub' },
    socials: [{ label: 'Instagram', href: '#' }, { label: 'LinkedIn', href: '#' }, { label: 'X', href: '#' }],
  },
};

export const fixtureNames = Object.keys(fixtures);
