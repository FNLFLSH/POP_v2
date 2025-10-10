'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LayoutSelectionPage() {
  const layoutTemplates = [
    { id: 1, name: "Outdoor Festival", description: "Open air events with multiple stages" },
    { id: 2, name: "Pop-Up Market", description: "Vendor booths and walkways" },
    { id: 3, name: "Club Event", description: "Dance floor and bar areas" },
    { id: 4, name: "Fashion Show", description: "Runway and seating arrangements" },
    { id: 5, name: "Conference", description: "Meeting rooms and networking areas" },
    { id: 6, name: "Wedding", description: "Ceremony and reception layouts" },
  ];
  const handleReturnHome = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('popSkipLanding', 'true');
    }
  };

  return (
    <div className="h-screen w-screen bg-[#1a1a1a] text-white overflow-hidden">
      {/* Outer dotted paper backdrop */}
      <div className="relative h-full w-full">
        <DottedPaperBackdrop />

        {/* Main content */}
        <div className="relative h-full w-full">
          <div className="h-full bg-[#2a2a2a] shadow-xl">
            {/* Header */}
            <div className="relative p-6">
              {/* Back button */}
              <Link
                href="/"
                onClick={handleReturnHome}
                className="absolute left-6 top-6 flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>

              {/* Title - centered */}
              <div className="flex justify-center pt-2">
                <h1 className="font-black tracking-tight text-[32px] sm:text-[48px] leading-none text-[#ffffff]">
                  Select Layout Design
                </h1>
              </div>
            </div>

            {/* Layout Templates Grid */}
            <div className="flex flex-col items-center justify-center h-[calc(100%-120px)] px-6">
              <div className="w-full max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {layoutTemplates.map((template) => (
                    <Link key={template.id} href="/designlabs">
                      <div className="group cursor-pointer">
                        <div className="bg-[#333333] border border-gray-600/20 rounded-lg p-6 hover:bg-[#444444] transition-colors">
                          <div className="h-32 bg-[#444444] rounded-md mb-4 flex items-center justify-center">
                            <div className="text-[#ffffff] text-2xl font-bold">
                              {template.name.split(' ')[0]}
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {template.name}
                          </h3>
                          <p className="text-sm text-[#d0d0d0] opacity-80">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
