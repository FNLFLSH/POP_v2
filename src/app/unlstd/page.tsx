'use client';

import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin, Sparkles, Ticket } from "lucide-react";

const experiences = [
  {
    title: "Immersive Pop-Up Courts",
    description: "Night-bloom basketball labs stitched into abandoned warehouses. Limited runs. Zero repeats.",
    meta: "48hr window · RSVP required",
  },
  {
    title: "Afterglow Sound Labs",
    description: "Analog synth healings blended with projection art. Black-out dress code, sunrise exit.",
    meta: "Saturday pulses · Invite only",
  },
  {
    title: "DesignLabz Suites",
    description: "Build-outs for micro-festivals and brand activations. Modular, mobile, made-to-measure.",
    meta: "On-demand · POP! certified",
  },
];

const drops = [
  { city: "Brooklyn", state: "NY", date: "MAR 28", tag: "Warehouse Circuit" },
  { city: "Atlanta", state: "GA", date: "APR 05", tag: "Skyline Lounge" },
  { city: "Chicago", state: "IL", date: "APR 19", tag: "Industrial Gardens" },
  { city: "Los Angeles", state: "CA", date: "MAY 03", tag: "Neon Atrium" },
];

export default function UnlstdClonePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f4f4f4]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 px-6 pb-24 pt-16 md:gap-20 md:px-10">
        <Hero />
        <DropTicker />
        <SectionHeading label="unlisted activations" kicker="Off-calendar, on-legend." />
        <ExperienceGrid />
        <SectionHeading label="current drop cycle" kicker="Rolling releases. Micro windows." />
        <DropSchedule />
        <SectionHeading label="designlabz in action" kicker="From blueprint to blackout." />
        <LabShowcase />
        <CTA />
      </div>
    </main>
  );
}

function Hero() {
  return (
    <header className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
      <div className="space-y-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70">
          <Sparkles className="h-3.5 w-3.5" />
          <span>POP! LITE / UNLISTED MODE</span>
        </div>
        <h1 className="text-4xl font-black tracking-[-0.03em] text-white sm:text-6xl">
          Events built in the shadows, dropped for the city, documented for the world.
        </h1>
        <p className="max-w-xl text-base text-white/70 sm:text-lg">
          UNLSTD is our experimental lane inside POP! Lite. We scout unused architecture,
          design the night through DesignLabz, and release it without algorithms or billboards.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/designlabs"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-white/15"
          >
            enter designlabz
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/blueprint"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/60 hover:text-white transition"
          >
            view blueprint flow
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 rounded-[32px] border border-white/10 bg-gradient-to-b from-white/5 via-white/0 to-white/5 p-6 backdrop-blur">
        <div className="flex justify-between text-xs uppercase tracking-[0.45em] text-white/60">
          <span>next drop</span>
          <span>48h entry window</span>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">Unlisted: Warehouse Circuit</h2>
          <p className="text-sm text-white/65">
            POP! Lite takes over a dormant rail hub. Two basketball courts, projection tunnels,
            DesignLabz lounge, and midnight vinyl choir.
          </p>
        </div>
        <div className="flex flex-wrap divide-x divide-white/10 rounded-2xl border border-white/10 bg-black/20 text-xs">
          <MetaBlock icon={<MapPin className="h-3.5 w-3.5" />} label="location" value="Brooklyn Navy Yard" />
          <MetaBlock icon={<Calendar className="h-3.5 w-3.5" />} label="dates" value="Mar 28 — Mar 30" />
          <MetaBlock icon={<Clock className="h-3.5 w-3.5" />} label="sessions" value="4 nightly slots" />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.35em] text-white/70">
          <span>RSVP waitlist is open</span>
          <Ticket className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}

function MetaBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-[120px] flex-1 items-center gap-3 px-4 py-3">
      <div className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70">{icon}</div>
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-[0.35em] text-white/40">{label}</div>
        <div className="text-sm text-white">{value}</div>
      </div>
    </div>
  );
}

