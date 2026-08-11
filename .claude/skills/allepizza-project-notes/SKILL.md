---
name: allepizza-project-notes
description: >
  Reference notes for the AllePizza static site project (a pizzeria in Gorzów
  Wielkopolski, at D:\PROGRAMOWANIE\JAVASCRIPT\PROJEKTY\AllePizza) — architecture,
  design-system values, content already sourced from allepizza.pl, and several
  hard-won gotchas from building it. Load this whenever working anywhere in the
  AllePizza project directory, or on any AllePizza page/CSS/JS/image/menu content,
  even if the user doesn't ask for it by name — it saves you from re-deriving the
  color palette hex values, re-scraping the pizzeria's menu/contact info, or
  re-discovering why the pizza-card photo overflow architecture and the Browser
  pane's HTML caching behave the way they do. Especially check this before editing
  `.pizza-card` / `css/menu.css`, before adding new images, before testing anything
  in the Browser pane on this project, or before creating a second repo/skill for
  the same site.
---

# AllePizza project notes

This is a separate project from **Sou!Fresh** (a different client, different repo,
different conventions) — don't reuse Sou!Fresh's build.py/partials architecture
here, it was a deliberate choice not to.

## What this project is

A static multi-page marketing/ordering site for **Alle Pizza**, a pizzeria in
Gorzów Wielkopolski. It's a from-scratch redesign: content (menu, prices, contact
info) was sourced from the client's existing site (`allepizza.pl`), and the visual
design was inspired by a Pinterest reference ("Pizza.Mizza" UI concept — dark
header, orange accents, circular product photos, category tabs). The original
site's actual brand color is a deep red (`#941313`, sampled from its logo), which
is why this redesign ended up on a red/maroon + burnt-orange palette rather than
the blue-navy the project started with.

Repo: private GitHub repo at `github.com/pilarskyy/AllePizza` (pushed via `gh repo
create --private --source=. --remote=origin --push`).

## Architecture — no build step, on purpose

Unlike Sou!Fresh, this is **plain HTML/CSS/JS with zero build tooling** — a
deliberate choice (asked and confirmed with the user) since this is a smaller,
newer project. That means:

- 4 real pages at the repo root: `index.html` (Start), `menu.html`, `catering.html`,
  `kontakt.html`. No clean-URL rewriting/.htaccess has been set up yet for this
  project (unlike Sou!Fresh) — if deployment/routing comes up, that's still open.
- **Header and footer markup is hand-duplicated across all 4 HTML files** — there
  is no template/partial system. Any header or footer change (nav links, logo,
  contact info, social links) needs to be applied **8 times** (header + footer ×
  4 pages). When doing this, script it (Python regex over `glob.glob('*.html')`)
  rather than editing each file by hand — that's what was done for every past
  header/footer change in this project and it's much less error-prone than manual
  edits × 8.
- CSS is split by concern, all loaded on every page (same "simpler than curating"
  reasoning as Sou!Fresh): `base.css` (reset + design tokens + buttons + skip
  link), `header-nav.css`, `footer.css`, plus one file per page
  (`home.css`/`menu.css`/`catering.css`/`kontakt.css`).
- `js/script.js` is one file, `DOMContentLoaded`, numbered comment sections —
  mobile nav toggle, sticky header shadow, menu category tabs, pizza filter chips,
  allergen tooltip toggling, footer year.
- Font Awesome is loaded from the **cdnjs CDN** (`font-awesome/6.5.2/css/all.min.css`),
  not self-hosted like Sou!Fresh. Any icon class from the free tier works, no
  hand-subsetting to worry about.
- Google Font "Baloo 2" loaded normally via `<link>` (headings/logo only; body
  text uses the system font stack).
- Dev server: `.claude/launch.json` runs `python -m http.server 8097` — **port
  8097**, not Sou!Fresh's 8090 (chosen specifically to avoid colliding with a
  Sou!Fresh dev server running at the same time).

