'use client';

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FloorplanIsland } from "@/components/visuals/FloorplanIsland";
import { BeaconPin } from "@/components/icons/BeaconPin";

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

  const address =
    venueData?.geocode?.display_name ||
    params.get("address") ||
    "POP Venue Unlock";

  const handleReturnHome = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("popSkipLanding", "true");
    }
  };

  return (
    <div className="h-screen w-screen bg-[#111111] text-white overflow-hidden">
      <div className="relative h-full w-full">
        <DottedPaperBackdrop />

        <div className="relative h-full w-full">
          <div className="h-full bg-gradient-to-b from-[#1b1b1b] via-[#242424] to-[#0e0e0e] shadow-[0_0_50px_rgba(0,0,0,0.55)]">
            <div className="relative px-8 pt-10 pb-6 z-10">
              <Link
                href="/"
                onClick={handleReturnHome}
                className="absolute left-8 top-8 flex items-center space-x-2 rounded-full border border-gray-600/40 bg-[#333333]/70 px-4 py-2 text-xs uppercase tracking-[0.34em] text-gray-300/75 transition hover:border-gray-500/70 hover:text-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back Home</span>
              </Link>

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

            <div className="relative z-10 flex h-[calc(100%-220px)] w-full flex-col items-center gap-12 px-6 pb-14">
              <FloorplanIsland
                footprint={venueData?.footprint}
                address={address}
                status={loading ? "Generating volumetric shell" : error ? "Fallback layout" : "Layout unlocked"}
                loading={loading}
                error={error}
              />

              <div className="flex flex-col items-center gap-6 text-center">
                {saveError && (
                  <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs text-red-100">
                    {saveError}
                  </div>
                )}
                <div className="text-xs uppercase tracking-[0.4em] text-white/50">Send to DesignLabz Suite</div>
                <Link
                  href={`/designlabs?address=${encodeURIComponent(address)}`}
                  onClick={(event) => handleLaunchDesignLabz(event)}
                  className={`transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                    saving || loading ? "pointer-events-none opacity-40" : ""
                  }`}
                  aria-label="Launch DesignLabz Suite"
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
