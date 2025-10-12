'use client';

import { useMemo } from "react";
import clsx from "clsx";
import type { GeneratedLayout } from "@/lib/layoutEngine";

type PreviewStatus = "generating" | "revealing" | "ready" | "packing";

export function GeneratedLayoutPreview({
  layout,
  theme,
  status = "ready",
  showLabel = true,
  frameless = false,
  className,
  frameClassName: frameClassNameProp,
  canvasClassName: canvasClassNameProp,
}: {
  layout: GeneratedLayout;
  theme: "dark" | "light";
  status?: PreviewStatus;
  showLabel?: boolean;
  frameless?: boolean;
  className?: string;
  frameClassName?: string;
  canvasClassName?: string;
}) {
  const isDark = theme === "dark";

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

  const frameClassName = clsx(
    "relative w-full transition-all duration-500",
    {
      "plan-pack": status === "packing",
      "plan-reveal": status === "revealing",
      "plan-loading": status === "generating",
      "plan-rest": status === "ready" || status === "generating",
    },
    frameless ? "max-w-[420px]" : "max-w-[340px] overflow-hidden rounded-[32px] border backdrop-blur p-6",
    !frameless &&
      (isDark
        ? "border-white/12 bg-black/50 shadow-[0_30px_70px_rgba(0,0,0,0.45)]"
        : "border-black/10 bg-white/70 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"),
    frameClassNameProp,
  );

  const canvasClassName = clsx(
    "relative mx-auto aspect-square w-full overflow-hidden transition-all duration-500",
    frameless
      ? ""
      : isDark
        ? "rounded-[28px] border border-white/8 bg-gradient-to-br from-white/5 via-black/20 to-black/50"
        : "rounded-[28px] border border-black/10 bg-gradient-to-br from-white/80 via-white/60 to-[#f0f0f0]",
    canvasClassNameProp,
  );

  const paddingClass = frameless ? "p-0" : "p-6";

  const gradientStops = isDark
    ? frameless
      ? ["rgba(255,255,255,0.72)", "rgba(255,255,255,0.42)", "rgba(255,255,255,0.2)"]
      : ["rgba(255,255,255,0.38)", "rgba(255,255,255,0.16)", "rgba(255,255,255,0.08)"]
    : frameless
    ? ["rgba(0,0,0,0.26)", "rgba(0,0,0,0.16)", "rgba(0,0,0,0.1)"]
    : ["rgba(0,0,0,0.16)", "rgba(0,0,0,0.08)", "rgba(0,0,0,0.04)"];

  const secondaryFill = frameless
    ? isDark
      ? "rgba(255,255,255,0.18)"
      : "rgba(0,0,0,0.14)"
    : isDark
    ? "rgba(255,255,255,0.04)"
    : "rgba(0,0,0,0.04)";

  const outlineColor = frameless
    ? isDark
      ? "rgba(255,255,255,0.58)"
      : "rgba(0,0,0,0.45)"
    : isDark
    ? "rgba(255,255,255,0.28)"
    : "rgba(0,0,0,0.28)";

  const outlineWidth = frameless ? 0.14 : 0.08;
  const glowOpacity = frameless ? (isDark ? 0.6 : 0.4) : (isDark ? 0.4 : 0.25);

  return (
    <div
      className={clsx(
        "relative flex w-full flex-col items-center gap-4 transition-colors duration-500",
        isDark ? "text-white" : "text-[#1a1a1a]",
        className,
      )}
    >
      <div className={frameClassName}>
        {status === "revealing" && (
          <div className="unlock-surge pointer-events-none absolute inset-0" />
        )}
        <div className={canvasClassName}>
          <div className={clsx("absolute inset-0 transition-[filter]", paddingClass)}>
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
                strokeWidth={outlineWidth}
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
      {showLabel && (
        <div className="flex flex-col items-center gap-1 text-center text-xs uppercase tracking-[0.32em]">
          <span className="opacity-60">layout unlocked</span>
          <span className="font-semibold tracking-[0.24em]">
            {layout.label}
          </span>
        </div>
      )}
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