## Design system (`css/base.css` `:root`)

The palette went through a full revision mid-project (navy-blue → red/maroon) at
the user's request to match the original site's actual branding. Current values:

| Variable | Value | Used for |
|---|---|---|
| `--navy` | `#3d0f0f` | header/footer/hero background (deep maroon, not literally navy blue anymore — name kept for minimal diff) |
| `--navy-light` | `#5c1717` | gradient lighter stop |
| `--orange` | `#c2440a` | primary CTA/button background, accents |
| `--orange-dark` | `#8f3006` | hover states, text-on-white (eyebrows, links, prices) |
| `--cream` | `#fff3ea` | alternating section backgrounds |
| `--text` | `#2b1a14` | body text |
| `--text-muted` | `#7a6a60` | secondary text |
| `--border` | `#f0e2d6` | card borders |

`--orange` and `--orange-dark` were specifically chosen (not just "a nice orange")
to clear WCAG AA contrast (~5:1 and ~8:1 respectively) against white for button
text and link text — don't casually swap in a brighter/lighter orange without
re-checking contrast, the first draft orange (`#ff7a30`) failed this check.

Semantic tag-badge colors (`.tag--ostra` red, `.tag--nowosc` blue, `.tag--wege`
green, `.tag--bianca` beige) are intentionally **off-palette** — they're meant to
read as distinct status chips against the red/orange brand colors, not to match
them. Leave them as-is.

## Content already sourced (don't re-scrape)

Full contact/business facts, pulled from `allepizza.pl` early in the project:

- Hours: 11:00–23:00, every day.
- Phones: `95 735 22 11` and `666 811 237`. Email: `biuro@allepizza.pl`.
- Delivery: free within Gorzów Wlkp. on orders ≥ 17 zł.
- Promo: Mon–Fri until 14:00, -10% on the whole order.
- "~15 lat w Gorzowie" (in business ~15 years) is used as a trust signal in copy.
- Online ordering: `https://allepizza.papu.io/` (all "Zamów"/"Zamów online" CTAs
  point here). Also listed: Facebook
  (`facebook.com/pages/ALLE-Pizza/259133014165395`), Pyszne.pl
  (`pyszne.pl/alle-pizza-gorzow-wielkopolski`), PizzaPortal.pl.
- No physical address is published anywhere on the original site (delivery/pickup
  only) — don't invent one.

**Menu**: all 55 pizzas (name, ingredients, allergens, 32cm/45cm prices), plus
przekąski (panini/skrzydełka/nuggetsy/zestaw dziecięcy/frytki), napoje, and the
dodatki price table are already fully built into `menu.html`. If prices or the
menu ever need updating again, the generation approach that worked well: write a
small Python list-of-tuples data table (name, ingredients, allergen numbers,
price32, price45, tags) and generate the repetitive card HTML with a script rather
than hand-editing 55 near-identical blocks — see the git history for the exact
pattern (`gen_pizzas.py`-style generator) if this needs to happen again.

**Copyright practice used**: original site copy was paraphrased in this redesign's
own words; only purely factual data (prices, ingredient lists, allergen numbers,
hours, contact details) was carried over verbatim, since that's not creative
expression and — especially for allergens — accuracy matters more than novelty.
Keep following this pattern for any future content sourced from the original site
or elsewhere.

**Allergen tag convention**: each `.pizza-card` has `data-tags="..."` with a
space-separated subset of `wege ostra bianca nowosc` (or `wszystkie` if none
apply) — this drives the JS filter chips on the menu page. When adding a new
pizza, tag it based on the same source markers the original site used: "(ostra)"
→ `ostra`, "PIZZA BIANCA" → `bianca`, "NOWOŚĆ" → `nowosc`, no meat/fish/seafood
ingredients → `wege`.

## Component gotcha: pizza-card photo + allergen tooltip (read before touching either)

