'use client';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
}

export default function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <div className="h-screen w-screen bg-[#0e0e0e] text-white overflow-hidden">
      {/* Outer dotted paper backdrop */}
      <div className="relative h-full w-full">
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
          <div className="absolute right-2 top-2 h-10 w-10 rounded-tl-[22px] border-l-2 border-t-2 border-white/30" />
        </div>

        {/* Main content */}
        <div className="relative h-full w-full">
          <div className="h-full bg-[#1f1f1f] shadow-xl">
            {/* Header */}
            <div className="relative p-6">
              {/* Back button - positioned absolutely */}
              <Link href="/" className="absolute left-6 top-6 flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              
              {/* Title - centered - removed since POP! is now universal */}
            </div>

            {/* Coming Soon Content */}
            <div className="flex flex-col items-center justify-center h-[calc(100%-120px)] text-center">
              <div className="mb-8">
                <h1 className="font-black tracking-tight text-[32px] sm:text-[48px] leading-none text-[#ff4d00] mb-4">
                  {title}
                </h1>
                <h2 className="text-4xl font-bold text-white mb-4">Coming Soon</h2>
                <p className="text-xl text-gray-400 max-w-md">
                  We're working hard to bring you {title.toLowerCase()}. 
                  Check back soon for updates!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
