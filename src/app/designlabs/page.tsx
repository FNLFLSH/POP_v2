'use client';

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Compass,
  Sparkle,
  Maximize2,
  Wand2,
  Minimize2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { VenueHolobox } from "@/components/visuals/VenueHolobox";

type VenueRecord = {
  id: string;
  address: string;
  geocode?: { lat: number; lon: number; display_name: string };
  footprint?: { coordinates: [number, number][]; properties?: Record<string, unknown> };
  created_at?: string;
};

const PLACEHOLDER_VENUES: VenueRecord[] = [
  { id: "future-01", address: "Soho Warehouse — Coming Soon" },
  { id: "future-02", address: "Brooklyn Rooftop — Coming Soon" },
  { id: "future-03", address: "Downtown Station — Coming Soon" },
];

const TOOLKIT = [
  { id: "bar", name: "Bar Station", icon: "🍸", label: "Bar Station", hint: "Drag to place" },
  { id: "stage", name: "Stage", icon: "🎤", label: "Stage", hint: "Drag to place" },
  { id: "table", name: "Vendor Table", icon: "🛍️", label: "Vendor Table", hint: "Drag to place" },
  { id: "seating", name: "Seating Area", icon: "🪑", label: "Seating Area", hint: "Drag to place" },
  { id: "entrance", name: "Entrance", icon: "🚪", label: "Entrance", hint: "Drag to place" },
  { id: "restroom", name: "Restroom", icon: "🚻", label: "Restroom", hint: "Drag to place" },
];

export default function DesignLabsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DesignLabsContent />
    </Suspense>
  );
}

