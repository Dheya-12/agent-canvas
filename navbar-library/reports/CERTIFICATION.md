# Navbar library — certification matrix

Generated 2026-09-21T12:22:54Z from `reports/certification.json`.

Every entry is measured, not asserted. A component is certified only after its
reconstruction has been rendered, captured and numerically compared against the
live reference, then put through the content, fatigue and damage-tolerance passes.

| status | meaning |
| --- | --- |
| PASS | no blocking diff, no structural issue, no page error, 10/10 fatigue cycles |
| PASS WITH OBSERVATIONS | as above, plus one or more **declared deviations** from the reference |
| FAIL | a blocking fidelity diff, a structural issue, or a page error |

## Certified components

| id | reference | status | 1440 | 1024 | 768 | 390 | scroll | fatigue | deviations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `blend-difference-trizone` | Studio Freight | PASS | 40px | 40px | 48px | 48px | static | 10/10 | 0 |
| `centered-wordmark-commerce` | House of Spoils | PASS | 64px | 64px | 64px | 64px | transparent-to-solid | 10/10 | 0 |
| `centred-cluster-float` | Bakken & Baeck | PASS | 48px | 48px | 48px | 48px | static | 10/10 | 0 |
| `chunky-pill-emblem` | Lando Norris | PASS WITH OBSERVATIONS | 83px | 59px | 56px | 78px | static | 10/10 | 0 |
| `colorflood-word-toggle` | Locomotive | PASS | 60px | 60px | 60px | 60px | static | 10/10 | 0 |
| `colour-block-grid` | OFFF Barcelona | PASS WITH OBSERVATIONS | 116px | 116px | 28px | 28px | static | 10/10 | 0 |
| `fluid-clamp-inline` | North Kingdom | PASS | 80px | 80px | 80px | 80px | static | 10/10 | 0 |
| `fluid-rail-pill` | Cuberto | PASS | 72px | 51px | 38px | 50px | hide-on-scroll | 10/10 | 0 |
| `inset-blend-giant-mark` | Obys | PASS WITH OBSERVATIONS | 65px | 46px | 46px | 46px | static | 10/10 | 4 |
| `inset-rail-text-roll` | Merci-Michel | PASS | 60px | 60px | 60px | 60px | static | 10/10 | 0 |
| `justified-row-blend` | Studio Dumbar | PASS WITH OBSERVATIONS | 67px | 67px | 40px | 40px | static | 10/10 | 0 |
| `lightweight-type-theme-switch` | Stink Studios | PASS WITH OBSERVATIONS | 66px | 66px | 61px | 66px | hide-on-scroll | 10/10 | 0 |
| `pill-chip-split-ticker` | Instrument | PASS | 50px | 50px | 64px | 53px | transparent-to-solid | 10/10 | 0 |
| `shrink-container-commerce` | Bonhomme | PASS WITH OBSERVATIONS | 104px | 125px | 71px | 72px | shrink | 10/10 | 0 |
| `stacked-column-micro` | Zajno | PASS WITH OBSERVATIONS | 45px | 41px | 41px | 26px | static | 10/10 | 5 |
| `sticky-rail-blur-overlay` | AREA 17 | PASS | 64px | 64px | 56px | 56px | sticky | 10/10 | 0 |
| `tall-airy-dual-trigger` | BASIC/DEPT | PASS | 126px | 101px | 88px | 70px | hide-on-scroll | 10/10 | 0 |
| `tall-padded-pushdown` | ManvsMachine | PASS WITH OBSERVATIONS | 128px | 115px | 102px | 80px | static | 10/10 | 0 |

### Evidence per component

#### `blend-difference-trizone` — Blend-Difference Tri-Zone Monospace Rail

