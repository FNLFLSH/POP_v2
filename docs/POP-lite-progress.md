# POP! Lite – Progress Log & Experience Map

This document keeps the founding team aligned on what is live inside the POP! Lite build, the problem we are solving in each flow, and the runway of work that is queued up next. Share it with partners or investors to illustrate momentum.

---

## 1. Experience Flythrough

| Sequence | What the guest sees | Purpose |
| --- | --- | --- |
| **1. Neon Landing Drop** (`src/components/home/PopHomeDark.tsx`) | A map pin free-falls onto a night map, shakes the viewport, and reveals the POP! interface bathed in neon lilac + black. | Sets the creative “nightlife” tone and preps the user for an immersive planning tool. |
| **2. Address Unlock** (Home search → `/blueprint`) | Entering an address stores it locally and deep-links to the Blueprint Portal with query params. | Makes the address the core input for unlocking a venue experience. |
| **3. Venue Blueprint Portal** (`/blueprint/page.tsx`) | The pop-up is visualised as a 3D holobox render framed in a “location unlocked” UI, alongside metadata (coordinates, footprint type, status). | Confirms that POP! digested the address, gives context, and primes the jump into DesignLabz. |
| **4. Save to DesignLabz** (`/api/venues/route.ts`) | The venue snapshot is persisted (Supabase REST if configured, in-memory fallback otherwise) before routing to DesignLabz with highlighting. | Builds the backbone for a living library of venue islands. |
| **5. DesignLabz Suite** (`/designlabs/page.tsx`) | A venue carousel, infinite “island” canvas, and the Design Labz Suite toolkit surround the holobox render. Future venues are marked as “coming soon”. | Provides the sandbox where teams will craft layouts and experiment with fixtures. |

---

## 2. Implementation Highlights

- **Landing Animation**
  - Animated pin + shake effects defined in `src/app/globals.css`.
  - The landing overlay auto-dismisses after 3.4s with staged timers.

- **Blueprint Portal**
  - Uses `VenueHolobox` (new shared component) to convert footprint data into a volumetric render.
  - Handles API failure gracefully with a “concept shell” fallback so the flow never dead-ends.
  - Launch button saves the venue and deep-links into DesignLabz, passing a highlight identifier.

- **DesignLabz Upgrade**
  - Venue carousel merges unlocked venues with future islands; arrow buttons support quick scanning.
  - Infinite workspace adds generative islands as the user scrolls near boundaries.
  - Toolkit sidebar introduces the “Design Labz Suite” language and modules we will later wire up.

- **Persistence Layer**
  - `/api/venues` writes to Supabase when env vars are present (`SUPABASE_URL`, `SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY`).  
  - Without credentials, requests gracefully fall back to an in-memory store so demos still work offline.

---

## 3. Timeline & Progress

| Phase | Week | Status | Notes |
| --- | --- | --- | --- |
| **Concept Reset** | Week 1 | ✅ Complete | Reframed POP! Lite around neon nightlife aesthetic; removed legacy orange palette. |
| **Landing Portal** | Week 1 | ✅ Complete | Implemented map-pin animation, screen shake, and new CTA copy. |
| **Blueprint Portal** | Week 2 | ✅ Complete | Introduced holobox render, metadata grid, and “Launch DesignLabz Suite” CTA with save hook. |
| **DesignLabz Suite v1** | Week 2 | ✅ Complete | Carousel, infinite canvas, island generator, and toolkit panel shipped. |
| **Persistence Hook** | Week 2 | ✅ Complete | Added `/api/venues` endpoint with Supabase + fallback support. |
| **Next Up** | Week 3 | 🚧 In Progress | Real Konva canvas + drag/drop modules, Supabase schema hardening, richer venue metadata. |

> **Tempo Callout:** Each phase represents a focused 1-week sprint. We can accelerate or split work as we add more engineers, but this cadence keeps the founding team synced.

---

## 4. Open Threads / Next Investments

1. **Venue Canvas Upgrade** – Replace placeholder holobox with react-three-fiber or staged Konva layouts that match real floorplans.  
2. **Design Labz Suite Actions** – Make toolkit modules draggable & persist transforms in Supabase.  
3. **Collaboration & Sharing** – Introduce user auth, invite flows, and shareable venue links.  
4. **Metrics + Marketplace Tie-In** – Begin surfacing downstream products hinted at in the sidebar (Marketplace, Metrics).  
5. **Content Production** – Capture a Loom walkthrough using this doc as the script for investor or partner updates.

---

## 5. Environment & Handoff Notes

- **Supabase Setup**
  - Table: `venues`
  - Columns: `id (uuid, primary)`, `address (text)`, `geocode (jsonb)`, `footprint (jsonb)`, `created_at (timestamp, default now())`
  - Env: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (or `SUPABASE_SERVICE_ROLE_KEY` for writes), `SUPABASE_VENUE_TABLE` (optional override)

- **Runbook**
  ```bash
  npm install
  npm run dev
  ```
  Visit `http://localhost:3000`, drop an address, and follow the flow to `/designlabs`.

- **Demo Tip**
  - If geocode/building APIs are unavailable, the blueprint page auto-fills a “Concept Shell” so the story still lands.

---

**Share this link internally** to keep everyone aligned on why POP! Lite matters, what just shipped, and what is coming next. Let’s keep the momentum. 🟣
