# A Cultura do Hambúrguer — Site

Premium, mobile-first digital menu experience for A Cultura do Hambúrguer (Bairro Alto, Lisboa), built around
the supplied 3D burger video as the hero. Plain HTML/CSS/JS, no build step, no dependencies beyond GSAP +
ScrollTrigger and Supabase-js (all CDN). See `/Users/up/.claude/plans/agora-podes-comecar-a-generic-gem.md`
for the original implementation plan (predates the Supabase/reservations/staff work below).

Real business data (menu, photos, brand color, Facebook, WiFi, press mentions) was verified against the
client's own printed menu and legacy site — see `research/legacy-site/FINDINGS.md` (gitignored, research-only).

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. A build step is not required or used.

To test the NFC per-table flow, append a query param, e.g. `http://localhost:8000/?t=07`.

## What's built

- **Public site** (`index.html`): hero video, signature burgers, full real menu (18 categories/66 items,
  i18n PT/EN/ES), "Meu Pedido" shortlist, restaurant info + photo gallery, **reservation form**, reviews
  (time-gated), footer.
- **Reservations** (`#reservations`, `js/reservations.js`): public form, inserts into Supabase `reservations`
  table.
- **Meu Pedido submission** (`js/my-order.js`): beyond the original local-only shortlist, it can now also be
  submitted (table number + notes) to the Supabase `table_orders` table for staff to see live.
- **Staff dashboard** (`staff/`): password-protected (Supabase Auth) view for staff/owner to see and manage
  reservations and table orders in real time, plus owner-only staff account management. See
  `supabase/schema.sql` for the schema and the one-time manual setup step at the bottom of that file.
- **Analytics** (`js/analytics.js`): still a **local-only stub** (buffers to memory + `console.debug`, no
  network calls) even though `supabase/schema.sql` already provisions an `analytics_events` table for it —
  wiring `track()` to actually insert into Supabase is a small follow-up, not yet done.

## Open items — real data still needed from the restaurant

1. **Allergen data** — the `allergens` field exists on every item in `js/data/menu-data.js` (currently `null`
   for all 66 items) and the Menu section shows a general "to confirm" note. Fill in real values per item
   (e.g. `allergens: ["gluten", "lactose"]`) once the restaurant provides them.
2. **Google Place ID** — not supplied, so both the "Ver no Google Maps" and "Avaliar no Google Maps" links in
   `js/config.js` (`GOOGLE_MAPS_URL`, `GOOGLE_REVIEW_URL`) point to the same real Maps search by name+address.
   A confirmed Place ID would allow a direct "write a review" deep link.
3. **Table numbers / NFC-tag & QR provisioning** — `js/table-session.js` reads `?t=<id>` from the URL and
   works with any value today. The actual list of tables, NFC tag writing, and per-table QR code generation
   is a deployment-time step, not a code change.
4. **Reviews reveal delay** — defaults to 5 minutes (`REVIEWS_DELAY_MINUTES` in `js/config.js`). Change that
   one constant to 10/20/30 if the restaurant wants a different delay.
5. **`assets/images/interior-wide.jpg` and `logo-mark-full.png`** — present in the repo but not wired into
   any page. `interior-wide.jpg` is a lower-quality wide interior shot, superseded by the sharper
   `atmosphere-dining-wide.jpg` now used in the `#info` photo strip. `logo-mark-full.png` is a clean full
   square badge (1400×1400, tagline legible) with no obvious slot on the current page — better suited to a
   social profile picture or print use than the site itself.

## Deferred — pending confirmation with the restaurant's owner

6. **Running `supabase/schema.sql`** in the live Supabase project and creating the owner's staff account (the
   one-time manual step documented at the bottom of that file) — holding until the business side is
   confirmed with the owner.
7. **Wiring `js/analytics.js` to the `analytics_events` Supabase table** — same reason, holds alongside the
   rest of the Supabase go-live work.

Resolved: **opening hours** (Seg-Sex 12:00–16:00/18:00–00:00, Sáb-Dom 12:00–00:00 — sourced from a
Tripadvisor listing specifically matching the Atalaia address, not the restaurant's own site; confirm with
the owner if this ever looks wrong), brand color/logo (real green `#30743F`, verified against the physical
moss-wall logo/signage, not invented), Facebook URL, WiFi (published — printed on the restaurant's own
physical menu, so safe to share), Restaurant Atmosphere / Signature Burgers photography (real photos now in
use throughout `#burgers` and
`#info`), written testimonials (real press mentions — Time Out Lisboa, Nit, LisbonLux — shown in `#reviews`
alongside the 4.7★ rating).

## Architecture notes

- **No build step.** All JS files are plain global `<script defer>` tags (not ES modules), so the site works
  identically whether opened via a local server or (in most respects) directly from disk.
- **i18n**: `js/i18n/translations.js` holds PT/EN/ES marketing copy; `js/data/menu-data.js` holds the full
  real menu with per-item translations. Language switch is instant, no reload, persisted in `localStorage`.
- **Meu Pedido**: a local shortlist (`js/my-order.js`), persisted in `sessionStorage`, no total-to-pay shown
  by design (to avoid reading as a checkout/bill). It can optionally be submitted (table number + notes) to
  the Supabase `table_orders` table so staff see it live — still not a payment/checkout flow.
- **Analytics**: `js/analytics.js` is a local-only stub (buffers to memory + `console.debug`, no network
  calls). See the comment at the top of that file for the documented future integration point
  (`navigator.sendBeacon`).
- **Hero video loop**: the supplied clip does not return to its starting frame within its own duration (it's
  a one-way "explosion," not a boomerang) — confirmed by direct frame inspection during development. Rather
  than showing a hard jump-cut on loop, `js/animations.js` runs two phase-offset copies of the same video and
  crossfades between them right before each one's own loop point, so the seam is masked instead of visible.
  The second video element only requests the source file after the first has fully buffered, so this does not
  double the network transfer in practice.
- **Mobile hero, small phones**: the video is a 9:16 portrait clip kept intentionally large (per "don't shrink
  the burgers" direction), so on the smallest phones (e.g. iPhone SE, 375×667) reaching the "Ver Cardápio" CTA
  needs a short scroll (roughly one thumb-swipe). On modern phones (iPhone 12 and newer, most Android) the CTA
  sits within the first screen. The hero copy is ordered headline → CTA → tagline specifically to keep the CTA
  as close to the top as possible without shrinking the video.