function DesignLabsContent() {
  const [venues, setVenues] = useState<VenueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [isCardExpanded, setIsCardExpanded] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const params = useSearchParams();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/venues");
        if (!response.ok) {
          throw new Error("Unable to load DesignLabz venues");
        }
        const payload = await response.json();
        setVenues(payload?.data || []);
        const highlight = params.get("highlight");
        if (highlight) {
          setSelectedVenueId(highlight);
        } else if ((payload?.data || []).length > 0) {
          setSelectedVenueId(payload.data[0].id);
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "DesignLabz labs failed to load.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [params]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCardClick = (venueId: string) => {
    if (isCardExpanded === venueId) {
      setIsCardExpanded(null);
    } else {
      setIsCardExpanded(venueId);
      setSelectedVenueId(venueId);
    }
  };

  const deck = useMemo(() => {
    if (venues.length === 0) {
      return PLACEHOLDER_VENUES;
    }
    return [...venues, ...PLACEHOLDER_VENUES];
  }, [venues]);

  const selectedVenue = useMemo(() => {
    if (!selectedVenueId) {
      return venues[0] || null;
    }
    return venues.find((v) => v.id === selectedVenueId) || venues[0] || null;
  }, [selectedVenueId, venues]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const offset = direction === "left" ? -320 : 320;
    carouselRef.current.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleReturnHome = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("popSkipLanding", "true");
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
    requestAnimationFrame(() => {
      workspaceRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
  };

  return (
    <div className="h-screen w-screen bg-[#101010] text-white overflow-hidden">
      <div className="relative h-full w-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(0,0,0,0.92))]" />

        <div className="relative h-full w-full">
          <div 
            className="flex h-full flex-col bg-gradient-to-b from-[#181818] via-[#202020] to-[#0b0b0b] shadow-[0_0_60px_rgba(0,0,0,0.32)]"
            style={{
              transform: `translateY(${scrollPosition * 0.1}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {!isFullScreen && (
              <header className="relative z-10 px-8 pb-6 pt-10">
                <Link
                  href="/"
                  onClick={handleReturnHome}
                  className="absolute left-8 top-9 flex items-center space-x-2 rounded-full border border-gray-600/30 bg-[#333333]/60 px-4 py-2 text-xs uppercase tracking-[0.34em] text-gray-300/70 transition hover:border-gray-500/60 hover:text-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back Home</span>
                </Link>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.32em] text-white/70">
                    <Compass className="h-3.5 w-3.5" />
                    <span>DesignLabz island grid</span>
                  </div>
                  <h1 className="text-center text-[38px] sm:text-[52px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#d4d4d4] to-[#9f9f9f] drop-shadow-[0_0_30px_rgba(200,200,200,0.4)]">
                    Build your next event
                  </h1>
                  <p className="max-w-3xl text-center text-sm text-white/70">
                    Choose an unlocked venue, glide across the gridded landscape, and post up where the layout feels right.
                    Additional islands drop soon—tap a card to highlight the space you want to remix.
                  </p>
                </div>
                <button
                  onClick={toggleFullScreen}
                  className="absolute right-8 top-9 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/70 transition hover:bg-white/15"
                >
                  <Maximize2 className="h-4 w-4" />
                  Fullscreen
                </button>
              </header>
            )}

            {!isFullScreen && (
              <section className="relative z-10 px-6">
                <div className="relative rounded-3xl border border-gray-500/30 bg-[#333333]/70 px-6 py-5 shadow-[0_0_40px_rgba(100,100,100,0.25)]">
                  <button
                    onClick={() => scrollCarousel("left")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-gray-500/30 bg-[#444444]/80 p-2 text-gray-300/70 transition hover:border-gray-400/60 hover:text-gray-100"
                    aria-label="Scroll venues backwards"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div
                    ref={carouselRef}
                    className="scrollbar-thin flex gap-4 overflow-x-auto px-8 py-2"
                  >
                    {deck.map((venue) => {
                      const isUnlocked = venues.some((v) => v.id === venue.id);
                      const isActive = venue.id === selectedVenue?.id;
                      return (
                        <button
                          key={venue.id}
                          onClick={() => handleCardClick(venue.id)}
                          className={`min-w-[220px] rounded-2xl border px-4 py-5 text-left transition-all duration-300 transform hover:scale-105 ${
                            isUnlocked
                              ? "border-gray-500/40 bg-gradient-to-br from-[rgba(60,60,60,0.8)] to-[rgba(100,100,100,0.35)] text-white hover:shadow-[0_0_26px_rgba(150,150,150,0.45)]"
                              : "border-gray-500/20 bg-[#333333]/80 text-gray-300/40"
                          } ${isActive ? "ring-2 ring-gray-300/80" : ""} ${
                            isCardExpanded === venue.id
                              ? "scale-110 z-50 shadow-[0_0_40px_rgba(150,150,150,0.6)]"
                              : ""
                          }`}
                          style={{
                            transform: isCardExpanded === venue.id
                              ? "perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(20px)"
                              : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          <div className="text-[11px] uppercase tracking-[0.4em] text-gray-300/70">
                            {isUnlocked ? "Unlocked" : "Coming Soon"}
                          </div>
                          <div className="mt-3 text-sm font-semibold leading-tight">
                            {venue.address}
                          </div>
                          {isUnlocked && (
                            <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-300/80">
                              <Sparkle className="h-4 w-4" />
                              <span>{venue.geocode?.display_name?.split(",")[0] || "Custom Coordinates"}</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => scrollCarousel("right")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-gray-500/30 bg-[#444444]/80 p-2 text-gray-300/70 transition hover:border-gray-400/60 hover:text-gray-100"
                    aria-label="Scroll venues forwards"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </section>
            )}

            <main className={`relative z-0 flex-1 overflow-hidden ${isFullScreen ? "px-0 pb-0 pt-0" : "px-6 pb-10 pt-6"}`}>
              <section
                className={`relative h-full overflow-hidden rounded-[34px] border border-white/10 bg-[#101010] shadow-[0_0_60px_rgba(0,0,0,0.2)] transition-all ${
                  isFullScreen ? "rounded-none border-white/5" : ""
                }`}
              >
                <div
                  ref={workspaceRef}
                  className="absolute inset-0 overflow-auto"
                >
                  <div
                    className="relative"
                    style={{
                      minWidth: "3600px",
                      minHeight: "3600px",
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent 0 34px, rgba(120,120,120,0.2) 34px 35px), repeating-linear-gradient(90deg, transparent 0 34px, rgba(120,120,120,0.2) 34px 35px)",
                      backgroundSize: "35px 35px",
                      backgroundColor: "rgba(0,0,0,0.65)",
                    }}
                  >
                    <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
                      <div className="pointer-events-auto rounded-[42px] border border-white/12 bg-gradient-to-b from-white/10 via-black/30 to-black/40 px-10 py-8 shadow-[0_0_60px_rgba(0,0,0,0.55)] backdrop-blur-sm float-animation">
                        {selectedVenue ? (
                          <VenueHolobox
                            address={selectedVenue.address}
                            buildingType={
                              selectedVenue.footprint?.properties?.building_type as string
                            }
                            footprint={selectedVenue.footprint}
                            highlight
                          />
                        ) : (
                          <div className="flex h-52 w-80 items-center justify-center text-sm text-gray-300/70">
                            {loading
                              ? "Loading the suite..."
                              : "Unlock a venue to render its island."}
                          </div>
                        )}
                      </div>
                      <div className="rounded-full border border-white/15 bg-white/10 px-6 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
                        infinite canvas — drag to explore
                      </div>

                    </div>
                    <ToolkitPanel
                      isFullScreen={isFullScreen}
                      toggleFullScreen={toggleFullScreen}
                    />
                  </div>
                </div>
              </section>
            </main>

            {error && (
              <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center">
                <div className="pointer-events-auto rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs text-red-100">
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Dotted paper background (outside the main board) */
function ToolkitPanel({ isFullScreen, toggleFullScreen }: { isFullScreen: boolean; toggleFullScreen: () => void }) {
  return (
    <div className="pointer-events-auto absolute left-6 top-6 flex w-64 flex-col gap-3 rounded-3xl border border-white/10 bg-black/50 px-5 py-4 shadow-[0_0_30px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-white/70">
        <Wand2 className="h-4 w-4" />
        <span>Toolkit islands</span>
      </div>
      <ul className="space-y-2 text-xs">
        {TOOLKIT.map((tool) => (
          <li
            key={tool.id}
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white/75 transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="text-sm font-semibold text-white">{tool.label}</div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/40">{tool.hint}</div>
          </li>
        ))}
      </ul>
      <button
        onClick={toggleFullScreen}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/70 transition hover:bg-white/15"
      >
        {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        {isFullScreen ? "Exit fullscreen" : "Fullscreen grid"}
      </button>
    </div>
  );
}
