'use client';

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useEffect, useState, Suspense, useMemo } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building3D } from "@/components/visuals/Building3D";
import { BeaconPin } from "@/components/icons/BeaconPin";
import GlobalThemeToggle from "@/components/common/GlobalThemeToggle";

type VenuePayload = {
  geocode: { lat: number; lon: number; display_name: string; address: string };
  footprint: { coordinates: [number, number][]; properties?: Record<string, unknown> };
};

export default function VenueBlueprintPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VenueBlueprintContent />
    </Suspense>
  );
}

function VenueBlueprintContent() {
  const [venueData, setVenueData] = useState<VenuePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const address =
      params.get("address") ||
      localStorage.getItem("venueAddress") ||
      "123 Main St, New York, NY";

    // Store the original searched address
    if (typeof window !== 'undefined' && address) {
      sessionStorage.setItem('popOriginalAddress', address);
    }

    fetchVenueData(address);
  }, [params]);

  const fetchVenueData = async (address: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching venue data for:', address);

      // Use the new Supabase-backed venue API
      const response = await fetch('/api/venue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch venue data');
      }

      const venueData = await response.json();
      console.log('Venue data received:', venueData);

      setVenueData({
        geocode: {
          lat: venueData.lat,
          lon: venueData.lon,
          display_name: venueData.display_name,
          address: venueData.address
        },
        footprint: venueData.building_footprint
      });
    } catch (err) {
      console.error("Error fetching venue data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load venue data",
      );
      const fallbackFootprint = {
        coordinates: [
          [-74.006, 40.7128] as [number, number],
          [-74.004, 40.7128] as [number, number],
          [-74.004, 40.7144] as [number, number],
          [-74.006, 40.7144] as [number, number],
        ],
        properties: {
          building_type: "Concept Shell",
        },
      };
      setVenueData({
        geocode: {
          display_name: address,
          lat: 40.7128,
          lon: -74.006,
          address: address,
        },
        footprint: fallbackFootprint,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchDesignLabz = async (
    event: ReactMouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    if (!venueData || saving) return;

    const baseAddress =
      venueData.geocode?.display_name ||
      params.get("address") ||
      "Unlocked Venue";

    const fallbackTarget = `/designlabs?address=${encodeURIComponent(baseAddress)}`;

    try {
      setSaveError(null);
      setSaving(true);

      const response = await fetch("/api/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: baseAddress,
          geocode: venueData.geocode,
          footprint: venueData.footprint,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to store venue pathway");
      }

      const payload = await response.json();
      const venueId = payload?.data?.id || payload?.id;
      const nextTarget = venueId ? `/designlabs?highlight=${venueId}` : fallbackTarget;
      router.push(nextTarget);
    } catch (err) {
      console.error("Error saving venue:", err);
      setSaveError(
        err instanceof Error ? err.message : "Failed to save venue layout",
      );
      router.push(fallbackTarget);
    } finally {
      setSaving(false);
    }
  };

  // Get the original searched address, fallback to display_name or params
  const address = useMemo(() => {
    if (typeof window !== 'undefined') {
      const originalAddress = sessionStorage.getItem('popOriginalAddress');
      if (originalAddress) {
        return originalAddress;
      }
    }
    return params.get("address") || venueData?.geocode?.display_name || "POP Venue Unlock";
  }, [params, venueData]);


  return (
    <div className="h-screen w-screen bg-[#111111] text-white overflow-hidden">
      <GlobalThemeToggle />
      <div className="relative h-full w-full">
        <DottedPaperBackdrop />

        <div className="relative h-full w-full">
          <div className="h-full bg-gradient-to-b from-[#1b1b1b] via-[#242424] to-[#0e0e0e] shadow-[0_0_50px_rgba(0,0,0,0.55)]">
            <div className="relative px-8 pt-10 pb-6 z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 rounded-full border border-gray-500/40 px-4 py-1 text-xs uppercase tracking-[0.35em] text-gray-300/70">
                  <Sparkles className="h-3.5 w-3.5 text-gray-200" />
                  <span>Location unlocked</span>
                </div>
                <h1 className="text-center text-[40px] sm:text-[54px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#d9d9d9] to-[#a6a6a6] drop-shadow-[0_0_30px_rgba(180,180,180,0.35)]">
                  Venue Blueprint Portal
                </h1>
                <p className="max-w-2xl text-center text-sm text-gray-300/70">
                  We mapped your address, converted it into a volumetric shell,
                  and staged it for DesignLabz. Review the 3D render and launch
                  the suite to start orchestrating the experience.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex h-[calc(100%-220px)] w-full flex-col items-center gap-8 px-6 pb-8">
              <div className="w-full max-w-6xl h-[calc(100vh-240px)] min-h-[600px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-white/70">
                    <div className="text-center">
                      <div className="text-sm uppercase tracking-[0.35em] mb-2">Loading building...</div>
                      <div className="text-xs text-white/50">Generating 3D volumetric shell</div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full text-red-300/70">
                    <div className="text-center">
                      <div className="text-sm uppercase tracking-[0.35em] mb-2">Error loading building</div>
                      <div className="text-xs text-red-300/50">Using fallback layout</div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Building3D
                      footprint={venueData?.footprint}
                      address={address}
                      height={15}
                      wireframe={false}
                    />
                    {/* Instructions Overlay */}
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg border border-white/20 p-4 max-w-xs text-white text-sm z-10">
                      <h3 className="font-semibold mb-2 text-xs uppercase tracking-wider">3D Controls</h3>
                      <ul className="space-y-1.5 text-xs">
                        <li className="flex items-start gap-2">
                          <span className="text-white/60">•</span>
                          <span><strong>Rotate:</strong> Click & drag</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-white/60">•</span>
                          <span><strong>Zoom:</strong> Scroll wheel</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-white/60">•</span>
                          <span><strong>Pan:</strong> Right-click & drag</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-6 text-center">
                {saveError && (
                  <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs text-red-100">
                    {saveError}
                  </div>
                )}
                <div className="text-xs uppercase tracking-[0.4em] text-white/50">Send to DesignLabz Suite</div>
                <Link
                  href={`/designlabs?address=${encodeURIComponent(address)}&fullscreen=1`}
                  onClick={(event) => {
                    handleLaunchDesignLabz(event);
                    // Store footprint data for design lab
                    if (venueData?.footprint && typeof window !== 'undefined') {
                      sessionStorage.setItem('popBuildingFootprint', JSON.stringify({
                        footprint: venueData.footprint,
                        address: address,
                        geocode: venueData.geocode,
                      }));
                    }
                  }}
                  className={`transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                    saving || loading ? "pointer-events-none opacity-40" : ""
                  }`}
                  aria-label="Launch DesignLabz Suite Full Screen"
                >
                  <BeaconPin aria-hidden animated={false} className="h-20 w-20" />
                </Link>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-t from-[#080808] via-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Dotted paper background (outside the main board) */
function DottedPaperBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
        backgroundPosition: "-9px -9px",
      }}
    >
      {/* Rounded corner squiggle (top-right) */}
      <div className="absolute right-2 top-2 h-10 w-10 rounded-tl-[22px] border-l-2 border-t-2 border-white/30" />
    </div>
  );
}
