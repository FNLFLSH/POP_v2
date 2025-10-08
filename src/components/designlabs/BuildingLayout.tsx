'use client';

import { useState, useRef, useEffect } from 'react';
import { ProcessedBuilding } from '@/lib/building-service';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

interface BuildingLayoutProps {
  buildingData: ProcessedBuilding;
}

export default function BuildingLayout({ buildingData }: BuildingLayoutProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, scale: 1 });
  const [rotateStart, setRotateStart] = useState({ x: 0, y: 0, rotation: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridScale, setGridScale] = useState(1);

  const handleZoomIn = () => {
    setGridScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setGridScale(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setGridScale(1);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    if (target.closest('[data-resize-handle]')) {
      e.preventDefault();
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        scale: scale
      });
    } else if (target.closest('[data-rotate-handle]')) {
      e.preventDefault();
      setIsRotating(true);
      setRotateStart({
        x: e.clientX,
        y: e.clientY,
        rotation: rotation
      });
    } else if (target === containerRef.current || target.closest('[data-drag-handle]')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const scaleFactor = 1 + (distance / 200);
      setScale(Math.max(0.1, Math.min(5, resizeStart.scale * scaleFactor)));
    } else if (isRotating) {
      const deltaX = e.clientX - rotateStart.x;
      const deltaY = e.clientY - rotateStart.y;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      setRotation((rotateStart.rotation + angle) % 360);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setGridScale(prev => Math.max(0.3, Math.min(3, prev * delta)));
  };

  useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating, dragStart, resizeStart, rotateStart]);
  return (
    <div className="h-full w-full relative">
      {/* Infinite grid background - covers entire page */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, #666 1px, transparent 1px),
            linear-gradient(to bottom, #666 1px, transparent 1px)
          `,
          backgroundSize: `${30 * gridScale}px ${30 * gridScale}px`
        }}
      />
      
      {/* Secondary grid for finer detail */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, #666 0.5px, transparent 0.5px),
            linear-gradient(to bottom, #666 0.5px, transparent 0.5px)
          `,
          backgroundSize: `${10 * gridScale}px ${10 * gridScale}px`
        }}
      />
      
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 dark:border-white/10 p-2">
          <div className="flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Reset View"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Scale indicator */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 dark:border-white/10 px-3 py-2">
          <div className="text-xs text-gray-600 dark:text-gray-300 text-center">
            Grid: {Math.round(gridScale * 100)}%
          </div>
        </div>
      </div>

      {/* Move indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 dark:border-white/10 p-2">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Move className="h-4 w-4" />
            <span>Drag to move</span>
          </div>
        </div>
      </div>
      
      {/* Building outline - scalable and draggable */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        onWheel={handleWheel}
      >
        <div 
          ref={containerRef}
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-8 cursor-move select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: (isDragging || isResizing || isRotating) ? 'none' : 'transform 0.2s ease-out'
          }}
          onMouseDown={handleMouseDown}
          data-drag-handle
        >
          {/* Building outline */}
          <div 
            className="w-full h-full max-w-2xl max-h-2xl"
            dangerouslySetInnerHTML={{ __html: buildingData.svg }}
          />
          
          {/* Corner indicators */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-[#ff4d00] rounded-full opacity-70" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#ff4d00] rounded-full opacity-70" />
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#ff4d00] rounded-full opacity-70" />
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#ff4d00] rounded-full opacity-70" />
          
          {/* Resize handles */}
          <div 
            className="absolute -top-1 -left-1 w-4 h-4 bg-[#ff4d00] rounded-full opacity-70 cursor-nw-resize hover:opacity-100 transition-opacity"
            data-resize-handle
          />
          <div 
            className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff4d00] rounded-full opacity-70 cursor-ne-resize hover:opacity-100 transition-opacity"
            data-resize-handle
          />
          <div 
            className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#ff4d00] rounded-full opacity-70 cursor-sw-resize hover:opacity-100 transition-opacity"
            data-resize-handle
          />
          <div 
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#ff4d00] rounded-full opacity-70 cursor-se-resize hover:opacity-100 transition-opacity"
            data-resize-handle
          />
          
          {/* Rotation handle */}
          <div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#ff4d00] rounded-full opacity-70 cursor-grab hover:opacity-100 transition-opacity"
            data-rotate-handle
          >
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-[#ff4d00]" />
          </div>
        </div>
      </div>
    </div>
  );
}