- **Reference:** Studio Freight (https://studiofreight.com/)
- **Captures:** `evidence/studiofreight/` (reference) and `evidence/studiofreight/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `normal`
- **Measurement skips** (probe mis-measures this reference, tablet + mobile only): endGutter
  - At tablet and mobile the reference header exposes exactly one detectable interactive element (the logo) - its menu control is not an <a>/<button>/[role=button], so the probe's rightmost-interactive figure is the logo's right edge (x=36) rather than the real trailing control. End-gutter is therefore not comparable at those two viewports. Desktop and laptop end-gutter remain enforced.
- **Limitations / notes:** The rail has no background of its own — mix-blend-mode: difference inverts it against the page, so it stays legible over light and dark sections with no scroll listener. Requires page content behind it to read correctly; over a mid-grey background the inverted text can approach low contrast. Dropdown panels and the mobile panel opt out of the blend (isolation: isolate) because text-over-text difference blending is unreadable. RTL is partial: the off-centre cluster is mirrored, but the composition was designed left-to-right.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS

#### `centered-wordmark-commerce` — Centred Wordmark Commerce Rail with Mega Panel

- **Reference:** House of Spoils (https://houseofspoils.com/)
- **Captures:** `evidence/houseofspoils/` (reference) and `evidence/houseofspoils/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `commerce`
- **Measurement skips** (probe mis-measures this reference): startGutter
  - The reference's first navigation trigger ('Shop', clearly visible at the left edge in evidence/houseofspoils/desktop-initial.png) is not an <a>, <button> or [role=button], so the probe never sees it and reports the SECOND item ('Artists', x=92) as the leading element. The leading gutter therefore measures the wrong element on this reference. The trailing gutter, which ends at a real link, remains enforced.
- **Limitations / notes:** Built for commerce: `utilities` render as a trailing icon cluster (inline SVG, no asset dependency, optional count badge), `secondaryAction` as a locale or currency selector, and items with children open a full-width mega panel. The wordmark is absolutely centred on the viewport axis, so it stays on axis however wide the flanking clusters grow. Designed to sit transparent over hero imagery and take a solid surface once scrolled.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS

#### `centred-cluster-float` — Centred Floating Cluster

- **Reference:** Bakken & Baeck (https://bakkenbaeck.com/)
- **Captures:** `evidence/bakkenbaeck/` (reference) and `evidence/bakkenbaeck/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `fiveItems`
- **Limitations / notes:** The whole navigation - mark, links and action - is a single cluster held on the viewport axis rather than spread to the edges, so the bar reads as one object floating over a full-bleed page. The bar spans the viewport but is pointer-events: none, so it never swallows clicks meant for the content behind it; only the controls opt back in. Because the cluster is centred, total label length matters more than item count: long labels push the mark and action outward symmetrically. Below 640px the cluster stops being centred and becomes mark-left / controls-right with a dropdown card.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS

#### `chunky-pill-emblem` — Chunky Control Rail with Accent Pill

- **Reference:** Lando Norris (https://landonorris.com/)
- **Captures:** `evidence/lando/` (reference) and `evidence/lando/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `normal`
- **Measurement skips** (probe mis-measures this reference, tablet + mobile only): startGutter, endGutter
  - CAPTURE ARTEFACT, not a property of the reference. The tablet pass opened the reference's menu, which does not close on Escape, and the original harness did not reload between viewports - so the tablet and mobile 'initial' records contain the OPEN menu (their item lists include the menu's own links and a Close control). Gutters at those two viewports therefore measure menu content rather than the bar. The harness now reloads between viewports after any pass that opened a menu; this reference's stored evidence predates that fix. Heights, which are unaffected, remain enforced and match exactly at all four viewports.
- **Known differences (non-blocking):**
  - link font-size 16px vs ref 14px (Δ2.0)
  - link font-size 16px vs ref 14px (Δ2.0)
  - link font-size 16px vs ref 14px (Δ2.0)
- **Limitations / notes:** Controls are sized off the BAR rather than the type - a 60px rounded square in an 83px rail - which gives the bar a physical, product-like weight. The burger is present at every width including desktop, so inline links are optional and the full index is always one tap away; this is the one navbar in the library that works with zero items. `cta` takes a high-visibility accent pill, set via --nb-accent (default #d2ff00) and meant to be overridden per brand; --nb-menu sets the deep-tone menu surface. `secondaryAction` renders as the centred circular emblem, using its `icon` or the first two characters of its label. Overlay labels roll vertically on hover, as in the reference.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS WITH OBSERVATIONS

#### `colorflood-word-toggle` — Colour-Flood Menu with Word Toggle

- **Reference:** Locomotive (https://locomotive.ca/)
- **Captures:** `evidence/locomotive/` (reference) and `evidence/locomotive/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `normal`
- **Limitations / notes:** Inline type is as large as the wordmark (26px), so this rail suits few, short labels. Below 1024px the control is the WORD "Menu" at rail type size, not a burger glyph. Opening floods the viewport with a single saturated colour, set via --nb-accent (default #312dfb) and intended to be overridden per brand. The flood sits below the rail in z-order so the rail stays interactive; while open the rail drops its difference blend so it reads against the accent. Third navbar using difference blending, alongside blend-difference-trizone (fixed-px monospace) and inset-blend-giant-mark (fluid vw, inset): this one is fixed-px with large type and a colour-flood menu. Unlike the reference, the overlay locks body scroll.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS

#### `colour-block-grid` — Colour-Block Grid

- **Reference:** OFFF Barcelona (https://www.offf.barcelona/)
- **Captures:** `evidence/offf/` (reference) and `evidence/offf/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `manyItems`
- **Measurement skips** (probe mis-measures this reference, desktop + laptop only): height
  - The probe selects the reference's pinned-layer wrapper, which is 167px tall, but the navigation blocks inside it end at y=96 (two 20px strip rows plus a 56px action block - see the per-element extents in the evidence). The remaining 71px is empty and shows the hero through it, so the container height is not the bar height. The reconstruction matches the BLOCK geometry: 20px strips and a 56px action block. Tablet and mobile heights measure the real collapsed bar and remain enforced.
- **Known differences (non-blocking):**
  - position fixed vs ref sticky
  - position fixed vs ref sticky
- **Limitations / notes:** Navigation is not a row of links: each item becomes a full-bleed coloured strip, laid out in three columns whose widths the reference holds at 29% / 35.5% / 35.5%. The action is a tall block filling the last column in the largest type in the bar. Colours are assigned by position from an overridable palette (--nb-block-1..6, --nb-cta-bg); the COLOUR SYSTEM is the design, the specific hues are brand identity, so the shipped palette is a generic vivid set rather than the reference’s. This is the only navbar here that gets LOUDER with more items, so it suits a content-heavy events site and overwhelms a restrained one. Below 1024px it collapses to a 28px row - the action block on one side, a Menu control on the other - revealing the blocks only when opened; stacking them instead produced a 396px bar. Light only — the blocks supply the colour, so a dark variant would fight them.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS WITH OBSERVATIONS

#### `fluid-clamp-inline` — Fluid-Clamp Inline Rail

- **Reference:** North Kingdom (https://www.northkingdom.com/)
- **Captures:** `evidence/northkingdom/` (reference) and `evidence/northkingdom/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `noCta`
- **Limitations / notes:** The bar holds 80px at every viewport while its TYPE ramps fluidly - clamp(16px, 3.964px + 1.4159vw, 24.354px), solved from the reference and reproducing its 24.35 / 18.46 / 16 / 16 measurements exactly - so the rail reads large on a desktop without a breakpoint step. The mark is taller than the content box and overflows it. IMPORTANT CONSTRAINT: links stay inline at every width; the reference provides no burger, so this suits few short labels and is a poor fit for deep navigation. ADDITION: below 768px the link rail scrolls horizontally with a soft edge mask, because the reference only ever carries four short labels and generated content can exceed the row.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS

#### `fluid-rail-pill` — Fluid Rail with Pill CTA

- **Reference:** Cuberto (https://cuberto.com/)
- **Captures:** `evidence/cuberto/` (reference) and `evidence/cuberto/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `normal`
- **Limitations / notes:** All desktop dimensions are viewport-relative (5vw bar, 7.5vw gutters, 1.25vw links), so the rail keeps its proportions at any width instead of stepping at breakpoints. Below 768px it becomes a detached translucent card that expands in place.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS

#### `inset-blend-giant-mark` — Inset Blend Rail with Oversized Wordmark

- **Reference:** Obys (https://obys.agency/)
- **Captures:** `evidence/obys/` (reference) and `evidence/obys/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `normal`
- **Declared deviations:**
  - link font-size 12px vs ref 7.82222px (Δ4.2) [declared: The reference scales link type strictly with viewport width, reaching 7.8px at 1024, 5.9px at 768 and 3.0px at 390. That is legible only for its own two-word uppercase labels and fails WCAG for arbitrary generated content. This reconstruction keeps the fluid ramp but floors it at 12px.]
  - height 46.0 vs ref 34.4 (Δ11.6px) [declared: The reference rail is 34px tall at 768 and 17.5px at 390 because its height is also pure vw. A 17.5px bar cannot hold a touch target (44px minimum). This reconstruction floors the rail at 46px below 860px and moves the links into a panel.]
  - link font-size 16px vs ref 5.86666px (Δ10.1) [declared: The reference scales link type strictly with viewport width, reaching 7.8px at 1024, 5.9px at 768 and 3.0px at 390. That is legible only for its own two-word uppercase labels and fails WCAG for arbitrary generated content. This reconstruction keeps the fluid ramp but floors it at 12px.]
  - height 46.0 vs ref 17.5 (Δ28.5px) [declared: The reference rail is 34px tall at 768 and 17.5px at 390 because its height is also pure vw. A 17.5px bar cannot hold a touch target (44px minimum). This reconstruction floors the rail at 46px below 860px and moves the links into a panel.]
- **Limitations / notes:** Inset 0.7vw from every edge, so page content shows around the rail. Shares mix-blend-mode: difference and a three-zone composition with blend-difference-trizone; the difference is the scale system (fully fluid vw here vs fixed px there) and the oversized wordmark, which occupies the full rail height. DEVIATION: the reference lets link type scale to ~3px at 390px wide; that is legible only for its own two-word labels, so this version keeps the fluid ramp but floors it at 12px.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS WITH OBSERVATIONS

#### `inset-rail-text-roll` — Inset Rail with Rolling Labels

- **Reference:** Merci-Michel (https://merci-michel.com/)
- **Captures:** `evidence/mercimichel/` (reference) and `evidence/mercimichel/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `normal`
- **Measurement skips** (probe mis-measures this reference): startGutter
  - At desktop, laptop and tablet the reference's brand mark is not an <a>/<button>/[role=button], so the probe reports the FIRST NAV LINK ('About', x=1123 at 1440) as the leading element. The reference's own mobile viewport, where the mark IS a link, puts it at x=45 - which is exactly the inset this reconstruction uses at every width.
- **Limitations / notes:** Absolute rather than fixed: the rail scrolls away with the page instead of following it, and is inset 45px from each side rather than full-bleed. The interaction signature is a vertical label roll on hover, built from two stacked copies of each label in a clipped box (the duplicate is aria-hidden). IMPORTANT CONSTRAINT: the row stays horizontal at every width - the reference provides no burger and no overflow menu - so this navbar needs few items with short labels. Above roughly 5 items or 10 characters a label it will crowd on a phone. Choose a collapsing navbar for content-heavy sites.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS

#### `justified-row-blend` — Justified Link Row on a Blend Rail

- **Reference:** Studio Dumbar (https://studiodumbar.com/)
- **Captures:** `evidence/studiodumbar/` (reference) and `evidence/studiodumbar/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `fiveItems`
- **Known differences (non-blocking):**
  - position fixed vs ref absolute
- **Limitations / notes:** The links are JUSTIFIED, not gap-spaced: the row occupies a fixed fraction of the bar (from ~51% of the width to the trailing gutter) and distributes items with space-between, so spacing is whatever is left over. Adding an item tightens every gap instead of pushing the row outward, which keeps the trailing edge locked to the gutter - the reason it reads as a measured, graphic composition. The action joins the justified row rather than sitting outside it. Fifth navbar in the library using mix-blend-mode: difference; it is distinguished from the others by the justified row, not by the blend. The phone menu jumps to 60px type, so it reads as a statement rather than a list.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS WITH OBSERVATIONS

#### `lightweight-type-theme-switch` — Light-Weight Type Rail with Theme Switch

- **Reference:** Stink Studios (https://www.stinkstudios.com/)
- **Captures:** `evidence/stinkstudios/` (reference) and `evidence/stinkstudios/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `themed`
- **Measurement skips** (probe mis-measures this reference): height, startGutter, endGutter
  - The probe's container heuristic selects the reference's inner <nav> (the right-aligned link group, 927x30 at 1440) rather than the header bar that wraps it, because the header itself scores lower. Height and both gutters therefore describe the link group, not the bar, and are not comparable with a full-width reconstruction. Link type scale, top offset and hide-on-scroll response remain enforced and all match.
- **Known differences (non-blocking):**
  - position fixed vs ref static
  - position fixed vs ref static
  - position fixed vs ref static
  - position fixed vs ref static
- **Limitations / notes:** Dark-first: renders on a dark surface by default. Type is large (23px) but set at weight 300 on negative tracking, so it reads quiet rather than loud - it needs a typeface with a usable light weight. The only navbar in the library with an in-bar light/dark switch: it does NOT own the theme, it renders the `theme` it is given and reports the requested value through `onThemeChange`, so the host stays the single source of truth. Phone menu is a narrow 300px drawer sliding from the trailing edge rather than a full-bleed overlay.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS WITH OBSERVATIONS

#### `pill-chip-split-ticker` — Pill-Chip Split Rail with Centre Announcement

- **Reference:** Instrument (https://www.instrument.com/)
- **Captures:** `evidence/instrument/` (reference) and `evidence/instrument/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `normal`
- **Limitations / notes:** Navigation renders as pill chips, not plain links. `items` split at their midpoint into a left and a right cluster (odd counts give the extra item to the left so the centre stays centred); `cta` joins the right cluster as a filled chip; `secondaryAction` becomes the centred announcement line. Combines two scroll responses: transparent-to-solid AND hide-on-scroll. Needs at least 4 items to read as split - below that use a split layout. ADDITION: the reference carries no brand mark in the rail at all; one is rendered below 1024px so the collapsed bar is not anonymous.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS

#### `shrink-container-commerce` — Shrinking Contained Rail

- **Reference:** Bonhomme (https://bonhomme.fr/)
- **Captures:** `evidence/bonhomme/` (reference) and `evidence/bonhomme/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `commerceWide`
- **Measurement skips** (probe mis-measures this reference, mobile only): startGutter, endGutter
  - At 390px the two sides' leading elements are different controls, so the gutter figures are not comparable. The reference centres an IMAGE mark at x=124, which the probe's brand heuristic selects because it is image-bearing and sits inside the leading third; the reconstruction's mark is a text wordmark at the same centred position, so the heuristic falls back to the leftmost control - the menu button at x=16. Both lay out identically (menu button leading, mark centred, cart trailing). Heights at all four viewports remain enforced and match.
- **Known differences (non-blocking):**
  - position sticky vs ref absolute
  - end gutter Δ16.0px
  - height 125.0 vs ref 130.0 (Δ5.0px)
  - position sticky vs ref absolute
  - end gutter Δ16.0px
  - position sticky vs ref absolute
  - end gutter Δ17.1px
  - position sticky vs ref absolute
- **Limitations / notes:** The only rail in the library that SHRINKS on scroll: bar, mark and wordmark all reduce together (104px to 91px, 0.15s linear), which suits a catalogue page where the bar must stay present but stop dominating. It is also the only one carrying a solid surface at rest rather than sitting transparent over content, and it holds its contents in a 1220px max-width container rather than running to the viewport edges - so it pairs with contained page layouts, not full-bleed heroes. Items sit flush with internal padding rather than a gap, and the row is allowed to wrap, which is why the reference is TALLER at 1024 (130px) than at 1440 (104px). `utilities` render as labelled text controls with an optional count rather than icons.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS WITH OBSERVATIONS

#### `stacked-column-micro` — Stacked-Column Micro Nav

- **Reference:** Zajno (https://zajno.com/)
- **Captures:** `evidence/zajno/` (reference) and `evidence/zajno/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `normal`
- **Measurement skips** (probe mis-measures this reference, tablet + mobile only): endGutter, startGutter
  - At tablet and mobile the reference header expands to wrap unrelated page content (148px tall at 390 with position:relative), so its container box is not the nav bar and its gutters are not comparable. Desktop and laptop gutters remain enforced.
- **Declared deviations:**
  - end gutter Δ25.2px [declared: Downstream of the declared type floor: at 1024 the reference renders 8.5px labels while this reconstruction renders 11px, so the trailing column is ~25px wider and the trailing gutter is correspondingly narrower. The column PLACEMENT (50.5% / 67% tracks) matches; only the label width differs.]
  - link font-size 11px vs ref 8.53299px (Δ2.5) [declared: Reference type is 0.833vw with no floor: 8.5px at 1024, 6.4px at 768 and 3.25px at 390. The fluid ramp is kept but floored at 11px (13px below 700px) so arbitrary generated labels stay legible.]
  - height 41.3 vs ref 24.0 (Δ17.3px) [declared: Height follows from the type floor: the reference bar is 24px at 768 and its columns render at 3.25px. Below 700px this reconstruction collapses the columns into a single disclosure stack with a tappable control, which the reference does not provide at all.]
  - link font-size 11px vs ref 6.39974px (Δ4.6) [declared: Reference type is 0.833vw with no floor: 8.5px at 1024, 6.4px at 768 and 3.25px at 390. The fluid ramp is kept but floored at 11px (13px below 700px) so arbitrary generated labels stay legible.]
  - height 26.3 vs ref 147.9 (Δ121.6px) [declared: Height follows from the type floor: the reference bar is 24px at 768 and its columns render at 3.25px. Below 700px this reconstruction collapses the columns into a single disclosure stack with a tappable control, which the reference does not provide at all.]
- **Known differences (non-blocking):**
  - end gutter Δ15.0px
  - height 41.3 vs ref 32.0 (Δ9.3px)
  - position absolute vs ref relative
- **Limitations / notes:** Navigation is stacked into vertical columns rather than laid out as a row, so the bar is only a few lines tall. The bar is absolute, not fixed: it scrolls away with the page, which suits sites with a strong hero. Children continue the stack indented rather than opening a panel, since a floating dropdown would be out of scale at this type size. Below 700px the columns collapse into one disclosure stack. DEVIATION: the reference type is 0.833vw, reaching 6.4px at 768 and 3.2px at 390; the fluid ramp is kept but floored at 11px.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS WITH OBSERVATIONS

#### `sticky-rail-blur-overlay` — Sticky Rail, Oversized Mark, Frosted Overlay

- **Reference:** AREA 17 (https://area17.com/)
- **Captures:** `evidence/area17/` (reference) and `evidence/area17/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `normal`
- **Measurement skips** (probe mis-measures this reference): startGutter
  - The probe's brand heuristic picks the leftmost interactive element inside the measured <header>, but AREA 17's brand mark is an oversized graphic that overflows the rail and is not among the header's interactive children. The probe therefore reports the first NAV LINK (x=942 at 1440) as the brand. evidence/area17/desktop-initial.png shows the actual mark at x=16, which is what the reconstruction renders.
- **Limitations / notes:** Brand mark is intentionally larger than the 64px rail and overflows below it. Below 1000px the links are replaced by a frosted full-viewport overlay (blur(30px), 0.5s opacity fade, staggered links). Unlike the reference, the scroll lock is released on close — the reference leaves body overflow hidden.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS

#### `tall-airy-dual-trigger` — Tall Airy Rail with Persistent Menu Trigger

- **Reference:** BASIC/DEPT (https://www.basicagency.com/)
- **Captures:** `evidence/basicdept/` (reference) and `evidence/basicdept/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `normal`
- **Limitations / notes:** Unusually tall (126px at 1440, stepping to 101 / 88 / 70) with an 80px gutter and links spaced a full 60px apart, so it needs generous page whitespace to read as intended. Typographic signature is uppercase on NEGATIVE tracking. The "Menu" trigger is present at every width - at desktop it sits alongside the inline links rather than replacing them, offering a second route into a fuller index. The rail hides on scroll-down but never while the menu is open.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS

#### `tall-padded-pushdown` — Tall Padded Rail with Push-Down Sheet

- **Reference:** ManvsMachine (https://mvsm.com/)
- **Captures:** `evidence/mvsm/` (reference) and `evidence/mvsm/impl/` (reconstruction)
- **Viewports tested:** 1440×900, 1024×768, 768×1024, 390×844
- **Content variants tested:** 18 fixtures × 2 viewports = 36 render conditions
- **Interactions tested:** open/close ×10 (alternating Escape and toggle), resize while open, scroll churn ×6, hover, dropdown open/close
- **Dependencies:** none beyond react
- **Assets:** none — self-contained
- **Fidelity fixture:** `withSocials`
- **Measurement skips** (probe mis-measures this reference, mobile only): height, startGutter, endGutter
  - At 390px the probe selects the reference's inner <nav class=main-nav> (374x20 at y=96) rather than the header that wraps it, because the header scores lower once its links wrap. Height and gutters at that viewport therefore describe the link row, not the bar. Desktop, laptop and tablet all measure the header and remain enforced.
- **Known differences (non-blocking):**
  - position fixed vs ref relative
- **Limitations / notes:** Height comes from vertical padding (48px above and below a 28px row) rather than a set height, so the rail breathes with its type and needs page whitespace to match. Gutters are symmetric with the padding at 54px. Socials render in the bar beside the links rather than in a footer, which is unusual and suits studios with one or two channels - more than three will crowd the row. The menu is parked above the viewport and pushes down into it, links trailing in from above. Shares a tall silhouette with tall-airy-dual-trigger but differs in composition (no centre link row, no persistent desktop trigger), type (mixed-case 20px vs uppercase 14px) and reveal direction.
- **Build status:** included in the production build (`npm run build`)
- **Runtime status:** no page errors across all render conditions
- **Certification:** PASS WITH OBSERVATIONS

## References not reconstructed

These are recorded rather than worked around. No component claims a reference it could not measure.

| reference | url | state | detail |
| --- | --- | --- | --- |
| Antinomy Studio | https://antinomy.studio/ | USABLE | 56px fixed, 5 interactive, 4/4 viewports |
| Code and Theory | https://codeandtheory.com/ | USABLE | 71px fixed, 6 interactive, 4/4 viewports |
| Dogstudio | https://dogstudio.co/ | USABLE | 129px absolute, 2 interactive, 4/4 viewports |
| Fantasy | https://fantasy.co/ | USABLE | 108px fixed, 2 interactive, 4/4 viewports |
| Griflan Design | https://griflan.com/ | USABLE | 36px fixed, 10 interactive, 4/4 viewports |
| Jam3 | https://www.jam3.com/ | USABLE | 100px absolute, 7 interactive, 4/4 viewports |
| Koto | https://koto.studio/ | USABLE | 48px static, 6 interactive, 4/4 viewports |
| Lusion | https://lusion.co/ | USABLE | 146px fixed, 10 interactive, 4/4 viewports |
| Makemepulse | https://makemepulse.com/ | USABLE | 88px fixed, 8 interactive, 4/4 viewports |
| MamboMambo | https://mambomambo.ca/ | USABLE | 75px fixed, 5 interactive, 4/4 viewports |
| Media.Monks | https://www.monks.com/ | USABLE | 100px absolute, 7 interactive, 4/4 viewports |
| Readymag | https://readymag.com/ | USABLE | 72px absolute, 9 interactive, 4/4 viewports |
| Rejouice | https://www.rejouice.com/ | USABLE | 62px fixed, 7 interactive, 4/4 viewports |
| Ueno | https://ueno.co/ | USABLE | 86px absolute, 6 interactive, 4/4 viewports |
| Uncommon | https://www.uncommon.london/ | USABLE | 90px relative, 1 interactive, 4/4 viewports |
| Active Theory | https://activetheory.net/ | NAV-WEAK | container found (244px static) but 0 interactive children detected |
| AKQA | https://www.akqa.com/ | NAV-WEAK | container found (100px static) but 0 interactive children detected |
| B-Reel | https://www.b-reel.com/ | NAV-WEAK | container found (104px fixed) but 0 interactive children detected |
| Build in Amsterdam | https://www.buildinamsterdam.com/ | NAV-WEAK | container found (73px relative) but 0 interactive children detected |
| Garden Eight | https://garden-eight.com/ | NAV-WEAK | container found (60px absolute) but 0 interactive children detected |
| Hello Monday | https://hellomonday.com/ | NAV-WEAK | container found (101px absolute) but 0 interactive children detected |
| Caffe Design | https://caffe.design/ | NAV-NOT-FOUND | page loaded (HTTP 200) but no navbar candidate scored above threshold |
| Immersive Garden | https://immersive-g.com/ | NAV-NOT-FOUND | page loaded (HTTP 200) but no navbar candidate scored above threshold |
| Resn | https://resn.co.nz/ | NAV-NOT-FOUND | page loaded (HTTP 200) but no navbar candidate scored above threshold |
| AQuest | https://www.aquest.it/ | BLOCKED | HTTP 403 |
| Awwwards | https://www.awwwards.com/ | BLOCKED | HTTP 502 |
| OFF+BRAND | https://offbrand.agency/ | BLOCKED | HTTP 502 |
| Spring I/O | https://springio.net/ | BLOCKED | HTTP 502 |
| Vogue Adria | https://vogueadria.com/ | BLOCKED | HTTP 403 |
| Bruno Simon | https://bruno-simon.com/ | ERROR | page.screenshot: Timeout 30000ms exceeded. Call log: [2m - taking page screenshot[22m [2m - waiting for fonts to load...[22m [2m - fonts loaded[22m  |
| Locomotive FUNCTION | https://function.locomotive.ca/ | ERROR | page.goto: net::ERR_TUNNEL_CONNECTION_FAILED at https://function.locomotive.ca/ Call log: [2m - navigating to "https://function.locomotive.ca/", waiting until  |
| Unseen Studio | https://unseen.co/ | ERROR | page.screenshot: Timeout 30000ms exceeded. Call log: [2m - taking page screenshot[22m [2m - waiting for fonts to load...[22m [2m - fonts loaded[22m  |

## Duplicate detection

Components sharing a structural trait, and what actually separates them.

- **split-center / dropdown / static** — `blend-difference-trizone`, `chunky-pill-emblem`, `colorflood-word-toggle`, `inset-blend-giant-mark`
  - `blend-difference-trizone`: compact density, motion 2, mobile overlay-fullscreen, comfortable 2–6 items
  - `chunky-pill-emblem`: balanced density, motion 3, mobile overlay-fullscreen, comfortable 0–4 items
  - `colorflood-word-toggle`: airy density, motion 3, mobile overlay-fullscreen, comfortable 2–5 items
  - `inset-blend-giant-mark`: airy density, motion 2, mobile overlay-fullscreen, comfortable 2–5 items
- **split / dropdown / static** — `fluid-clamp-inline`, `inset-rail-text-roll`, `justified-row-blend`, `tall-padded-pushdown`
  - `fluid-clamp-inline`: airy density, motion 1, mobile inline, comfortable 2–5 items
  - `inset-rail-text-roll`: compact density, motion 3, mobile inline, comfortable 2–5 items
  - `justified-row-blend`: airy density, motion 2, mobile overlay-fullscreen, comfortable 3–6 items
  - `tall-padded-pushdown`: airy density, motion 3, mobile overlay-fullscreen, comfortable 2–5 items
- **split / dropdown / hide-on-scroll** — `fluid-rail-pill`, `lightweight-type-theme-switch`
  - `fluid-rail-pill`: airy density, motion 3, mobile drawer, comfortable 2–6 items
  - `lightweight-type-theme-switch`: balanced density, motion 2, mobile drawer, comfortable 2–6 items

### References judged materially similar, and not shipped

- **Rejouice (https://www.rejouice.com/)** — duplicates `blend-difference-trizone`
  - Shared: Fixed full-bleed rail with mix-blend-mode: difference and no background of its own; three-zone composition (mark hard-left, link cluster set off-centre at ~51% of the width, single action hard-right); no scroll response; 14px links on slightly negative tracking; symmetric 40px gutters.
  - Differs: The rail is 62px rather than 40px, and the brand slot holds a 440px-wide lockup (mark plus descriptor line) rather than a mark alone. The CTA carries an arrow glyph on both sides.
  - Verdict: Not shipped as a separate component. Both differences are reachable through the existing contract: a longer brand.name renders the descriptor lockup, and cta.icon supplies the arrow. Shipping it would add a second difference-blend tri-zone rail distinguished only by 22px of height.
- **Jam3 (https://www.jam3.com/)** — duplicates `(same site as) Media.Monks — https://www.monks.com/`
  - Shared: jam3.com issues a redirect to www.monks.com and serves the Media.Monks site, page title 'Monks'. Jam3 was absorbed into Media.Monks, so two entries in the 50-site reference list resolve to a single live site and a single navbar.
  - Differs: Nothing — it is the same document, not a similar design.
  - Verdict: Not a duplicate design judgement but a redirect: the reference list effectively contains 49 distinct sites, not 50. Any reconstruction of 'Jam3' would in fact be a reconstruction of Media.Monks.

Components using `mix-blend-mode: difference` (a shared technique, not a shared design):

- `blend-difference-trizone` — Blend-Difference Tri-Zone Monospace Rail
- `colorflood-word-toggle` — Colour-Flood Menu with Word Toggle
- `inset-blend-giant-mark` — Inset Blend Rail with Oversized Wordmark
- `justified-row-blend` — Justified Link Row on a Blend Rail
