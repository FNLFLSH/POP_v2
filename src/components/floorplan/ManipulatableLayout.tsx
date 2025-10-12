'use client';

import { useState, useRef, useCallback, useMemo } from "react";
import clsx from "clsx";
import { RotateCcw, Move, Maximize2, Minimize2 } from "lucide-react";
import type { GeneratedLayout } from "@/lib/layoutEngine";

type PreviewStatus = "generating" | "revealing" | "ready" | "packing";

export function ManipulatableLayout({
  layout,
  theme,
  status = "ready",
}: {
  layout: GeneratedLayout;
  theme: "dark" | "light";
  status?: PreviewStatus;
}) {
  const isDark = theme === "dark";
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, scale: 1 });
  const containerRef = useRef<HTMLDivElement>(null);

  const ids = useMemo(() => {
    const seed = Math.random().toString(36).slice(2, 10);
    return {
      clip: `layout-clip-${seed}`,
      gradient: `layout-gradient-${seed}`,
      glow: `layout-glow-${seed}`,
    };
  }, []);

  const borderEdges = useMemo(
    () => collectBoundaryEdges(layout.cells),
    [layout.cells],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      scale,
    });
  }, [scale]);

  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const delta = Math.max(deltaX, deltaY) / 100; // Scale factor
      const newScale = Math.max(0.5, Math.min(3, resizeStart.scale + delta));
      setScale(newScale);
    }
  }, [isResizing, resizeStart]);

  const resetTransform = useCallback(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  const rotateLayout = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  const gradientStops = isDark
    ? ["rgba(255,255,255,0.72)", "rgba(255,255,255,0.42)", "rgba(255,255,255,0.2)"]
    : ["rgba(0,0,0,0.26)", "rgba(0,0,0,0.16)", "rgba(0,0,0,0.1)"];

  const secondaryFill = isDark
    ? "rgba(255,255,255,0.18)"
    : "rgba(0,0,0,0.14)";

  const outlineColor = isDark
    ? "rgba(255,255,255,0.58)"
    : "rgba(0,0,0,0.45)";

  const glowOpacity = isDark ? 0.6 : 0.4;

  return (
    <div className="relative">
      {/* Control Panel */}
      <div
        className={clsx(
          "absolute -top-16 left-1/2 -translate-x-1/2 flex gap-2 rounded-full border px-4 py-2 backdrop-blur-sm transition-colors duration-500",
          isDark
            ? "border-white/15 bg-black/50 text-white"
            : "border-black/15 bg-white/80 text-black"
        )}
      >
        <button
          onClick={resetTransform}
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-full transition hover:scale-105",
            isDark
              ? "hover:bg-white/10"
              : "hover:bg-black/10"
          )}
          title="Reset"
        >
          <Move className="h-4 w-4" />
        </button>
        <button
          onClick={rotateLayout}
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-full transition hover:scale-105",
            isDark
              ? "hover:bg-white/10"
              : "hover:bg-black/10"
          )}
          title="Rotate 90°"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 px-2">
          <Minimize2 className="h-3 w-3" />
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-16"
          />
          <Maximize2 className="h-3 w-3" />
        </div>
      </div>

      {/* Layout Container */}
      <div
        ref={containerRef}
        className={clsx(
          "relative cursor-grab active:cursor-grabbing transition-all duration-300",
          status === "revealing" && "animate-pulse",
          status === "packing" && "scale-95 opacity-50"
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
          transformOrigin: "center center",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Resize Handle */}
        <div
          className={clsx(
            "absolute -bottom-2 -right-2 h-6 w-6 cursor-se-resize rounded-full border-2 transition-colors duration-500",
            isDark
              ? "border-white/30 bg-black/50 hover:border-white/50"
              : "border-black/30 bg-white/80 hover:border-black/50"
          )}
          onMouseDown={handleResizeStart}
          onMouseMove={handleResizeMove}
          onMouseUp={handleMouseUp}
        />

        {/* Layout SVG */}
        <div className="relative w-[600px] h-[600px]">
          <svg
            viewBox={`0 0 ${layout.gridSize} ${layout.gridSize}`}
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-full"
          >
            <defs>
              <clipPath id={ids.clip} clipPathUnits="userSpaceOnUse">
                {layout.cells.map((cell) => (
                  <rect
                    key={`${cell.row}-${cell.col}`}
                    x={cell.col}
                    y={cell.row}
                    width={1}
                    height={1}
                  />
                ))}
              </clipPath>
              <linearGradient id={ids.gradient} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={gradientStops[0]} />
                <stop offset="50%" stopColor={gradientStops[1]} />
                <stop offset="100%" stopColor={gradientStops[2]} />
              </linearGradient>
              <filter id={ids.glow} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="0.32"
                  floodColor={isDark ? "#ffffff" : "#000000"}
                  floodOpacity={glowOpacity}
                />
              </filter>
            </defs>

            <g clipPath={`url(#${ids.clip})`} filter={`url(#${ids.glow})`}>
              <rect
                x={0}
                y={0}
                width={layout.gridSize}
                height={layout.gridSize}
                fill={`url(#${ids.gradient})`}
              />
            </g>

            <g clipPath={`url(#${ids.clip})`}>
              <rect
                x={0}
                y={0}
                width={layout.gridSize}
                height={layout.gridSize}
                fill={secondaryFill}
              />
            </g>

            <g
              stroke={outlineColor}
              strokeWidth={0.14}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {borderEdges.map((edge) => (
                <line
                  key={`${edge.start.x},${edge.start.y}->${edge.end.x},${edge.end.y}`}
                  x1={edge.start.x}
                  y1={edge.start.y}
                  x2={edge.end.x}
                  y2={edge.end.y}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

type Point = { x: number; y: number };
type Edge = { start: Point; end: Point };

function collectBoundaryEdges(cells: GeneratedLayout["cells"]): Edge[] {
  const edgeMap = new Map<string, Edge>();

  cells.forEach(({ row, col }) => {
    const topLeft: Point = { x: col, y: row };
    const topRight: Point = { x: col + 1, y: row };
    const bottomRight: Point = { x: col + 1, y: row + 1 };
    const bottomLeft: Point = { x: col, y: row + 1 };

    addEdge(edgeMap, topLeft, topRight);
    addEdge(edgeMap, topRight, bottomRight);
    addEdge(edgeMap, bottomRight, bottomLeft);
    addEdge(edgeMap, bottomLeft, topLeft);
  });

  return Array.from(edgeMap.values());
}

function addEdge(map: Map<string, Edge>, start: Point, end: Point) {
  const key = edgeKey(start, end);
  const reverse = edgeKey(end, start);

  if (map.has(reverse)) {
    map.delete(reverse);
  } else {
    map.set(key, { start, end });
  }
}

function edgeKey(start: Point, end: Point): string {
  return `${start.x},${start.y}->${end.x},${end.y}`;
}
