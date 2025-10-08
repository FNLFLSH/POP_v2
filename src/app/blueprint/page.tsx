'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function VenueBlueprintPage() {
  return (
    <div className="h-screen w-screen bg-[#0e0e0e] text-white overflow-hidden">
      {/* Outer dotted paper backdrop */}
      <div className="relative h-full w-full">
        <DottedPaperBackdrop />

        {/* Main content */}
        <div className="relative h-full w-full">
          <div className="h-full bg-[#1f1f1f] shadow-xl">
            {/* Header */}
            <div className="relative p-6 z-10">
              {/* Back button */}
              <Link href="/" className="absolute left-6 top-6 flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>

              {/* Title - centered */}
              <div className="flex justify-center pt-2">
                <h1 className="font-black tracking-tight text-[32px] sm:text-[48px] leading-none text-[#ff4d00]">
                  Venue Blueprint
                </h1>
              </div>
            </div>

            {/* Blueprint Content */}
            <div className="flex flex-col items-center justify-center h-[calc(100%-120px)] px-6">
              <div className="w-full max-w-4xl">
                {/* 2D Blueprint Visualization */}
                <div className="bg-[#2a2a2a] border border-white/10 rounded-lg p-8 mb-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Your Venue Layout</h2>
                    <p className="text-[#d9d9d9] opacity-80">2D blueprint of your selected venue</p>
                  </div>
                  
                  {/* Venue Outline Only */}
                  <div className="bg-[#3a3a3a] rounded-lg p-6 min-h-[400px] relative overflow-hidden">
                    {/* Grid lines */}
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `
                          repeating-linear-gradient(0deg, transparent 0 19px, rgba(255,255,255,0.3) 19px 20px),
                          repeating-linear-gradient(90deg, transparent 0 19px, rgba(255,255,255,0.3) 19px 20px)
                        `,
                        backgroundSize: '20px 20px'
                      }}
                    />
                    
                    {/* Venue outline only - clean boundary */}
                    <div className="absolute inset-4 border-2 border-[#ff4d00] rounded-lg">
                      {/* Empty space - just the outline */}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <Link href="/designlabs">
                    <button className="bg-[#ff4d00] hover:bg-[#e64400] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                      Go to Design Labs
                    </button>
                  </Link>
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