This is the single most fragile part of the CSS and it's not obvious from reading
`.pizza-card` in isolation, so it's worth understanding **why** it's structured
this way before changing it.

`.pizza-card` does **not** have `overflow: hidden`, even though the product photo
(`.pizza-card__photo`) bleeds off the card's top-right corner and needs to be
clipped so it never pokes past the rounded tile edge. Clipping is instead done by
a **dedicated wrapper**, `.pizza-card__photo-mask` (`position:absolute; inset:0;
overflow:hidden; border-radius: var(--radius-md);`), that wraps *only* the
`<picture>` element.

The reason: the allergen line (`.pizza-card__allergens-wrap` →
`.allergen-trigger` button → `.allergen-tooltip` popup) needs to pop **outside**
the card's box on hover/tap (it renders above the trigger, and can extend past the
card's own bottom-right/top edges). If `.pizza-card` itself had
`overflow:hidden`, the tooltip would get silently clipped/invisible the moment it
tried to escape the card — this was an actual bug found and fixed mid-project.
**If you ever need to clip something else on the card, clip it in its own mask
wrapper — do not add `overflow:hidden` back onto `.pizza-card` itself**, or the
tooltip breaks again.

The photo itself: sized `14rem × 14rem`, positioned `top:-7rem; right:-7rem`
(exactly half its own size, both axes) so almost exactly half the circle shows,
clipped at the card edge. `.pizza-card__top` reserves `min-height: 6.5rem;
padding-right: 8.5rem;` so the name/ingredients text never overlaps it — this
went through several redesigns (icon → small photo → huge photo behind text with
a fade scrim → back to this reserved-space version, which is what the user
preferred) before landing here. If asked to resize the photo again, keep the
`top`/`right` offset equal to exactly half the new width/height to preserve the
"half visible, clipped at the corner" look, and bump `min-height`/`padding-right`
on `.pizza-card__top` proportionally (roughly offset + 1.5rem) so text clearance
is preserved.

**Allergen tooltip**: hover/focus-visible on desktop (pure CSS, via
`:hover`/`:focus-within`), tap-to-toggle on mobile (JS adds `.is-open`, see
"06. ALLERGEN TOOLTIPS" in `script.js`; closes on outside click, Escape, or
opening a different one). The tooltip is **horizontally centered** on its trigger
(`left:50%; transform:translateX(-50%)`) with `width: min(16rem, calc(100vw -
2.5rem))` — this was also a fixed bug: an earlier `left:0` version caused the
tooltip to overflow off-screen for cards in the rightmost grid column. Don't
revert to left-anchored positioning.

The "Pizza pół na pół" card is a deliberate exception — its allergens depend on
which two halves the customer picks, so it keeps the old plain
`<p class="pizza-card__allergens">` (no button/tooltip) instead of the interactive
version. If you regenerate allergen markup from the raw `Alergeny: N,N,N` text,
make sure your regex only matches numeric allergen lists and leaves this one
alone.

## Mobile call bar

On ≤640px viewports, `.header__strip` (the top hours/delivery/phone strip) is
hidden and replaced by `.mobile-callbar`, a `position:fixed; bottom:0;` bar with a
tap-to-call button and hours, added specifically because the enlarged logo (see
below) left less room up top on phones. `body` gets `padding-bottom: 4.5rem` on
mobile so the fixed bar doesn't cover the last bit of page content. Both rules
live in `css/header-nav.css` under `@media (max-width: 640px)`.

## Images

