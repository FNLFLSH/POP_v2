'use client';

import { useState, useRef, useEffect } from 'react';
import { GripVertical, Settings, Palette, Layers } from 'lucide-react';

export default function DraggableIsland() {
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const islandRef = useRef<HTMLDivElement>(null);

  // Check if island should be horizontal based on position
  useEffect(() => {
    const checkOrientation = () => {
      if (islandRef.current) {
        const rect = islandRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        
        // Check if near top or bottom of screen
        const nearTop = rect.top < 100;
        const nearBottom = rect.bottom > windowHeight - 100;
        
        // Check if near left or right of screen
        const nearLeft = rect.left < 100;
        const nearRight = rect.right > windowWidth - 100;
        
        // Set horizontal if near top/bottom or if very close to left/right edges
        setIsHorizontal(nearTop || nearBottom || nearLeft || nearRight);
      }
    };

    checkOrientation();
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === islandRef.current || (e.target as HTMLElement).closest('[data-drag-handle]')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Constrain to viewport
      const maxX = window.innerWidth - (isHorizontal ? 200 : 80);
      const maxY = window.innerHeight - (isHorizontal ? 80 : 200);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const islandContent = (
    <div className={`flex items-center ${isHorizontal ? 'gap-3' : 'gap-2'}`}>
      <div className="flex items-center gap-1.5">
        <Settings className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Tools</span>
      </div>
      <div className={`bg-gray-300 dark:bg-gray-600 ${isHorizontal ? 'h-4 w-px' : 'w-4 h-px'}`} />
      <div className="flex items-center gap-1.5">
        <Palette className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Design</span>
      </div>
      <div className={`bg-gray-300 dark:bg-gray-600 ${isHorizontal ? 'h-4 w-px' : 'w-4 h-px'}`} />
      <div className="flex items-center gap-1.5">
        <Layers className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Layers</span>
      </div>
    </div>
  );

  return (
    <div
      ref={islandRef}
      className={`fixed z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl shadow-lg transition-all duration-200 ${
        isDragging ? 'scale-105 shadow-xl' : 'hover:shadow-lg'
      } ${isHorizontal ? 'px-4 py-2' : 'px-3 py-4'}`}
      style={{
        left: position.x,
        top: position.y,
        width: isHorizontal ? 'auto' : '70px',
        height: isHorizontal ? '50px' : 'auto',
        minWidth: isHorizontal ? '180px' : '70px',
        minHeight: isHorizontal ? '50px' : '180px',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag handle */}
      <div 
        data-drag-handle
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 hover:opacity-50 transition-opacity"
      >
        <GripVertical className={`h-3 w-3 text-gray-500 dark:text-gray-400 ${isHorizontal ? 'rotate-90' : ''}`} />
      </div>

      {/* Content */}
      <div className={`flex ${isHorizontal ? 'flex-row items-center' : 'flex-col items-center'} gap-2`}>
        {islandContent}
      </div>

      {/* Corner indicators for orientation */}
      <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-[#ff4d00] rounded-full opacity-50" />
      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#ff4d00] rounded-full opacity-50" />
      <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-[#ff4d00] rounded-full opacity-50" />
      <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[#ff4d00] rounded-full opacity-50" />
    </div>
  );
}
