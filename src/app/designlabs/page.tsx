'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkle,
  Maximize2,
  Wand2,
  Minimize2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { VenueHolobox } from "@/components/visuals/VenueHolobox";
import GlobalThemeToggle from "@/components/common/GlobalThemeToggle";
import { GeneratedLayoutPreview } from "@/components/floorplan/GeneratedLayoutPreview";
import { type GeneratedLayout } from "@/lib/layoutEngine";
import { useThemeContext } from "@/components/providers/ThemeProvider";

type VenueRecord = {
  id: string;
  address: string;
  geocode?: { lat: number; lon: number; display_name: string };
  footprint?: { coordinates: [number, number][]; properties?: Record<string, unknown> };
  created_at?: string;
};

type StoredLayoutPayload = {
  layout: GeneratedLayout;
  address: string;
  theme?: string;
  timestamp?: number;
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
  const [toolkitPosition, setToolkitPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [prefilledLayout, setPrefilledLayout] = useState<StoredLayoutPayload | null>(null);
  const [layoutPreviewStatus, setLayoutPreviewStatus] = useState<"generating" | "revealing" | "ready" | "packing">("ready");
  const carouselRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const params = useSearchParams();
  const { theme } = useThemeContext();
  const isDarkTheme = theme === "dark";
  const prefillFlag = params.get("prefillLayout");

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
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem("popGeneratedLayout");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as StoredLayoutPayload;
      if (parsed && parsed.layout) {
        setPrefilledLayout(parsed);
      }
    } catch (err) {
      console.error("Unable to parse stored layout payload", err);
    } finally {
      sessionStorage.removeItem("popGeneratedLayout");
    }
  }, []);

  useEffect(() => {
    if (!prefilledLayout) return;
    setLayoutPreviewStatus("revealing");
    const timeout = setTimeout(() => setLayoutPreviewStatus("ready"), 900);
    return () => clearTimeout(timeout);
  }, [prefilledLayout]);

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
  const workspaceBackdropStyle = isDarkTheme
    ? {
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent 0 34px, rgba(120,120,120,0.2) 34px 35px), repeating-linear-gradient(90deg, transparent 0 34px, rgba(120,120,120,0.2) 34px 35px)",
        backgroundSize: "35px 35px",
        backgroundColor: "rgba(0,0,0,0.65)",
      }
    : {
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent 0 34px, rgba(30,30,30,0.08) 34px 35px), repeating-linear-gradient(90deg, transparent 0 34px, rgba(30,30,30,0.08) 34px 35px)",
        backgroundSize: "35px 35px",
        backgroundColor: "rgba(255,255,255,0.85)",
      };

  useEffect(() => {
    if (!prefilledLayout && !prefillFlag) return;
    setIsFullScreen(true);
    if (!workspaceRef.current) return;

    requestAnimationFrame(() => {
      const element = workspaceRef.current;
      if (!element) return;
      const centerX = Math.max(
        0,
        element.scrollWidth / 2 - element.clientWidth / 2,
      );
      const centerY = Math.max(
        0,
        element.scrollHeight / 2 - element.clientHeight / 2,
      );
      element.scrollTo({
        left: centerX,
        top: centerY,
        behavior: "smooth",
      });
    });
  }, [prefilledLayout, prefillFlag]);

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

  // Determine if toolkit should be horizontal or vertical based on position
  const getToolkitOrientation = () => {
    if (!workspaceRef.current) return 'vertical';
    
    const containerRect = workspaceRef.current.getBoundingClientRect();
    const centerY = containerRect.height / 2;
    
    // If toolkit is positioned in top or bottom half, make it horizontal
    if (toolkitPosition.y < centerY - 100 || toolkitPosition.y > centerY + 100) {
      return 'horizontal';
    }
    // Otherwise, keep it vertical (left/right sides)
    return 'vertical';
  };

  const handleToolkitMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - toolkitPosition.x,
      y: e.clientY - toolkitPosition.y,
    });
  };

  const handleToolkitMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Constrain to workspace bounds
    if (workspaceRef.current) {
      const containerRect = workspaceRef.current.getBoundingClientRect();
      const toolkitWidth = 256; // w-64 = 16rem = 256px
      const toolkitHeight = getToolkitOrientation() === 'horizontal' ? 120 : 400;
      
      const constrainedX = Math.max(0, Math.min(newX, containerRect.width - toolkitWidth));
      const constrainedY = Math.max(0, Math.min(newY, containerRect.height - toolkitHeight));
      
      setToolkitPosition({ x: constrainedX, y: constrainedY });
    }
  };

  const handleToolkitMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        if (workspaceRef.current) {
          const containerRect = workspaceRef.current.getBoundingClientRect();
          const toolkitWidth = 256;
          const toolkitHeight = getToolkitOrientation() === 'horizontal' ? 120 : 400;
          
          const constrainedX = Math.max(0, Math.min(newX, containerRect.width - toolkitWidth));
          const constrainedY = Math.max(0, Math.min(newY, containerRect.height - toolkitHeight));
          
          setToolkitPosition({ x: constrainedX, y: constrainedY });
        }
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, toolkitPosition]);

  return (
    <div
      className={clsx(
        "h-screen w-screen overflow-hidden transition-colors duration-500",
        isDarkTheme ? "bg-[#101010] text-white" : "bg-[#f5f5f5] text-[#1a1a1a]"
      )}
    >
      <GlobalThemeToggle />
      <div className="relative h-full w-full">
        <div
          className={clsx(
            "absolute inset-0 transition-colors duration-500",
            isDarkTheme
              ? "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),rgba(0,0,0,0.92))]"
              : "bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),rgba(255,255,255,0.95))]"
          )}
        />

        <div className="relative h-full w-full">
          <div 
            className={clsx(
              "flex h-full flex-col shadow-[0_0_60px_rgba(0,0,0,0.32)] transition-colors duration-500",
              isDarkTheme
                ? "bg-gradient-to-b from-[#181818] via-[#202020] to-[#0b0b0b]"
                : "bg-gradient-to-b from-white via-[#f7f7f7] to-[#eaeaea]"
            )}
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
                  className={clsx(
                    "absolute left-8 top-9 flex items-center space-x-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.34em] transition focus-visible:outline-none focus-visible:ring-2",
                    isDarkTheme
                      ? "border-gray-600/30 bg-[#333333]/60 text-gray-300/70 hover:border-gray-400/60 hover:text-gray-100 focus-visible:ring-white/20"
                      : "border-black/10 bg-white/70 text-black/60 hover:border-black/20 hover:text-black focus-visible:ring-black/20"
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back Home</span>
                </Link>
                <div className="flex flex-col items-center gap-4">
                  <div
                    className={clsx(
                      "flex items-center gap-2 rounded-full border px-4 py-1 text-xs uppercase tracking-[0.32em] transition-colors duration-500",
                      isDarkTheme
                        ? "border-white/10 bg-white/5 text-white/70"
                        : "border-black/10 bg-white/80 text-black/70"
                    )}
                  >
                    <Image
                      src="/lab-flask.svg"
                      alt="DesignLabz"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                    <span>DesignLabz</span>
                  </div>
                  <h1
                    className={clsx(
                      "text-center text-[38px] sm:text-[52px] font-black tracking-tight text-transparent bg-clip-text transition-colors duration-500",
                      isDarkTheme
                        ? "bg-gradient-to-r from-[#ffffff] via-[#d4d4d4] to-[#9f9f9f] drop-shadow-[0_0_30px_rgba(200,200,200,0.4)]"
                        : "bg-gradient-to-r from-[#111111] via-[#333333] to-[#666666] drop-shadow-[0_0_24px_rgba(0,0,0,0.15)]"
                    )}
                  >
                    Build your next event
                  </h1>
                  <p
                    className={clsx(
                      "max-w-3xl text-center text-sm transition-colors duration-500",
                      isDarkTheme ? "text-white/70" : "text-[#1a1a1a]/70"
                    )}
                  >
                    Choose an unlocked venue, glide across the gridded landscape, and post up where the layout feels right.
                    Additional islands drop soon—tap a card to highlight the space you want to remix.
                  </p>
                </div>
              </header>
            )}

            {!isFullScreen && (
              <section className="relative z-10 px-6">
                <div
                  className={clsx(
                    "relative rounded-3xl border px-6 py-5 shadow-[0_0_40px_rgba(100,100,100,0.25)] transition-colors duration-500",
                    isDarkTheme
                      ? "border-gray-500/30 bg-[#333333]/70"
                      : "border-black/10 bg-white/85 shadow-[0_0_40px_rgba(0,0,0,0.1)]"
                  )}
                >
                  <button
                    onClick={() => scrollCarousel("left")}
                    className={clsx(
                      "absolute left-2 top-1/2 -translate-y-1/2 rounded-full border p-2 transition focus-visible:outline-none focus-visible:ring-2",
                      isDarkTheme
                        ? "border-gray-500/30 bg-[#444444]/80 text-gray-300/70 hover:border-gray-400/60 hover:text-gray-100 focus-visible:ring-white/20"
                        : "border-black/10 bg-white text-black/60 hover:border-black/20 hover:text-black focus-visible:ring-black/20"
                    )}
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
                          className={clsx(
                            "min-w-[220px] rounded-2xl border px-4 py-5 text-left transition-all duration-300 transform hover:scale-105",
                            isUnlocked
                              ? isDarkTheme
                                ? "border-gray-500/40 bg-gradient-to-br from-[rgba(60,60,60,0.8)] to-[rgba(100,100,100,0.35)] text-white hover:shadow-[0_0_26px_rgba(150,150,150,0.45)]"
                                : "border-black/10 bg-gradient-to-br from-white to-[#f1f1f1] text-[#111111] hover:shadow-[0_0_26px_rgba(0,0,0,0.15)]"
                              : isDarkTheme
                              ? "border-gray-500/20 bg-[#333333]/80 text-gray-300/40"
                              : "border-black/10 bg-white/70 text-black/30",
                            isActive
                              ? isDarkTheme
                                ? "ring-2 ring-gray-300/80"
                                : "ring-2 ring-black/20"
                              : null,
                            isCardExpanded === venue.id
                              ? "scale-110 z-50 shadow-[0_0_40px_rgba(150,150,150,0.3)]"
                              : null
                          )}
                          style={{
                            transform: isCardExpanded === venue.id
                              ? "perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(20px)"
                              : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          <div
                            className={clsx(
                              "text-[11px] uppercase tracking-[0.4em] transition-colors duration-500",
                              isDarkTheme ? "text-gray-300/70" : "text-black/50"
                            )}
                          >
                            {isUnlocked ? "Unlocked" : "Coming Soon"}
                          </div>
                          <div
                            className={clsx(
                              "mt-3 text-sm font-semibold leading-tight transition-colors duration-500",
                              isDarkTheme ? "text-white" : "text-[#111111]"
                            )}
                          >
                            {venue.address}
                          </div>
                          {isUnlocked && (
                            <div
                              className={clsx(
                                "mt-4 flex items-center gap-2 text-[11px] transition-colors duration-500",
                                isDarkTheme ? "text-gray-300/80" : "text-black/60"
                              )}
                            >
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
                    className={clsx(
                      "absolute right-2 top-1/2 -translate-y-1/2 rounded-full border p-2 transition focus-visible:outline-none focus-visible:ring-2",
                      isDarkTheme
                        ? "border-gray-500/30 bg-[#444444]/80 text-gray-300/70 hover:border-gray-400/60 hover:text-gray-100 focus-visible:ring-white/20"
                        : "border-black/10 bg-white text-black/60 hover:border-black/20 hover:text-black focus-visible:ring-black/20"
                    )}
                    aria-label="Scroll venues forwards"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </section>
            )}

            <main
              className={clsx(
                "relative z-0 flex-1 overflow-hidden transition-colors duration-500",
                isFullScreen ? "px-0 pb-0 pt-0" : "px-6 pb-10 pt-6"
              )}
            >
              <section
                className={clsx(
                  "relative h-full overflow-hidden rounded-[34px] border shadow-[0_0_60px_rgba(0,0,0,0.2)] transition-all duration-500",
                  isDarkTheme
                    ? "border-white/10 bg-[#101010]"
                    : "border-black/10 bg-white/90 shadow-[0_0_60px_rgba(0,0,0,0.12)]",
                  isFullScreen
                    ? isDarkTheme
                      ? "rounded-none border-white/5"
                      : "rounded-none border-black/10"
                    : ""
                )}
              >
                {/* Fullscreen toggle button positioned relative to the grid window */}
                <button
                  onClick={toggleFullScreen}
                  className={clsx(
                    "pointer-events-auto absolute bottom-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 backdrop-blur-sm",
                    isDarkTheme
                      ? "border-white/15 bg-black/50 text-white/70 hover:bg-white/15 hover:text-white focus-visible:ring-white/30"
                      : "border-black/15 bg-white/70 text-black/70 hover:bg-white focus-visible:ring-black/20"
                  )}
                  title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
                <div
                  ref={workspaceRef}
                  className="absolute inset-0 overflow-auto"
                >
                  <div
                    className="relative"
                    style={{
                      minWidth: "3600px",
                      minHeight: "3600px",
                      ...workspaceBackdropStyle,
                    }}
                  >
                    <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
                      {prefilledLayout && (
                        <div
                          className={clsx(
                            "pointer-events-auto w-full max-w-[440px] rounded-[42px] border px-8 py-6 shadow-[0_0_60px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-colors duration-500",
                            isDarkTheme
                              ? "border-white/14 bg-black/70"
                              : "border-black/10 bg-white/85 shadow-[0_0_48px_rgba(0,0,0,0.18)]"
                          )}
                        >
                          <div className="mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.36em] opacity-70">
                            <Sparkle className="h-4 w-4" />
                            <span>layout synced</span>
                          </div>
                          <GeneratedLayoutPreview
                            layout={prefilledLayout.layout}
                            theme={isDarkTheme ? "dark" : "light"}
                            status={layoutPreviewStatus}
                            showLabel={false}
                          />
                          <div className="mt-4 text-center text-[11px] uppercase tracking-[0.3em] opacity-70">
                            {prefilledLayout.layout.label}
                          </div>
                          <div className="text-center text-[10px] uppercase tracking-[0.24em] opacity-50">
                            {prefilledLayout.address}
                          </div>
                        </div>
                      )}
                      <div
                        className={clsx(
                          "pointer-events-auto rounded-[42px] border px-10 py-8 shadow-[0_0_60px_rgba(0,0,0,0.55)] backdrop-blur-sm float-animation transition-colors duration-500",
                          isDarkTheme
                            ? "border-white/12 bg-gradient-to-b from-white/10 via-black/30 to-black/40"
                            : "border-black/10 bg-gradient-to-b from-white/85 via-white/70 to-[#f5f5f5]"
                        )}
                      >
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
                          <div
                            className={clsx(
                              "flex h-52 w-80 items-center justify-center text-sm transition-colors duration-500",
                              isDarkTheme ? "text-gray-300/70" : "text-black/60"
                            )}
                          >
                            {loading
                              ? "Loading the suite..."
                              : "Unlock a venue to render its island."}
                          </div>
                        )}
                      </div>
                      <div
                        className={clsx(
                          "rounded-full border px-6 py-2 text-xs uppercase tracking-[0.3em] transition-colors duration-500",
                          isDarkTheme
                            ? "border-white/15 bg-white/10 text-white/70"
                            : "border-black/15 bg-white/80 text-black/70"
                        )}
                      >
                        infinite canvas — drag to explore
                      </div>
                    </div>
                    <ToolkitPanel
                      position={toolkitPosition}
                      orientation={getToolkitOrientation()}
                      isDragging={isDragging}
                      onMouseDown={handleToolkitMouseDown}
                      onMouseMove={handleToolkitMouseMove}
                      onMouseUp={handleToolkitMouseUp}
                      isDarkTheme={isDarkTheme}
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

/** Draggable toolkit panel with dynamic orientation */
function ToolkitPanel({ 
  position, 
  orientation, 
  isDragging, 
  onMouseDown, 
  onMouseMove, 
  onMouseUp,
  isDarkTheme,
}: { 
  position: { x: number; y: number };
  orientation: 'horizontal' | 'vertical';
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  isDarkTheme: boolean;
}) {
  const isHorizontal = orientation === 'horizontal';
  const cardClassName = clsx(
    "rounded-2xl border px-3 py-2 transition",
    isDarkTheme
      ? "border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/10"
      : "border-black/10 bg-white text-black/75 hover:border-black/20 hover:bg-white/90"
  );
  const labelClassName = clsx(
    "text-sm font-semibold",
    isDarkTheme ? "text-white" : "text-black"
  );
  const hintClassName = clsx(
    "text-[11px] uppercase tracking-[0.3em]",
    isDarkTheme ? "text-white/40" : "text-black/40"
  );
  
  return (
    <div 
      className={clsx(
        "pointer-events-auto absolute rounded-3xl border px-5 py-4 shadow-[0_0_30px_rgba(0,0,0,0.45)] transition-all duration-300 cursor-grab active:cursor-grabbing",
        isDragging && "scale-105 shadow-[0_0_40px_rgba(0,0,0,0.6)]",
        isDarkTheme
          ? "border-white/10 bg-black/50 text-white"
          : "border-black/10 bg-white/80 text-black"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: isHorizontal ? 'auto' : '256px',
        height: isHorizontal ? '120px' : 'auto',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div
        className={clsx(
          "flex items-center gap-2 text-xs uppercase tracking-[0.32em]",
          isHorizontal ? "mb-3" : "mb-3",
          isDarkTheme ? "text-white/70" : "text-black/70"
        )}
      >
        <Wand2 className="h-4 w-4" />
        <span>Toolkit islands</span>
      </div>
      
      {isHorizontal ? (
        <div className="flex gap-3 overflow-x-auto">
          {TOOLKIT.map((tool) => (
            <div
              key={tool.id}
              className={clsx("min-w-[140px]", cardClassName)}
            >
              <div className={labelClassName}>{tool.label}</div>
              <div className={hintClassName}>{tool.hint}</div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2 text-xs">
          {TOOLKIT.map((tool) => (
            <li
              key={tool.id}
              className={cardClassName}
            >
              <div className={labelClassName}>{tool.label}</div>
              <div className={hintClassName}>{tool.hint}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
