import { useMemo } from "react";

type Coordinate = [number, number];

export interface VenueHoloboxProps {
  address?: string;
  buildingType?: string;
  footprint?: {
    coordinates: Coordinate[];
  };
  highlight?: boolean;
}

export function VenueHolobox({
  address,
  buildingType,
  footprint,
  highlight,
}: VenueHoloboxProps) {
  const { width, depth, height } = useMemo(() => {
    if (!footprint?.coordinates || footprint.coordinates.length < 3) {
      return { width: 120, depth: 90, height: 80 };
    }

    const lons = footprint.coordinates.map((c) => c[0]);
    const lats = footprint.coordinates.map((c) => c[1]);
    const lonSpread = Math.max(...lons) - Math.min(...lons);
    const latSpread = Math.max(...lats) - Math.min(...lats);

    // Normalise the coordinate spread into a relative scale
    const widthScale = Math.min(Math.max(lonSpread * 8000, 80), 200);
    const depthScale = Math.min(Math.max(latSpread * 8000, 80), 200);
    const baseHeight = Math.max((widthScale + depthScale) / 4, 70);

    return { width: widthScale, depth: depthScale, height: baseHeight };
  }, [footprint]);

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <div className="relative h-[320px] w-full [perspective:1200px]">
        <div
          className="absolute left-1/2 top-1/2 flex h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-b from-[rgba(120,120,120,0.55)] via-[rgba(50,50,50,0.65)] to-[rgba(12,12,12,0.85)] blur-3xl"
          style={{ filter: highlight ? "brightness(1.2)" : "brightness(0.8)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
          style={{
            transform: "rotateX(63deg) rotateZ(-35deg)",
          }}
        >
          <div className="absolute inset-0 rounded-[40px] border border-[#3d3d3d] bg-gradient-to-b from-[rgba(240,240,240,0.05)] to-[rgba(20,20,20,0.88)] shadow-[0_0_25px_rgba(0,0,0,0.35)]" />
          <div
            className="absolute inset-[18%] rounded-[28px] border border-[#4b4b4b] bg-[rgba(26,26,26,0.9)] shadow-[0_0_18px_rgba(0,0,0,0.3)] [transform-style:preserve-3d]"
            style={{ transform: "translateZ(6px)" }}
          >
            <div className="absolute inset-0 rounded-[28px] opacity-25" style={{ backgroundImage: "linear-gradient(0deg, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          </div>
          <div
            className="absolute left-1/2 top-1/2 rounded-xl bg-gradient-to-br from-[#ececec] via-[#bbbbbb] to-[#7a7a7a] shadow-[0_0_22px_rgba(0,0,0,0.35)] [transform-style:preserve-3d]"
            style={{
              width: `${width}px`,
              height: `${depth}px`,
              transform: "translate3d(-50%, -50%, 0) translateZ(24px)",
            }}
          >
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-[rgba(255,255,255,0.12)] to-[rgba(255,255,255,0.0)]"
              style={{ transform: `translateZ(${height}px)` }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-2 rounded-b-xl bg-[rgba(0,0,0,0.55)] blur-[6px]"
              style={{ transform: "translateZ(-4px) rotateX(90deg)" }}
            />
            <div
              className="absolute inset-x-0 top-0 h-2 rounded-t-xl bg-[rgba(255,255,255,0.25)] blur-[4px]"
              style={{ transform: `translateZ(${height + 6}px)` }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        {address && (
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-gray-400/80">
            {address}
          </p>
        )}
        <p className="text-lg font-semibold text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]">
          {buildingType || "Unlocked Venue"}
        </p>
        <p className="text-xs text-gray-300/70">
          {highlight
            ? "Prime access granted. Launch DesignLabz Suite."
            : "Step into DesignLabz to build your experience."}
        </p>
      </div>
    </div>
  );
}