- `img/logo.webp` (241×149, real alpha transparency) — cropped/optimized from a
  user-supplied `img/logo.png`, the pizzeria's actual hand-drawn brush-script logo
  ("Alle! Pizza — PIZZA NA TELEFON"). It reads white-on-dark, which is why it
  works directly on the maroon header/footer with no extra background box needed.
  Displayed via CSS at `height: 4.5rem` with `margin-block: -0.85rem` (deliberately
  allowed to overflow the header bar slightly — the user explicitly asked for
  this after the first, smaller version wasn't legible enough).
- `img/pizza-photo-desktop.webp` (360×360) and `img/pizza-photo-mobile.webp`
  (220×220) — the **same generic pepperoni-pizza cutout photo**, reused on all 55
  pizza cards via a `<picture>`/`<source media>` swap (not per-pizza photos; there
  was only ever one usable source photo). If real per-pizza photography ever
  becomes available, this is the pair of files (and the `<picture>` markup
  repeated 55× in `menu.html`) that would need replacing.
  - Extraction gotcha, if this happens again: a user-supplied "photo" turned out
    to be a **ZIP archive with a `.png` extension** containing a flattened `.jpg`
    preview (checkerboard baked into the pixels, not real transparency) and the
    real layered `.psd`. Pillow's default `Image.open()` on a `.psd` only returns
    the flattened composite (same checkerboard problem) — getting the actual
    transparent layer required `pip install psd-tools` and
    `PSDImage.open(path)` → iterate `.composite()` per layer to find the one with
    real alpha.
- `img/8dafee05-2af4-4243-8791-4090fd5d2c8d.psd` (~50MB Photoshop source) is
  **intentionally gitignored** (`*.psd` in `.gitignore`, along with `*.ai`) — it's
  on disk locally but was never pushed to GitHub, to keep the repo light. Don't
  `git add -f` it without checking with the user first.
- **Unused assets currently sitting in `img/`**: `frytki.webp`, `nugets.webp`,
  `pyszny-meksykanski-kurczak-bez-kosci.png`, `zestaw dziecięcy.png` — none of
  these are referenced anywhere in the HTML yet (confirmed by grep). They weren't
  added by this skill's authoring session; they showed up between turns, most
  likely dropped in by the user (or a concurrent Claude Code session working in
  the same folder — this has happened more than once on this project, see below).
  They're plausibly meant to eventually replace the Font Awesome icons currently
  used for Panini/Skrzydełka/Frytki/Nuggetsy on the przekąski tab, the same way
  `pizza-photo-*.webp` replaced the pizza icons — worth asking the user before
  assuming that's the intent, but it's the obvious next step if asked to "add
  photos to the snacks too."

## Working in the Browser pane on this project

- **Screenshots fail or go stale intermittently** (`"Browser pane is not
  displayed"`, or a visually blank/wrong frame despite the DOM being correct).
  This happened repeatedly and was never this project's code being wrong —
  cross-check with `javascript_tool` (`getComputedStyle`, `getBoundingClientRect`,
  `querySelector` existence) before concluding a visual change didn't work.
  Retrying the screenshot, or opening a **fresh tab** (`tabs_create` +
  `navigate`), usually resolves it.
- **The Browser pane can serve genuinely stale cached HTML, even in a brand-new
  tab**, after editing an `.html` file directly on disk. Confirmed directly: added
  a new `<div class="mobile-callbar">`, verified via `curl` that the running dev
  server was serving the updated file correctly, yet `document.querySelector` in
  a fresh tab still returned `null`. Appending a cache-busting query string
  (`?bust=1`) to the URL on `navigate` immediately picked up the real content.
  **If a `querySelector` unexpectedly returns null right after an HTML edit,
  cache-bust before assuming the edit is wrong.**
- The background dev server (`python -m http.server 8097`) does not persist
  across sessions/restarts — if `curl http://localhost:8097/...` fails, just
  restart it (`run_in_background`) rather than assuming something is broken.
- **This folder has shown signs of concurrent editing from outside this
  conversation** more than once — new files appearing in `img/` (see above),
  files being renamed/replaced between turns. Treat unexplained new files as
  probably-legitimate (don't delete without asking), and re-check current file
  state with `Glob`/`Grep` rather than trusting an in-context memory of the
  directory listing if it's been more than a few turns.
