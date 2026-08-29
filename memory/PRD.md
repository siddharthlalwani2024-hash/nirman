# Nirman Udyog — Tile Catalogue & Lead Site

## Original Problem Statement
Premium tile showcase web app (mobile-first) that turns ad clicks into WhatsApp inquiries.
No 3D/2D preview, no cart, no prices. Homeowners/contractors land from local ads, browse on
cheap Android phones, want to see the finished room look, then message on WhatsApp.
Room is the primary nav axis (Bathroom, Kitchen, Living, Outdoor, Wall, Floor); type/size are
attributes. Admin panel built for tiles (not generic CMS): tile CRUD with drag-drop multi-image
upload, demo photo CRUD with two-way tile linking, site settings, categories, blog. WhatsApp
deep link pre-filled with tile name + SKU is the single highest-leverage detail.

## Architecture
- Frontend: React (CRA, JS — Vite/TS requested but environment is fixed to CRA) + Tailwind + Framer Motion + react-router-dom v7 + react-helmet-async for SEO
- Backend: FastAPI, routers split as auth_router / content_router / upload_router / catalogue_router
- DB: MongoDB (uuid string ids, no raw ObjectId ever returned)
- Auth: JWT via httpOnly cookies (access 60min / refresh 7d), single seeded admin, brute-force lockout (5 attempts/15min)
- Images: Emergent object storage, Pillow WebP conversion → thumb/medium/large sizes on every admin upload, served via public `/api/media/{path}`
- Colors: Navy/Ivory/Gold/Stone (brand, per master design spec, 2026-08-29 rebrand) locked exactly per user spec; Kajaria blue (#15508B) restricted to trust-strip + footer dealer badge only; WhatsApp green for WA CTAs only
- Fonts: Cormorant Garamond (headings) + Manrope (body)

## User Personas
- Homeowners/small contractors from paid ads (primary) — mobile, want finished-room photos, message on WhatsApp
- Walk-in customers checking range before visiting showroom (secondary)
- Admin (owner) — manages tiles, demo photos, site content from phone/desktop, no code changes needed

## Core Requirements (static)
- Public: Home, 6 room category pages, tile detail, gallery (filterable, lightbox), about, contact (no form), blog
- Admin: JWT login, tile CRUD + image upload/reorder/feature/publish, demo photo CRUD + two-way tile linking, category hero/description edit, site settings edit, blog CRUD
- WhatsApp deep link with pre-filled tile name + SKU on every tile CTA; sticky WhatsApp bar site-wide; click-to-call
- SEO: per-page meta/OG via Helmet, sitemap.xml, robots.txt, LocalBusiness JSON-LD
- English only, single showroom, no prices anywhere, publish/unpublish instead of stock field

## What's Been Implemented (2026-08-15)
- Full backend: models, auth (bcrypt+JWT+lockout), object storage + WebP pipeline, seed data (18 tiles, 24 demo photos, 6 categories, 3 blog posts, site settings) — idempotent on startup
- Full frontend: all public pages, full admin panel (dashboard, tiles, demo photos, settings incl. categories tab, blog), ImageUploader (drag-drop + reorder), sticky WhatsApp bar with per-tile override context
- Business info seeded: phone 9475833221, WhatsApp +919475833221, address (Cooch Behar, WB), hours Mon–Sun 9am–8pm, Authorized Kajaria Dealer badge (blue, restricted per spec)
- Tested by testing_agent: 27/27 backend pytest tests pass, all critical frontend flows verified (100%). No blocking issues.
- Admin credentials: siddharth.lalwani2024@vitstudent.ac.in / NirmanUdyog@2026 (in /app/memory/test_credentials.md)

## What's Been Implemented (2026-08-29, navbar bug fix + gallery/comparison redesign)
- FIXED navbar bug: removed the fragile scroll-based transparent-over-hero navbar state (was causing washed-out low-contrast text) — navbar is now unconditionally opaque ivory/navy on every page/scroll position.
- Navbar redesign: logo + "Nirman Udyog" wordmark (gold italic "Udyog") shown together always, new "Enquire" WhatsApp CTA button, logo nudged right with margin. No Projects/Collections/Applications added (explicitly out of scope per user).
- ComparisonBlock section recolored to Kajaria/cobalt blue bg with gold headings/labels, per user request.
- Gallery + RoomCategory "See the look" redesigned to Pinterest/Houzz-style vertical cards (max 3 cols, gap-6/8, hover lift+zoom, gold room-tag pill, gradient caption overlay). Added `src/lib/caption.js` `displayCaption()` to hide the 71 generic boilerplate "(N)"-numbered captions while preserving the 5 real bedroom captions — regex `/\(\d+\)\s*$/`. RoomCategory "TILES USED" label replaced with interactive gold tile-name chips (only shown if real linked tiles exist).
- Tested by testing_agent across 3 iterations (5 & 6): navbar fix, comparison colors, gallery/room-category redesign, caption filter all 100% verified, zero regressions, all 76 real demo photos confirmed untouched.

## What's Been Implemented (2026-08-29, full rebrand + catalogue library)
## What's Been Implemented (2026-08-29, full rebrand + catalogue library)
- Full rebrand per user's "master design spec" md doc: new tokens Navy #102A43 (brand/dark-section/primary-btn), Ivory #F5F2EC (page bg), Gold #B08A4A (accent/hover/badges), Stone #D9D5CC (borders), White (card surfaces), Ink #171A1C (body text, same token name reused with new hex — minimal-diff rename). Fonts: Cormorant Garamond (serif) + Manrope (sans), replacing Fraunces/Work Sans/IBM Plex Mono. Consolidated duplicate "cobalt" token into "kajaria" (real Kajaria-blue, restricted to TrustStrip + dealer badge only). Deliberately kept React CRA + FastAPI + Mongo stack rather than migrating to Next.js/TS (spec's suggested stack) — no user-visible benefit, high risk.
- Navbar: transparent-over-hero on homepage top, ivory+blur on scroll/other pages. Hero: staggered fade-up motion timeline, slow bg zoom, auto-rotating multi-image slideshow with dots, new bottom "Premium Surfaces · Cooch Behar & Nearby · Design-Led Collections" metadata row.
- NEW Catalogue Library feature: admin uploads a PDF (+ optional cover) tagged Ceramic/GVT/PVT/Gres via `/admin/catalogues` (PdfUploader component, `/api/admin/upload-pdf`, object-storage backed, 30MB cap) — instantly live on public `/catalogues` page + homepage preview section. Direct View+Download, NO lead-capture form (user's explicit choice). Download tracked via `download_count`.
- Footer: new 5-column layout with "Resources" column (Catalogues/Gallery/Journal).
- Tested by testing_agent: 31/31 backend pytest (100%), 100% of critical frontend flows, zero leftover old-token/broken-styling regressions across all public+admin pages. Confirmed all 76 real showroom demo photos in Gallery untouched (explicit user concern this session). Fixed post-test: catalogue slug collision handling.
- NOT built (deferred as Phase 2/3 per spec's own priority list — communicate to user before starting): mega menu, dedicated Projects/Where-to-Buy/Collections-as-entity pages, product search overlay, lead-capture gating on downloads.


## What's Been Implemented (2026-08-16)
- Added "Bedroom" as a 7th room category (found real photos in a "Bedroom" folder inside the user's content-staging.zip that were never imported since original spec fixed rooms to 6). Added to ROOMS in backend `models.py` + frontend `constants/rooms.js`, inserted `categories` doc (hero image = real showroom bedroom display photo), uploaded & created 5 `demo_photos` (room=bedroom) via admin upload API. No tile SKUs tagged "bedroom" yet (admin can tag via Tile Form, which now shows Bedroom as an option automatically). Also fixed sticky WhatsApp bar (was full-width bar, now a compact floating pill FAB bottom-right) and Contact page CTA hierarchy, plus added `ScrollToTop` on route change (was landing on footer after nav).
- Other unimported zip folders ("Granite collection", "Marble collection", "client's office", "parking") were intentionally left out — not room categories, need user direction if they should become tile collections or gallery-only content.

## What's Been Implemented (2026-08-15, redesign pass)
- Full brand redesign: new color tokens in tailwind.config.js — Ink #1B2A41, Canvas #F6F1E7, Canvas-Alt #EFE8D8, Clay #B5502E, Clay-Dark #93401F, Grout #C9C2B2, Brass #A8823C. Old tokens (bone, greige, charcoal, taupe, old clay hex) fully removed via sitewide rename. Kajaria-blue (`kajaria`/`cobalt`) and WhatsApp-green kept as restricted-use functional colors (trust strip, dealer badge, WA CTA only) per original spec — unchanged.
- Fonts swapped: Fraunces (serif/headings), Work Sans (sans/body), IBM Plex Mono (SKU codes, stat numbers) via Google Fonts in index.html.
- Home.jsx rebuilt: hero with left-to-right Ink gradient + corner-tick decorative brackets, 4:5 category grid with grout-line animated clay underline, new StatCounters.jsx (animated count-up: SKUs/projects/years/warranty), new ComparisonBlock.jsx ("Nirman Udyog vs Typical shop"), new FaqSection.jsx (shadcn accordion, 180° chevron rotate + slide-down), Reveal.jsx scroll-reveal wrapper (framer-motion whileInView, fade+translateY, ~280ms).
- TileCard.jsx: Canvas-Alt bg, Brass "Kajaria" badge, hover lift+shadow. Navbar/Footer: swapped to uploaded logo (settings.logo_url), clay underline nav animation, footer logo in canvas chip on ink bg.
- index.css: 6px radius, global focus-visible ring (2px clay offset), corner-tick utility classes.
- Bug fixed: StickyBarContext infinite render loop on /tile/{slug} (unmemoized context value + setOverride in effect deps) — memoized context value + removed stickyBar object from effect deps.
- Tested by testing_agent: 95% frontend pass, all pages regression-checked (public + admin), only bug found (render loop) fixed and reverified with clean console.

## Backlog (prioritized)
- P1: Flip to paid/always-on hosting before starting paid ads (avoid cold-start waste on ad budget) — noted as open item from original spec, no rework needed on app side
- P2: Optional future i18n scaffolding (explicitly out of scope for now)
- P2: Optional blog richtext/markdown editor (current is plain textarea)
- P2: Comparison Block / FAQ content currently static/hardcoded in frontend — could move to admin-editable settings fields if owner wants to change copy without a code change

## Next Tasks
- Confirm final WhatsApp business number is live/active for the +91 9475833221 number provided
- Await any further design feedback on the new Ink/Canvas/Clay/Brass palette from the owner
