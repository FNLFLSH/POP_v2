'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DesignLabsPage() {
  const [islands, setIslands] = useState<Array<{id: number, x: number, y: number, size: number, color: string}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate initial islands
  useEffect(() => {
    const initialIslands = [];
    for (let i = 0; i < 20; i++) {
      initialIslands.push({
        id: i,
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 2000 - 1000,
        size: Math.random() * 100 + 50,
        color: ['#ff4d00', '#d9d9d9', '#0e0e0e', '#1f1f1f'][Math.floor(Math.random() * 4)]
      });
    }
    setIslands(initialIslands);
  }, []);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = containerRef.current;
        
        // Add more islands when scrolling near edges
        if (scrollTop < 200 || scrollTop > scrollHeight - clientHeight - 200 ||
            scrollLeft < 200 || scrollLeft > scrollWidth - clientWidth - 200) {
          const newIslands = [];
          for (let i = 0; i < 10; i++) {
            newIslands.push({
              id: islands.length + i,
              x: Math.random() * 4000 - 2000,
              y: Math.random() * 4000 - 2000,
              size: Math.random() * 100 + 50,
              color: ['#ff4d00', '#d9d9d9', '#0e0e0e', '#1f1f1f'][Math.floor(Math.random() * 4)]
            });
          }
          setIslands(prev => [...prev, ...newIslands]);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [islands.length]);

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
              <Link href="/blueprint" className="absolute left-6 top-6 flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Blueprint</span>
              </Link>

              {/* Title - centered */}
              <div className="flex justify-center pt-2">
                <h1 className="font-black tracking-tight text-[32px] sm:text-[48px] leading-none text-[#ff4d00]">
                  Design Labs
                </h1>
              </div>
            </div>

            {/* Infinite Scroll Canvas */}
            <div 
              ref={containerRef}
              className="absolute inset-0 overflow-auto"
              style={{ 
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent 0 29px, rgba(255,255,255,0.1) 29px 30px),
                  repeating-linear-gradient(90deg, transparent 0 29px, rgba(255,255,255,0.1) 29px 30px)
                `,
                backgroundSize: '30px 30px'
              }}
            >
              {/* SVG Grid Overlay */}
              <svg 
                className="absolute inset-0 pointer-events-none" 
                width="100%" 
                height="100%"
                style={{ minWidth: '4000px', minHeight: '4000px' }}
              >
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Floating Islands */}
              <div className="relative" style={{ minWidth: '4000px', minHeight: '4000px' }}>
                {islands.map((island) => (
                  <div
                    key={island.id}
                    className="absolute rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{
                      left: island.x + 2000,
                      top: island.y + 2000,
                      width: island.size,
                      height: island.size,
                      backgroundColor: island.color,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </div>

              {/* Smart Objects Toolbar */}
              <div className="absolute top-20 left-4 z-20 bg-[#2a2a2a] border border-white/10 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Smart Objects</h3>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-[#ff4d00] rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                    BAR
                  </div>
                  <div className="w-12 h-12 bg-[#d9d9d9] rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-[#1a1a1a] font-bold text-xs">
                    TABLE
                  </div>
                  <div className="w-12 h-12 bg-[#ff4d00] rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                    STAGE
                  </div>
                  <div className="w-12 h-12 bg-[#d9d9d9] rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-[#1a1a1a] font-bold text-xs">
                    BOOTH
                  </div>
                  <div className="w-12 h-12 bg-[#ff4d00] rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                    SEAT
                  </div>
                </div>
              </div>

              {/* Venue Outline in Design Labs */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-96 h-64 border-2 border-[#ff4d00] rounded-lg bg-[#3a3a3a]/20 backdrop-blur-sm pointer-events-auto">
                  {/* This is where users will drag objects */}
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