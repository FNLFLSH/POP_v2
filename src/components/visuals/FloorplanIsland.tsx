type Coordinate = [number, number];

export type Footprint = {
  coordinates: Coordinate[];
  properties?: Record<string, unknown>;
};

type FloorplanIslandProps = {
  footprint?: Footprint;
  address?: string;
  status?: string;
  loading?: boolean;
  error?: string | null;
};

export function FloorplanIsland({ footprint, address, status, loading, error }: FloorplanIslandProps) {
  const coordinates = footprint?.coordinates ?? [];
  const { path, centroid, svgCoords } = buildPath(coordinates);

  return (
    <div className="relative isolate flex w-full flex-col items-center gap-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-black/20 to-black/30 p-8 shadow-[0_0_50px_rgba(0,0,0,0.35)]">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.35em] text-white/50">address locked</div>
        <div className="mt-2 text-xl font-semibold text-white">{address}</div>
        <div className="text-xs uppercase tracking-[0.35em] text-white/40">
          {loading ? "rendering island layout" : status || "designlab output"}
        </div>
      </div>

      <div className="relative flex w-full max-w-[540px] flex-col items-center">
        <div className="absolute -top-6 h-10 w-36 rounded-full bg-gradient-to-b from-white/40 to-white/0 blur-3xl opacity-60" />
        <div className="relative w-full overflow-hidden rounded-[40px] border border-white/15 bg-gradient-to-b from-[#1b1b1b] via-[#121212] to-[#050505] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.65)]">
          <div className="absolute inset-6 rounded-[28px] border border-white/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(0,0,0,0.85))]" />
          <div className="relative">
            <svg
              className="mx-auto block h-64 w-full max-w-[360px]"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="layoutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f7f7f7" stopOpacity="0.85" />
                  <stop offset="1" stopColor="#a3a3a3" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <g>
                <ellipse cx="50" cy="88" rx="34" ry="8" fill="rgba(0,0,0,0.25)" />
              </g>
              {path ? (
                <g>
                  <path
                    d={path}
                    fill="url(#layoutGradient)"
                    stroke="rgba(255,255,255,0.35)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                  />
                  <circle cx={centroid.x} cy={centroid.y} r={2} fill="#ffffff" opacity={0.65} />
                  {svgCoords.map(([x, y], index) => (
                    <rect
                      key={`${x}-${y}-${index}`}
                      x={x - 1.5}
                      y={y - 1.5}
                      width={3}
                      height={3}
                      rx={0.8}
                      fill="#ffffff"
                      opacity={0.45}
                    />
                  ))}
                </g>
              ) : (
                <g>
                  <rect x="30" y="30" width="40" height="40" rx="6" ry="6" fill="url(#layoutGradient)" stroke="rgba(255,255,255,0.25)" strokeDasharray="4 4" />
                  <circle cx="50" cy="50" r="3" fill="#ffffff" opacity={0.5} />
                </g>
              )}
            </svg>
          </div>
        </div>

        <div className="mt-6 grid w-full grid-cols-3 gap-3 text-xs text-white/60">
          <IslandStat label="segments" value={coordinates.length ? `${coordinates.length} pts` : "4 pts"} />
          <IslandStat label="status" value={loading ? "rendering" : error ? "fallback" : "generated"} />
          <IslandStat label="lat / lon" value={centroid.latLonLabel} />
        </div>
      </div>
    </div>
  );
}

function IslandStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center">
      <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">{label}</div>
      <div className="text-sm text-white/80">{value}</div>
    </div>
  );
}

function buildPath(coordinates: Coordinate[]) {
  if (coordinates.length < 3) {
    return {
      path: "",
      centroid: { x: 50, y: 50, latLonLabel: "n/a" },
      svgCoords: [] as [number, number][],
    };
  }

  const lats = coordinates.map(([, lat]) => lat);
  const lons = coordinates.map(([lon]) => lon);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  const latRange = maxLat - minLat || 1;
  const lonRange = maxLon - minLon || 1;

  const svgCoords = coordinates.map(([lon, lat]) => {
    const x = ((lon - minLon) / lonRange) * 60 + 20;
    const y = 80 - ((lat - minLat) / latRange) * 60;
    return [parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2))] as [number, number];
  });

  const points = svgCoords.map(([x, y]) => `${x},${y}`);

  const path = `M ${points.join(" L ")} Z`;

  const centroidX = points
    .map((point) => parseFloat(point.split(",")[0]))
    .reduce((sum, x) => sum + x, 0) / points.length;

  const centroidY = points
    .map((point) => parseFloat(point.split(",")[1]))
    .reduce((sum, y) => sum + y, 0) / points.length;

  const centroidLon = (minLon + maxLon) / 2;
  const centroidLat = (minLat + maxLat) / 2;

  return {
    path,
    centroid: {
      x: centroidX,
      y: centroidY,
      latLonLabel: `${centroidLat.toFixed(3)}, ${centroidLon.toFixed(3)}`,
    },
    svgCoords,
  };
}
