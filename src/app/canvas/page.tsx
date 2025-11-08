'use client';

import { useState, useEffect } from 'react';
import DynamicEventCanvas from '@/components/canvas/DynamicEventCanvas';
import Toolbar from '@/components/canvas/Toolbar';
import PropertiesPanel from '@/components/canvas/PropertiesPanel';
import GlobalThemeToggle from '@/components/common/GlobalThemeToggle';

export default function CanvasPage() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth - 320, // Account for properties panel
        height: window.innerHeight - 200, // Account for header and toolbar
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#f3f3f3] text-[#1f1f1f] dark:bg-[#0f0f0f] dark:text-[#f5f5f5] transition-colors">
      <GlobalThemeToggle />
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1c1c1c] via-[#2a2a2a] to-[#3a3a3a] text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Event Layout Manager</h1>
          </div>
          <div className="text-sm opacity-90">
            MVP - Canvas Foundation
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <Toolbar selectedTool="select" onToolSelect={() => {}} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative">
          {dimensions.width > 0 && dimensions.height > 0 && (
            <DynamicEventCanvas width={dimensions.width} height={dimensions.height} />
          )}
        </div>

        {/* Properties Panel */}
        <PropertiesPanel />
      </div>
    </div>
  );
}
