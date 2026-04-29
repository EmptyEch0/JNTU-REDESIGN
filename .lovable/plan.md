# JNTU-GV College of Engineering — Premium Redesign

## Vision
A contemporary, immersive academic website that breaks from stacked-section monotony. Cinematic hero, storytelling flow, asymmetrical layered sections, subtle parallax, and dedicated routes for each major area. Royal Blue authority + Soft Sand warmth + Cool Grey clarity + Indigo depth.

## Design System (`src/styles.css`)
- **Palette (oklch)**:
  - Background: Soft Sand `oklch(0.97 0.012 85)`
  - Card: Warm white `oklch(0.99 0.005 85)`
  - Primary: Royal Blue `oklch(0.42 0.18 265)`
  - Primary glow: `oklch(0.55 0.20 265)`
  - Accent: Indigo `oklch(0.45 0.16 285)`
  - Foreground: Cool Grey `oklch(0.28 0.02 250)`
  - Muted-foreground: `oklch(0.50 0.02 250)`
- **Gradients**: `--gradient-hero` (royal blue → indigo overlay), `--gradient-sand` (subtle sand wash), `--gradient-card`.
- **Shadows**: `--shadow-elegant`, `--shadow-card-hover`, `--shadow-glow`.
- **Typography**: Playfair Display (display headings) + Inter (body) loaded via Google Fonts in `__root.tsx`.
- **Animations**: extend keyframes — `fade-up`, `slide-in-left`, `slide-in-right`, `scale-reveal`, `marquee`, `parallax-float`, `underline-expand`.
- **Custom utilities**: `.parallax-slow`, `.reveal-on-scroll`, `.hover-lift`, `.story-link`, `.glass-panel`.

## Routes (file-based, separate pages — not scroll sections)
```
src/routes/
  __root.tsx          (sticky header + mega-menu + footer + page transitions)
  index.tsx           (cinematic homepage)
  about.tsx
  academics.tsx
  departments.tsx
  hostels.tsx
  library.tsx
  sports.tsx
  dispensary.tsx
  rd-cell.tsx
  placements.tsx
  nss.tsx
  women-empowerment.tsx
  campus-life.tsx
  gallery.tsx
  notices.tsx
  admissions.tsx
  contact.tsx
```
Each route: own `head()` metadata (title, description, og:*), breadcrumbs, hero strip, content blocks.

## Shared Components (`src/components/`)
- `MegaMenu.tsx` — sticky header, hover dropdowns w/ multi-column panels + icons. Mobile drawer fallback.
- `Footer.tsx` — multi-column with quick links, contact, social.
- `Breadcrumbs.tsx` — auto from current path.
- `PageHero.tsx` — reusable inner-page hero with gradient + breadcrumb.
- `RevealOnScroll.tsx` — IntersectionObserver wrapper for fade-up/slide animations.
- `ParallaxLayer.tsx` — translateY based on scroll using `useScroll`-style hook.
- `StatCounter.tsx` — animated number counter when in view.
- `SectionLabel.tsx` — small uppercase indigo label.
- `ProfileCard.tsx` — for warden/committee members.
- `FacilityCard.tsx` — hover-expand card.
- `MarqueeLogos.tsx` — recruiter logos infinite scroll.
- `MasonryGallery.tsx` — CSS columns masonry.

## Homepage Flow (`src/routes/index.tsx`)
1. **Cinematic Hero** — full-viewport campus image with dark gradient overlay, parallax background (slower scroll), large display heading "Engineering Tomorrow, Today", subhead, three minimal CTAs (Admissions / Explore Campus / Notices). Scroll-down indicator.
2. **About + Key Stats split** — left: editorial paragraph + signature; right: 2x2 stat grid with animated counters (1450 Students, 109 UG Boys Rooms, 96 PG Boys Rooms, 113 UG Girls Rooms).
3. **Departments — horizontal scroll cards** — snap-x carousel (CSE, ECE, EEE, Mech, Civil, IT, MBA) each with icon, accent gradient, hover lift.
4. **Facilities — interactive showcase** — asymmetric grid of hover-expanding cards (Hostels, Library, Sports, Dispensary, R&D, Placements) each linking to its dedicated route.
5. **Campus Life — parallax** — full-width image with slow parallax, overlay text, CTA to /campus-life.
6. **Placements** — animated counters (offers, top package, recruiters) + infinite marquee of recruiter logos.
7. **Gallery preview** — masonry+carousel hybrid teaser linking to /gallery.
8. **CTA strip** — "Begin your journey" → /admissions.

## Inner Pages — Specific Content
- **Hostels**: tabs (UG Boys / PG Boys / Girls), warden Dr. Ch. Bindu Madhuri profile card, deputy wardens, facility icons (RO plant, gym, dining, Wi-Fi), health assistants Sri Venkata Krishna & Ms. G. Krishna Veni as profile cards, room stats.
- **R&D Cell**: research areas grid, funding agencies (UGC, DST, DAE, NRB) as logo tiles, consultancy partners (Supraja Technologies, Sarda Metals & Alloys Ltd.) cards, committee profiles (Dr. Swami Naidu, Dr. G. J. Naga Raju, Dr. R. Rajeswara Rao) timeline.
- **Library / Sports / Dispensary / NSS / Women Empowerment / Placements**: structured cards, stat blocks, profile cards, tabbed navigation.

## Mega-Menu Categories
- Academics (Programs, Curriculum, Calendar, Examinations)
- Departments (CSE, ECE, EEE, Mech, Civil, IT, MBA, S&H)
- Facilities (Hostels, Library, Sports, Dispensary, Transport)
- Student Corner (NSS, Women Empowerment, Clubs, Grievance)
- Placements (Training, Recruiters, Statistics)
- R&D (R&D Cell, Publications, Consultancy, Funding)

## Assets
Generate 4 hero/section images via imagegen (fast tier):
- `hero-campus.jpg` — cinematic campus aerial at golden hour
- `campus-life.jpg` — students on lawn, parallax bg
- `library-interior.jpg` — modern library
- `placements-bg.jpg` — graduation/handshake editorial

## Performance & A11y
- `loading="lazy"` on all non-hero images
- IntersectionObserver-based reveals (no heavy libs)
- Pure CSS marquee + parallax (transform only)
- Semantic HTML, single H1 per route, alt text, focus rings, prefers-reduced-motion guard

## Out of Scope (this pass)
- Real CMS/notice backend (use static placeholder content)
- Auth / portal / forms submission
- Dark mode toggle

## Build Order
1. Design tokens + fonts + global utilities.
2. Shared components (MegaMenu, Footer, RevealOnScroll, ParallaxLayer, etc.).
3. Generate hero images.
4. Root layout with header/footer/transitions.
5. Homepage.
6. All inner routes with real content.
7. QA build.