function DropTicker() {
  return (
    <div className="relative overflow-hidden rounded-full border border-white/10 bg-white/5">
      <div className="animate-[scroll-left_20s_linear_infinite] whitespace-nowrap py-3 text-xs uppercase tracking-[0.45em] text-white/60">
        {Array.from({ length: 3 }).map((_, idx) => (
          <span key={idx} className="mx-8 inline-flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-white/40" />
            unlisted drops unlock weekly
            <span className="h-2 w-2 rounded-full bg-white/40" />
            designlabz powered experiences
            <span className="h-2 w-2 rounded-full bg-white/40" />
            tap in · keep it off the grid
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ label, kicker }: { label: string; kicker: string }) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <span className="text-xs uppercase tracking-[0.4em] text-white/50">{kicker}</span>
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{label}</h2>
    </div>
  );
}

function ExperienceGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {experiences.map((experience) => (
        <div
          key={experience.title}
          className="group flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 via-white/0 to-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/50">
            <span>{experience.meta}</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition group-hover:border-white/20 group-hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">{experience.title}</h3>
            <p className="text-sm text-white/70">{experience.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DropSchedule() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {drops.map((drop) => (
        <div
          key={`${drop.city}-${drop.date}`}
          className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 px-6 py-4 text-sm transition hover:border-white/20 hover:bg-black/30"
        >
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold text-white">{drop.date}</div>
            <div>
              <div className="text-base font-semibold text-white">{drop.city}, {drop.state}</div>
              <div className="text-xs uppercase tracking-[0.3em] text-white/50">{drop.tag}</div>
            </div>
          </div>
          <Link href="/designlabs" className="text-xs uppercase tracking-[0.35em] text-white/60 hover:text-white transition">
            details
          </Link>
        </div>
      ))}
    </div>
  );
}

function LabShowcase() {
  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
      <div className="relative rounded-[32px] border border-white/10 bg-black/30 p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
          <span>DesignLabz · render feed</span>
          <span>Live builds</span>
        </div>
        <div className="mt-6 grid gap-4">
          <RenderRow title="Warehouse Circuit" status="Layout locked · Lighting in progress" />
          <RenderRow title="Skyline Lounge" status="Spatial audio + seating map syncing" />
          <RenderRow title="Neon Atrium" status="Vendor routing + compliance staging" />
        </div>
      </div>
      <div className="space-y-6">
        <p className="text-lg text-white/70">
          Every UNLSTD drop starts as a DesignLabz build. We pull real site data, generate volumetric mockups,
          and ship interactive canvases so crews can move faster than the permits.
        </p>
        <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-sm text-white/65">
          <div className="mb-3 text-xs uppercase tracking-[0.35em] text-white/50">Punchlist preview</div>
          <ul className="space-y-2 text-sm">
            <li>• Structural scan imported · blueprint verified</li>
            <li>• Lighting rig + audio graph plotted</li>
            <li>• Vendor pods and crowd flow mapped</li>
            <li>• Compliance kit auto-attached to shareable plan</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function RenderRow({ title, status }: { title: string; status: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm">
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-xs text-white/50">{status}</div>
      </div>
      <div className="text-xs uppercase tracking-[0.35em] text-white/60">open in lab</div>
    </div>
  );
}

function CTA() {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-white/5 p-10 text-center">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <h3 className="text-3xl font-semibold text-white sm:text-4xl">
          Your city has dormant spaces. Let’s unlock them.
        </h3>
        <p className="text-sm text-white/70">
          Share a venue, a fragment of an idea, or a full-blown blueprint. We’ll run it through DesignLabz,
          return the render, and plan the drop with you.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/blueprint"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-white/15"
          >
            start a blueprint
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/designlabs"
            className="text-xs uppercase tracking-[0.35em] text-white/60 hover:text-white transition"
          >
            explore designlabz suite
          </Link>
        </div>
      </div>
    </div>
  );
}
