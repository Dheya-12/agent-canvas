# Navbar library — certification matrix

Generated 2026-09-21T08:37:53Z from `reports/certification.json`.

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
| `blend-difference-trizone` | Studio Freight | NOT RUN | | | | | | | |
| `centered-wordmark-commerce` | House of Spoils | NOT RUN | | | | | | | |
| `chunky-pill-emblem` | Lando Norris | PASS WITH OBSERVATIONS | 83px | 59px | 56px | 78px | static | 10/10 | 0 |
| `colorflood-word-toggle` | Locomotive | NOT RUN | | | | | | | |
| `fluid-rail-pill` | Cuberto | NOT RUN | | | | | | | |
| `inset-blend-giant-mark` | Obys | NOT RUN | | | | | | | |
| `inset-rail-text-roll` | Merci-Michel | NOT RUN | | | | | | | |
| `lightweight-type-theme-switch` | Stink Studios | NOT RUN | | | | | | | |
| `pill-chip-split-ticker` | Instrument | NOT RUN | | | | | | | |
| `stacked-column-micro` | Zajno | NOT RUN | | | | | | | |
| `sticky-rail-blur-overlay` | AREA 17 | NOT RUN | | | | | | | |
| `tall-airy-dual-trigger` | BASIC/DEPT | NOT RUN | | | | | | | |
| `tall-padded-pushdown` | ManvsMachine | NOT RUN | | | | | | | |

### Evidence per component

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

## References not reconstructed

These are recorded rather than worked around. No component claims a reference it could not measure.

| reference | url | state | detail |
| --- | --- | --- | --- |
| Antinomy Studio | https://antinomy.studio/ | USABLE | 56px fixed, 5 interactive, 4/4 viewports |
| Bakken & Baeck | https://bakkenbaeck.com/ | USABLE | 48px fixed, 7 interactive, 4/4 viewports |
| Bonhomme | https://bonhomme.fr/ | USABLE | 104px absolute, 8 interactive, 4/4 viewports |
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
| North Kingdom | https://www.northkingdom.com/ | USABLE | 80px fixed, 5 interactive, 4/4 viewports |
| OFFF Barcelona | https://www.offf.barcelona/ | USABLE | 167px fixed, 7 interactive, 4/4 viewports |
| Readymag | https://readymag.com/ | USABLE | 72px absolute, 9 interactive, 4/4 viewports |
| Rejouice | https://www.rejouice.com/ | USABLE | 62px fixed, 7 interactive, 4/4 viewports |
| Studio Dumbar | https://studiodumbar.com/ | USABLE | 67px fixed, 6 interactive, 3/4 viewports |
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
- **split / dropdown / hide-on-scroll** — `fluid-rail-pill`, `lightweight-type-theme-switch`
  - `fluid-rail-pill`: airy density, motion 3, mobile drawer, comfortable 2–6 items
  - `lightweight-type-theme-switch`: balanced density, motion 2, mobile drawer, comfortable 2–6 items
- **split / dropdown / static** — `inset-rail-text-roll`, `tall-padded-pushdown`
  - `inset-rail-text-roll`: compact density, motion 3, mobile inline, comfortable 2–5 items
  - `tall-padded-pushdown`: airy density, motion 3, mobile overlay-fullscreen, comfortable 2–5 items

### References judged materially similar, and not shipped

- **Rejouice (https://www.rejouice.com/)** — duplicates `blend-difference-trizone`
  - Shared: Fixed full-bleed rail with mix-blend-mode: difference and no background of its own; three-zone composition (mark hard-left, link cluster set off-centre at ~51% of the width, single action hard-right); no scroll response; 14px links on slightly negative tracking; symmetric 40px gutters.
  - Differs: The rail is 62px rather than 40px, and the brand slot holds a 440px-wide lockup (mark plus descriptor line) rather than a mark alone. The CTA carries an arrow glyph on both sides.
  - Verdict: Not shipped as a separate component. Both differences are reachable through the existing contract: a longer brand.name renders the descriptor lockup, and cta.icon supplies the arrow. Shipping it would add a second difference-blend tri-zone rail distinguished only by 22px of height.

Components using `mix-blend-mode: difference` (a shared technique, not a shared design):

- `blend-difference-trizone` — Blend-Difference Tri-Zone Monospace Rail
- `colorflood-word-toggle` — Colour-Flood Menu with Word Toggle
- `inset-blend-giant-mark` — Inset Blend Rail with Oversized Wordmark
