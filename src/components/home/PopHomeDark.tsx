'use client';

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from '@/components/common/ThemeToggle';

/**
 * POP! Home – Dark Mode (full screen, no circles)
 * - Single-file React component
 * - TailwindCSS for styling
 * - Includes: header title, left sidebar with hamburger + nav, center search bar & CTA,
 *   inner gray grid canvas, outer dotted paper backdrop.
 * - Full screen layout without decorative balls
 */

export default function PopHomeWithTheme() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#D9D9D9] dark:bg-black text-gray-900 dark:text-white overflow-hidden">
      {/* Outer dotted paper backdrop */}
      <div className="relative h-full w-full">
        <DottedPaperBackdrop />

        {/* Framed board - full screen */}
        <div className="relative h-full w-full">
          <div className="h-full bg-white dark:bg-gray-900 shadow-xl">
            {/* Main content area - full height */}
            <div className="relative h-full overflow-hidden">
              {/* Title at top center */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
                <h1 className="font-black tracking-tight text-[38px] sm:text-[56px] leading-none text-[#ff4d00]">
                  POP!
                </h1>
              </div>
              {/* Inner square grid background */}
              <InnerGrid />

              {/* Center card with search + CTA */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-full max-w-[720px] flex flex-col items-center gap-6 px-4">
                <div className="w-full rounded-md border border-white/10 bg-white/5 p-2 backdrop-blur">
                  <input
                    className="w-full rounded-md border border-black/20 bg-[#d9d9d9] px-4 py-3 text-sm tracking-wide text-[#1a1a1a] placeholder-black/50 outline-none shadow-inner"
                    placeholder="ENTER ADDRESS:"
                  />
                </div>
                <Link href="/canvas">
                  <button className="w-[240px] rounded-md border border-white/15 bg-[#d9d9d9] px-4 py-2 text-sm font-semibold text-[#1a1a1a] shadow hover:bg-[#e0e0e0] transition-colors">
                    Start Layout
                  </button>
                </Link>
                </div>
              </div>

              {/* Hamburger Button - Always visible */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute left-4 top-6 z-30 h-10 w-10 flex flex-col items-center justify-center gap-1.5 rounded-md border border-white/15 bg-[#1f1f1f] p-2 shadow hover:bg-[#2a2a2a] transition-colors"
              >
                <span className={`h-1 bg-[#d9d9d9] transition-all duration-300 ${
                  sidebarOpen ? 'w-6 rotate-45 translate-y-1.5' : 'w-6'
                }`} />
                <span className={`h-1 bg-[#d9d9d9] transition-all duration-300 ${
                  sidebarOpen ? 'w-0 opacity-0' : 'w-6'
                }`} />
                <span className={`h-1 bg-[#d9d9d9] transition-all duration-300 ${
                  sidebarOpen ? 'w-6 -rotate-45 -translate-y-1.5' : 'w-6'
                }`} />
              </button>

              {/* Theme Toggle Button - Top right */}
              <div className="absolute right-4 top-6 z-30">
                <ThemeToggle />
              </div>

              {/* Collapsible Left Sidebar */}
              <aside className={`absolute left-0 top-0 z-20 h-full transition-all duration-300 ${
                sidebarOpen ? 'w-[180px] border-r border-gray-200 dark:border-white/10 bg-gray-50/5 dark:bg-white/5 backdrop-blur' : 'w-0'
              }`}>

                {/* Nav - Only show when sidebar is open */}
                <div className={`transition-all duration-300 overflow-hidden ${
                  sidebarOpen ? 'opacity-100 mt-20 px-4 py-5' : 'opacity-0 h-0'
                }`}>
                  <nav className="space-y-2 text-[14px] font-semibold tracking-tight text-[#e7e7e7]">
                    <NavItem label="designlabs" href="/designlabs" />
                    <NavItem label="MyEvents" href="/myevents" />
                    <NavItem label="marketplace" href="/marketplace" />
                    <NavItem label="Metrics" href="/metrics" />
                    <NavItem label="Settings" href="/settings" />
                  </nav>

                  {/* Bottom profile area */}
                  <div className="absolute inset-x-0 bottom-3 px-4 text-[13px] text-[#e7e7e7]">
                    <div className="mb-2 h-10 w-10 rounded-full border border-white/20 bg-[#2a2a2a]" />
                    <div className="pl-0.5 text-xs opacity-70">Name</div>
                    <button className="mt-2 rounded border border-white/15 px-2 py-1 text-left text-xs opacity-90 hover:bg-white/5 transition-colors">
                      invite
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href}>
      <div className="w-full rounded-sm px-1 py-1.5 transition hover:bg-white/5 cursor-pointer">
        {label}
      </div>
    </Link>
  );
}

/** Dotted paper background (outside the main board) */
function DottedPaperBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
        backgroundPosition: "-9px -9px",
      }}
    >
      {/* Rounded corner squiggle (top-right) */}
      <div className="absolute right-2 top-2 h-10 w-10 rounded-tl-[22px] border-l-2 border-t-2 border-white/30" />
    </div>
  );
}

/** Inner square grid like the mock */
function InnerGrid() {
  return (
    <div className="absolute inset-0">
      {/* base fill */}
      <div className="absolute inset-0 bg-[#3a3a3a]" />
      {/* square grid using repeating-linear-gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 29px, rgba(0,0,0,0.4) 29px 30px),\n             repeating-linear-gradient(90deg, transparent 0 29px, rgba(0,0,0,0.4) 29px 30px)",
        }}
      />
    </div>
  );
}