# POP! Lite – Event Experience Builder

Neon nightlife aesthetic, Next.js 15.5, and a blueprint-to-island flow that turns any address into a DesignLabz playground.

- 🧭 Want the full narrative & sprint log? See `docs/POP-lite-progress.md`.
- 🛠 Need to ship fast? Follow the quickstart + Supabase notes below.

---

## 🔥 Core Experience

1. **Neon Landing Drop** – Animated map pin crashes onto the grid, shaking the viewport and unveiling the POP! shell in lilac + black.  
2. **Address Unlock** – Search input captures the venue address and deep-links to the blueprint portal with flow context.  
3. **Venue Blueprint Portal** – 3D holobox render (with fallbacks) confirms coordinates, footprint type, and status before launch.  
4. **DesignLabz Suite** – Carousel of unlocked venues + infinite “island” canvas + toolkit sidebar deliver the sandbox for layouts.

> Each step is intentionally cinematic so founders, partners, and investors feel the POP! energy immediately.

---

## 🚀 Feature Breakdown

- **Interactive Landing** – Timed reveal, pin drop, shake animation (`globals.css`).  
- **Blueprint Holobox** – `src/components/visuals/VenueHolobox.tsx` turns footprint data into volumetric renders.  
- **DesignLabz Carousel** – `src/app/designlabs/page.tsx` merges unlocked venues with “coming soon” islands and highlights the current location.  
- **Infinite Island Canvas** – Procedurally grows as users explore; future modules will snap onto this grid.  
- **Supabase-Powered Persistence** – `/api/venues` writes to Supabase if configured and gracefully falls back to an in-memory store when offline.  
- **Global Neon Theme** – Purple/black palette applied across flows, with ThemeToggle still available via sidebar.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15.5 (App Router)  
- **Language**: TypeScript + modern React (app directory, client components where needed)  
- **Styling**: Tailwind CSS + custom keyframes for cinematic moments  
- **UI & Icons**: shadcn/ui primitives, Radix UI, Lucide React  
- **State & Storage**: LocalStorage for quick flows, Supabase endpoint for shared venue library

---

## ⚙️ Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, drop an address, unlock the blueprint, and press “Launch DesignLabz Suite”.

### Supabase (optional but recommended)

Create a table (default name `venues`) with:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid (PK) | Use default `uuid_generate_v4()` |
| `address` | text | Unique-ish, but no constraint needed yet |
| `geocode` | jsonb | Raw payload from geocoding API |
| `footprint` | jsonb | Geometry + metadata |
| `created_at` | timestamptz | Default `now()` |

Set env vars:

- `SUPABASE_URL`  
- `SUPABASE_ANON_KEY` (or `SUPABASE_SERVICE_ROLE_KEY` for writes)  
- `SUPABASE_VENUE_TABLE` (optional override)

No Supabase? The app will quietly use an in-memory array so demos never break.

---

## 🧭 Project Structure (Highlights)

```
src/
├─ app/
│  ├─ page.tsx                # Landing experience
│  ├─ blueprint/page.tsx      # Venue Blueprint Portal
│  ├─ designlabs/page.tsx     # DesignLabz infinite canvas + toolkit
│  └─ api/
│     └─ venues/route.ts      # Supabase persistence with fallback
├─ components/
│  ├─ home/PopHomeDark.tsx    # Landing UI + search flow
│  ├─ visuals/VenueHolobox.tsx# Shared 3D holobox renderer
│  └─ providers/ThemeProvider.tsx
└─ public/landing-map-grid.svg# Grid overlay for landing cinematic
```

---

## 🔮 Roadmap Snapshot

- React-three-fiber or Konva scenes for actual floorplans.  
- Draggable Design Labz Suite modules with Supabase persistence.  
- Collaboration (auth, invites, shared links).  
- Marketplace & Metrics vertical slices so the sidebar isn’t just aspirational.  
- Storytelling collateral (Loom walkthrough, investor deck screens).

For the sprint-by-sprint breakdown and next bets, check `docs/POP-lite-progress.md`.

---

## 📝 License

MIT License – see [GitHub Repository](https://github.com/FNLFLSH/POP_v2) for details.
