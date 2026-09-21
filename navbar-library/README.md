# Navbar library

Reusable navigation components reconstructed from measurements of live
production websites, built to be populated with arbitrary business content by
a site generator.

Each component keeps the distinctive geometry, scale system, scroll response
and menu choreography of its reference, while carrying none of the
reference's content, branding or assets.

## How a component is produced

```
INSPECT → RECONSTRUCT → RENDER → CAPTURE → COMPARE → STRESS → FIX → RECERTIFY
```

1. `scripts/inspect.mjs` opens the live reference in Chromium and measures its
   navbar at 1440 / 1024 / 768 / 390 across initial, scrolled, deep-scroll,
   scroll-up, hover and menu-open states, writing measurements and screenshots
   to `evidence/<reference-id>/`.
2. The component is written from those numbers.
3. `scripts/compare.mjs` renders the reconstruction and re-measures it with the
   **same in-page probe**, then diffs height, position, gutters, link type
   scale and scroll response.
4. `scripts/certify.mjs` runs the content matrix, the fatigue loop and the
   damage-tolerance checks, and grades the result.

Nothing is certified from source inspection alone.

## Content contract

Every navbar consumes the same shape, so a planner can populate any of them
without knowing which it chose:

```ts
{
  brand: { name, logo?, logoAlt?, href? },
  items: [{ label, href?, children?, badge?, current? }],
  cta?: { label, href?, icon? } | null,
  secondaryAction?: { label, href?, icon? } | null,
  socials?: [{ label, href? }],
  utilities?: [{ label, href?, icon?, count? }],   // commerce rails only
  menuLabel?: { open, close },
  themeToggle?: { toLight, toDark },               // theme-switch rails only
  theme?: 'light' | 'dark',
  dir?: 'ltr' | 'rtl',
  locale?: string,
}
```

The **data interface is normalized; the design behaviour is not**. A navbar
ignores fields it has no place for — `NavbarMeta` declares which it honours —
but never breaks on their presence. `onNavigate` hands routing to the host;
`onThemeChange` reports a theme request without the navbar owning the theme.

## Selection metadata

`NavbarMeta` describes **design character, never the original company**, so a
planner can reason about fit: `layout`, `menuArchitecture`, `mobilePattern`,
`scrollBehavior`, `motionIntensity`, `density`, `themes`, `comfortableItems`,
`maxLabelChars`, `rtlSupport`, `dependencies`, `assets`, `tone`, `industries`.

```ts
import { selectNavbars, getNavbar } from './src/registry';

const options = selectNavbars({ itemCount: 4, needsCta: true, theme: 'light', maxMotion: 3 });
const { Component } = getNavbar(options[0].id)!;
```

The registry scans `src/navbars/*/`, so adding a component means adding a
folder.

## What certification means here

| status | meaning |
| --- | --- |
| PASS | no blocking diff, no structural issue, no page error, 10/10 fatigue cycles |
| PASS WITH OBSERVATIONS | as above, plus declared deviations from the reference |
| FAIL | a blocking fidelity diff, a structural issue, or a page error |

Three outcomes are kept distinct, and only the first is a measurement result:

- a **diff** — the reconstruction is wrong, and is fixed;
- a **skip** — the probe mis-measures that reference (for example it reads a
  skip link as the brand, or selects an inner `<nav>` instead of the bar).
  Recorded in `scripts/overrides.json` with the evidence that settles it;
- a **deviation** — the reconstruction differs *on purpose*, with the reason
  recorded. Two references scale type purely with viewport width and reach
  ~3px labels on a phone; the fluid ramp is kept but floored so generated
  content stays legible. A deviation never reads as a pass.

## Commands

```
npm install
npm run typecheck
npm run build
./scripts/serve.sh                  # preview on :4174, idempotent

npm test                            # regression suite (hermetic)
npm run certify                     # full certification pass
npm run test:baseline               # re-record geometry after an intended change
npm run report                      # regenerate CERTIFICATION.md
npm run gallery                     # build gallery/ then open gallery/index.html

node scripts/inspect.mjs <site-id>...          # measure live references
node scripts/compare.mjs <nav-id> <site-id>    # numeric fidelity diff
node scripts/probe-nav.mjs <site-id>...        # unfiltered DOM scan for a stubborn reference
node scripts/triage.mjs                        # reference reachability
```

## Regression suite

`npm test` is **hermetic**: it renders the built library against the local
preview and never reaches a third-party site. Fidelity against the live
references cannot be a regression test — five of them are blocked and eight
have no navbar at all — so that verification lives in `scripts/compare.mjs`
and runs separately.

Three groups, currently 529 checks:

- **geometry** — every navbar's shipped height, top offset, position, control
  count and gutters, at 3 fixtures x 4 viewports, against
  `reports/baseline.json`.
- **contract** — every navbar survives empty content, a 404 logo URL,
  40-character unbroken words, nine items, Arabic/RTL, a single item and no
  CTA, at 1440 and 390, with no page error, no collapse and no horizontal
  overflow.
- **invariants** — rules that must hold for every navbar: a navbar whose
  metadata declares a collapsing mobile pattern must expose an
  `[aria-expanded]` control at 390px, open on click, close on Escape, and
  never leave the page scroll-locked; metadata must not claim runtime
  dependencies the library does not have.

The suite is fault-injection tested: deliberately changing a bar's height and
making a scroll lock never release produces 10 failures and a non-zero exit.
That second fault initially slipped through, because the check compared body
overflow against a value sampled *after* mount — a navbar that locks from
mount looked consistent with itself. The invariant is now absolute: a closed
navbar must leave the page scrollable.

After an INTENDED geometry change, re-record with `npm run test:baseline` and
commit the updated `reports/baseline.json` alongside the change.

## Specimen gallery

`npm run build && npm run gallery` writes `gallery/` — a single page showing
every navbar running live (not screenshots) at a true 1440x200, scaled to
fit, with its certified heights and metadata beneath. One control swaps the
content of all of them at once: coffee shop, law firm, gym, long copy,
Arabic/RTL, submenus, empty. That control is the point of the library made
operable — the same data goes into every component and each keeps its own
design character.

`gallery/` is gitignored: it is derived from `dist/`, and the asset
filenames are content-hashed, so committing it would churn a new pair of
files on every rebuild.

## Reports

- `reports/CERTIFICATION.md` — certification matrix, per-component evidence,
  known differences and limitations, duplicate detection, and the references
  that could not be reconstructed.
- `reports/accessibility.json` — reachability and inspectability of all 50
  references at capture time.
- `reports/certification.json` — raw results behind the matrix.

## Scope

Components are standalone React + CSS Modules with no runtime dependency
beyond React and no asset dependencies. They are **not** wired into a
generation pipeline in this repository, because this repository does not
contain one — integration is an adapter over `src/registry.ts`.
