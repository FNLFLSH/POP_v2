'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import the canvas component to avoid SSR issues
const EventCanvas = dynamic(() => import('./EventCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600">Loading canvas...</div>
    </div>
  ),
});

interface DynamicCanvasProps {
  width: number;
  height: number;
}

export default function DynamicEventCanvas({ width, height }: DynamicCanvasProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading canvas...</div>
      </div>
    );
  }

  return <EventCanvas width={width} height={height} />;
}
