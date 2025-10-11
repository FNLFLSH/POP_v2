'use client';

import { useMemo } from "react";
import clsx from "clsx";
import type { GeneratedLayout } from "@/lib/layoutEngine";

type PreviewStatus = "generating" | "revealing" | "ready" | "packing";

const ACCENT_SYMBOL: Record<string, string> = {
  entrance: "↘",
  stage: "▲",
  bar: "◎",
};

export function GeneratedLayoutPreview({
  layout,
  theme,
  status = "ready",
  showLabel = true,
}: {
  layout: GeneratedLayout;
  theme: "dark" | "light";
  status?: PreviewStatus;
  showLabel?: boolean;
}) {
  const isDark = theme === "dark";

  const filledCells = useMemo(() => {
    const set = new Set<string>();
    layout.cells.forEach((cell) => set.add(`${cell.row}-${cell.col}`));
    return set;
  }, [layout.cells]);

  const accentCells = useMemo(() => {
    const map = new Map<string, string>();
    (layout.accents || []).forEach((cell) => {
      map.set(`${cell.row}-${cell.col}`, cell.tag ?? "");
    });
    return map;
  }, [layout.accents]);

  const totalCells = layout.gridSize * layout.gridSize;

  return (
    <div
      className={clsx(
        "relative flex w-full flex-col items-center gap-4 transition-colors duration-500",
        isDark ? "text-white" : "text-[#1a1a1a]"
      )}
    >
      <div
        className={clsx(
          "relative w-full max-w-[340px] overflow-hidden rounded-[32px] border p-6 transition-all duration-500 backdrop-blur",
          {
            "plan-pack": status === "packing",
            "plan-reveal": status === "revealing",
            "plan-loading": status === "generating",
            "plan-rest": status === "ready" || status === "generating",
          },
          isDark
            ? "border-white/12 bg-black/50 shadow-[0_30px_70px_rgba(0,0,0,0.45)]"
            : "border-black/10 bg-white/70 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
        )}
      >
        {status === "revealing" && (
          <div className="unlock-surge pointer-events-none absolute inset-0" />
        )}
        <div
          className={clsx(
            "relative mx-auto aspect-square w-full overflow-hidden rounded-[28px] border transition-all duration-500",
            isDark
              ? "border-white/8 bg-gradient-to-br from-white/5 via-black/20 to-black/50"
              : "border-black/10 bg-gradient-to-br from-white/80 via-white/60 to-[#f0f0f0]"
          )}
        >
          <div
            className="absolute inset-0 grid gap-[6px] p-6 transition-[filter]"
            style={{
              gridTemplateColumns: `repeat(${layout.gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${layout.gridSize}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: totalCells }).map((_, index) => {
              const row = Math.floor(index / layout.gridSize);
              const col = index % layout.gridSize;
              const key = `${row}-${col}`;
              const isFilled = filledCells.has(key);
              const accentTag = accentCells.get(key);

              return (
                <div
                  key={key}
                  className={clsx(
                    "relative flex items-center justify-center rounded-[10px] border text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-500",
                    isFilled
                      ? isDark
                        ? "border-white/20 bg-white/12 shadow-[0_0_18px_rgba(255,255,255,0.12)]"
                        : "border-black/15 bg-black/8 shadow-[0_0_18px_rgba(0,0,0,0.08)]"
                      : isDark
                      ? "border-white/6 bg-black/5"
                      : "border-black/5 bg-white/40"
                  )}
                >
                  {accentTag ? (
                    <span
                      className={clsx(
                        "pointer-events-none text-[0.7rem] transition-colors duration-500",
                        isDark ? "text-white/90" : "text-black/80"
                      )}
                    >
                      {ACCENT_SYMBOL[accentTag] ?? "•"}
                    </span>
                  ) : null}
                </div>
              );
            })}
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
