'use client';

import { useState, useEffect } from 'react';
import DynamicEventCanvas from '@/components/canvas/DynamicEventCanvas';
import Toolbar from '@/components/canvas/Toolbar';
import PropertiesPanel from '@/components/canvas/PropertiesPanel';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold">Event Layout Manager</h1>
          </div>
          <div className="text-sm opacity-90">
            MVP - Canvas Foundation
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <Toolbar />

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
