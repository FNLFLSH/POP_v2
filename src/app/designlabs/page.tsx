'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, Suspense, useCallback } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkle,
  Maximize2,
  Wand2,
  Minimize2,
  RotateCcw,
  Move,
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
  const [hasAppliedPrefill, setHasAppliedPrefill] = useState(false);

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

  // Keep layout persistent across page states
  useEffect(() => {
    if (prefilledLayout && typeof window !== "undefined") {
      // Store layout in localStorage for persistence
      localStorage.setItem("popCurrentLayout", JSON.stringify(prefilledLayout));
    }
  }, [prefilledLayout]);

  // Load persistent layout on mount
  useEffect(() => {
    if (typeof window === "undefined" || prefilledLayout) return;
    
    const persistentLayout = localStorage.getItem("popCurrentLayout");
    if (persistentLayout) {
      try {
        const parsed = JSON.parse(persistentLayout) as StoredLayoutPayload;
        if (parsed && parsed.layout) {
          setPrefilledLayout(parsed);
        }
      } catch (err) {
        console.error("Unable to parse persistent layout", err);
        localStorage.removeItem("popCurrentLayout");
      }
    }
  }, [prefilledLayout]);

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
  const [dimensions, setDimensions] = useState({ layoutSize: 600, workspaceSize: 3600 });

  const computeDimensions = useCallback(() => {
    if (typeof window === "undefined") {
      return { layoutSize: 600, workspaceSize: 3600 };
    }

    const { innerWidth, innerHeight } = window;
    const availableWidth = innerWidth - (isFullScreen ? 0 : 48); // Account for padding
    const availableHeight = innerHeight - (isFullScreen ? 0 : 200); // Account for header/padding

    const maxLayoutSize = Math.min(availableWidth * 0.6, availableHeight * 0.6);
    const layoutSize = Math.max(300, Math.min(600, maxLayoutSize));
    const workspaceSize = Math.max(layoutSize * 2, 1200);

    return { layoutSize, workspaceSize };
  }, [isFullScreen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateDimensions = () => {
      setDimensions(computeDimensions());
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [computeDimensions]);

  const { layoutSize, workspaceSize } = dimensions;
  
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

  const scrollWorkspaceToCenter = (behavior: ScrollBehavior = "smooth") => {
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
      behavior,
    });
  };

  const positionToolkitNearCenter = useCallback(() => {
    const element = workspaceRef.current;
    if (!element) return;
    const scrollLeft = element.scrollLeft;
    const scrollTop = element.scrollTop;
    const centerX = scrollLeft + element.clientWidth / 2;
    const centerY = scrollTop + element.clientHeight / 2;
    
    // Calculate responsive toolkit positioning
    const toolkitWidth = isFullScreen ? 256 : 200;
    const toolkitHeight = isFullScreen ? 400 : 320;
    const layoutOffset = layoutSize / 2 + 50; // Space from layout edge
    
    let desiredX, desiredY;
    if (isFullScreen) {
      // In fullscreen: position to the left of the layout
      desiredX = centerX - layoutOffset - toolkitWidth;
      desiredY = centerY;
    } else {
      // In minimized: position in bottom-left area, scaled with screen size
      const scaleFactor = Math.min(layoutSize / 600, 1); // Scale with layout size
      desiredX = centerX - (layoutOffset * scaleFactor) - toolkitWidth;
      desiredY = centerY + (layoutOffset * scaleFactor * 0.5);
    }
    
    const clampedX = Math.max(24, Math.min(desiredX, element.scrollWidth - toolkitWidth));
    const clampedY = Math.max(24, Math.min(desiredY, element.scrollHeight - toolkitHeight));
    
    setToolkitPosition((prev) => {
      if (Math.abs(prev.x - clampedX) < 1 && Math.abs(prev.y - clampedY) < 1) {
        return prev;
      }
      return { x: clampedX, y: clampedY };
    });
  }, [isFullScreen, layoutSize]);

  useEffect(() => {
    if (hasAppliedPrefill) return;
    if (!prefilledLayout && !prefillFlag) return;
    setIsFullScreen(true);
    requestAnimationFrame(() => {
      scrollWorkspaceToCenter("smooth");
      requestAnimationFrame(() => {
        positionToolkitNearCenter();
      });
    });
    setHasAppliedPrefill(true);
  }, [hasAppliedPrefill, prefilledLayout, prefillFlag, positionToolkitNearCenter]);

  useEffect(() => {
    if (isDragging) return;
    positionToolkitNearCenter();
  }, [isFullScreen, layoutSize, positionToolkitNearCenter, isDragging]);

  // Ensure layout is centered when page loads with existing layout
  useEffect(() => {
    if (prefilledLayout) {
      requestAnimationFrame(() => {
        scrollWorkspaceToCenter("smooth");
        requestAnimationFrame(() => {
          positionToolkitNearCenter();
        });
      });
    }
  }, [prefilledLayout, positionToolkitNearCenter]);

  // Ensure toolkit is visible when layout is imported
  useEffect(() => {
    if (prefilledLayout) {
      // Position toolkit to the right of the layout
      const element = workspaceRef.current;
      if (!element) return;
      const scrollLeft = element.scrollLeft;
      const scrollTop = element.scrollTop;
      const centerX = scrollLeft + element.clientWidth / 2;
      const centerY = scrollTop + element.clientHeight / 2;
      const panelWidth = isFullScreen ? 256 : 200;
      const panelHeight = isFullScreen ? 400 : 320;
      const desiredX = centerX + layoutSize / 2 + 80; // bias to right of layout
      const desiredY = centerY - panelHeight / 2;
      const maxX = Math.max(24, element.scrollWidth - panelWidth - 24);
      const maxY = Math.max(24, element.scrollHeight - panelHeight - 24);
      const clampedX = Math.max(24, Math.min(desiredX, maxX));
      const clampedY = Math.max(24, Math.min(desiredY, maxY));
      setToolkitPosition({ x: clampedX, y: clampedY });
    }
  }, [prefilledLayout, isFullScreen, layoutSize]);

  const handleReturnHome = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("popSkipLanding", "true");
      // Clear persistent layout when returning home
      localStorage.removeItem("popCurrentLayout");
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => {
      const next = !prev;
      requestAnimationFrame(() => {
        if (!workspaceRef.current) return;
        if (next) {
          scrollWorkspaceToCenter("smooth");
          requestAnimationFrame(() => {
            positionToolkitNearCenter();
          });
        } else {
          workspaceRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          requestAnimationFrame(() => {
            positionToolkitNearCenter();
          });
        }
      });
      return next;
    });
  };

  // Toolkit is always vertical
  const getToolkitOrientation = () => 'vertical';

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
                {/* Layout toggle button positioned relative to the grid window */}
                <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-2">
                  <button
                    onClick={toggleFullScreen}
                    className={clsx(
                      "pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 backdrop-blur-sm",
                      isDarkTheme
                        ? "border-white/15 bg-black/50 text-white/70 hover:bg-white/15 hover:text-white focus-visible:ring-white/30"
                        : "border-black/15 bg-white/70 text-black/70 hover:bg-white focus-visible:ring-black/20"
                    )}
                    title={isFullScreen ? "Show page layout" : "Hide page layout"}
                  >
                    {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    <span>{isFullScreen ? "Show Page" : "Hide Page"}</span>
                  </button>
                </div>
                <div
                  ref={workspaceRef}
                  className="absolute inset-0 overflow-auto"
                >
                  <div
                    className="relative flex items-center justify-center w-full h-full min-w-full min-h-full"
                    style={{
                      ...workspaceBackdropStyle,
                      width: `${workspaceSize}px`,
                      height: `${workspaceSize}px`,
                      minWidth: "100%",
                      minHeight: "100%",
                    }}
                  >
                    <div className="flex flex-col items-center gap-6">
                      {/* Always show layout if available, otherwise show venue holobox */}
                      {prefilledLayout ? (
                        <>
                          <div className="pointer-events-auto">
                            <ManipulatableLayout
                              layout={prefilledLayout.layout}
                              theme={isDarkTheme ? "dark" : "light"}
                              status={layoutPreviewStatus}
                              layoutSize={layoutSize}
                              isFullScreen={isFullScreen}
                            />
                          </div>
                          <div
                            className={clsx(
                              "pointer-events-auto rounded-full border px-6 py-2 text-[11px] uppercase tracking-[0.32em] transition-colors duration-500",
                              isDarkTheme
                                ? "border-white/15 bg-white/10 text-white/70"
                                : "border-black/15 bg-white/80 text-black/70"
                            )}
                          >
                            {prefilledLayout.address}
                          </div>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                    <ToolkitPanel
                      position={toolkitPosition}
                      orientation={getToolkitOrientation()}
                      isDragging={isDragging}
                      onMouseDown={handleToolkitMouseDown}
                      onMouseMove={handleToolkitMouseMove}
                      onMouseUp={handleToolkitMouseUp}
                      isDarkTheme={isDarkTheme}
                      isFullScreen={isFullScreen}
                      layoutSize={layoutSize}
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
  isFullScreen = true,
  layoutSize = 600,
}: { 
  position: { x: number; y: number };
  orientation: 'horizontal' | 'vertical';
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  isDarkTheme: boolean;
  isFullScreen?: boolean;
  layoutSize?: number;
}) {
  const isHorizontal = false; // Always vertical
  const cardClassName = clsx(
    "rounded-2xl border transition",
    isFullScreen ? "px-3 py-2" : "px-2 py-1",
    isDarkTheme
      ? "border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/10"
      : "border-black/10 bg-white text-black/75 hover:border-black/20 hover:bg-white/90"
  );
  const labelClassName = clsx(
    isFullScreen ? "text-sm font-semibold" : "text-xs font-semibold",
    isDarkTheme ? "text-white" : "text-black"
  );
  const hintClassName = clsx(
    isFullScreen ? "text-[11px] uppercase tracking-[0.3em]" : "text-[10px] uppercase tracking-[0.25em]",
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
        width: isFullScreen ? '256px' : '200px',
        height: 'auto',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div
        className={clsx(
          "flex items-center gap-2 text-xs uppercase tracking-[0.32em] mb-3",
          isDarkTheme ? "text-white/70" : "text-black/70"
        )}
      >
        <Wand2 className="h-4 w-4" />
        <span>Toolkit islands</span>
      </div>
      
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
    </div>
  );
}

/** Inline ManipulatableLayout component */
function ManipulatableLayout({
  layout,
  theme,
  status = "ready",
  layoutSize = 600,
}: {
  layout: GeneratedLayout;
  theme: "dark" | "light";
  status?: "generating" | "revealing" | "ready" | "packing";
  layoutSize?: number;
}) {
  const isDark = theme === "dark";
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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
  }, []);

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
        {/* Layout SVG */}
        <div 
          className="relative"
          style={{
            width: `${layoutSize}px`,
            height: `${layoutSize}px`,
          }}
        >
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
