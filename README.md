# A Cultura do Hambúrguer — Site

Premium, mobile-first digital menu experience for A Cultura do Hambúrguer (Bairro Alto, Lisboa), built around
the supplied 3D burger video as the hero. Plain HTML/CSS/JS, no build step, no dependencies beyond GSAP +
ScrollTrigger (CDN). See `/Users/up/.claude/plans/agora-podes-comecar-a-generic-gem.md` for the full implementation plan.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. A build step is not required or used.

To test the NFC per-table flow, append a query param, e.g. `http://localhost:8000/?t=07`.

## Open items — real data still needed from the restaurant

These are intentionally left as honest, clearly-marked placeholders rather than invented. Nothing here was
fabricated; fill each in with real data when available.

1. **Opening hours** — not supplied. Shown as "Horário: a confirmar" in `index.html` (`#info` section,
   `info.hoursPlaceholder` key in `js/i18n/translations.js`).
2. **Wi-Fi password** — was shared in conversation but deliberately **not published** on the public site
   (in-restaurant use only, basic security hygiene). If wanted later, prefer a printed in-store card/QR rather
   than the public page.
3. **Facebook** — no confirmed URL was supplied, so the icon/link is omitted from the footer (Instagram only).
   Marked with a `<!-- TODO -->` comment next to the social row in `index.html`.
4. **Restaurant Atmosphere photography** — no image files exist yet, only a verbal description. The `#info`
   section uses typography + a warm gradient treatment instead. Swap in real photos when available (see the
   `.info-atmosphere` block in `index.html` / `.info-section` styles in `css/main.css`).
5. **Signature Burgers / food photography** — same as above; the `#burgers` section uses typographic
   ingredient cards, not photos.
6. **Written testimonials** — only a 4.7★ Google rating was supplied, no written reviews. The `#reviews`
   section shows a minimal rating card with an outbound Google Maps link, not fabricated quotes.
7. **Allergen data** — the `allergens` field exists on every item in `js/data/menu-data.js` (currently `null`
   for all items) and the Menu section shows a general "to confirm" note. Fill in real values per item
   (e.g. `allergens: ["gluten", "lactose"]`) once the restaurant provides them.
8. **Google Place ID** — not supplied, so both the "Ver no Google Maps" and "Avaliar no Google Maps" links in
   `js/config.js` (`GOOGLE_MAPS_URL`, `GOOGLE_REVIEW_URL`) point to the same real Maps search by name+address.
   A confirmed Place ID would allow a direct "write a review" deep link.
9. ~~**Favicon / logo mark**~~ — resolved. The real restaurant seal (circular badge, "A Cultura do
   Hambúrguer — Uma Experiência com Sabor") is in use: `assets/images/logo-original.png` (source, 1536×1024),
   `assets/images/logo-mark.png` (512×512 square crop, used in nav + footer), `assets/images/favicon-64.png`
   and `assets/images/apple-touch-icon.png` (generated from the same crop). The badge's fine print isn't
   legible at nav-icon size by design — it reads as a small brand seal there, with the actual name carried
   by the adjacent text; the footer version (44px+) is where the detail is appreciable.
10. **Table numbers / NFC-tag & QR provisioning** — `js/table-session.js` reads `?t=<id>` from the URL and
    works with any value today. The actual list of tables, NFC tag writing, and per-table QR code generation
    is a deployment-time step, not a code change.
11. **Reviews reveal delay** — defaults to 5 minutes (`REVIEWS_DELAY_MINUTES` in `js/config.js`). Change that
    one constant to 10/20/30 if the restaurant wants a different delay.

## Architecture notes

- **No build step.** All JS files are plain global `<script defer>` tags (not ES modules), so the site works
  identically whether opened via a local server or (in most respects) directly from disk.
- **i18n**: `js/i18n/translations.js` holds PT/EN/ES marketing copy; `js/data/menu-data.js` holds the full
  real menu with per-item translations. Language switch is instant, no reload, persisted in `localStorage`.
- **Meu Pedido**: a local, non-transactional shortlist (`js/my-order.js`), persisted in `sessionStorage`
  only — never submitted anywhere, no total-to-pay shown by design (to avoid reading as a checkout/bill).
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
