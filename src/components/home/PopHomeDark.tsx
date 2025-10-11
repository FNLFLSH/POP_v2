'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { AlertCircle, Loader2, PackageOpen, Search } from "lucide-react";
import ThemeToggle from '@/components/common/ThemeToggle';
import { useThemeContext } from '@/components/providers/ThemeProvider';
import { BeaconPin } from '@/components/icons/BeaconPin';
import { generateMockLayout, type GeneratedLayout } from "@/lib/layoutEngine";
import { GeneratedLayoutPreview } from "@/components/floorplan/GeneratedLayoutPreview";

type LayoutStatus = "idle" | "generating" | "revealing" | "ready" | "packing";

/**
 * POP! Home – Dark Mode (full screen, no circles)
 * - Single-file React component
 * - TailwindCSS for styling
 * - Includes: header title, left sidebar with hamburger + nav, center search bar & CTA,
 *   inner gray grid canvas, outer dotted paper backdrop.
 * - Full screen layout without decorative balls
 */

export default function PopHomeWithTheme() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [landingVisible, setLandingVisible] = useState(true);
  const [shakeStage, setShakeStage] = useState(false);
  const router = useRouter();
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme } = useThemeContext();
  const isDarkTheme = theme === 'dark';
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [validating, setValidating] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [layoutStatus, setLayoutStatus] = useState<LayoutStatus>("idle");
  const [generatedLayout, setGeneratedLayout] = useState<GeneratedLayout | null>(null);
  const [confirmedAddress, setConfirmedAddress] = useState<string | null>(null);
  const layoutTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearLayoutTimers = () => {
    if (layoutTimersRef.current.length === 0) return;
    layoutTimersRef.current.forEach((timerId) => clearTimeout(timerId));
    layoutTimersRef.current = [];
  };

  const scheduleLayoutStatus = (status: LayoutStatus, delay: number) => {
    const timerId = setTimeout(() => {
      setLayoutStatus(status);
      layoutTimersRef.current = layoutTimersRef.current.filter((existing) => existing !== timerId);
    }, delay);
    layoutTimersRef.current.push(timerId);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const skipLanding = sessionStorage.getItem('popSkipLanding') === 'true';
    setLandingVisible(!skipLanding);
  }, []);

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
      clearLayoutTimers();
    };
  }, []);

  const sanitizedAddress = useMemo(() => address.trim(), [address]);

  const runSearchFlow = async () => {
    if (!sanitizedAddress) {
      setAddressError("Enter an address");
      inputRef.current?.focus();
      return;
    }

    try {
      clearLayoutTimers();
      setLayoutStatus("idle");
      setValidating(true);
      setAddressError(null);
      const nextLayout = generateMockLayout(sanitizedAddress);
      setGeneratedLayout(nextLayout);
      setLayoutStatus("generating");

      const response = await fetch("/api/venue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: sanitizedAddress }),
      });

      if (!response.ok) {
        throw new Error("Invalid address");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("venueAddress", sanitizedAddress);
      }

      setConfirmedAddress(sanitizedAddress);
      scheduleLayoutStatus("revealing", 90);
      scheduleLayoutStatus("ready", 760);
    } catch (error) {
      console.error("Address validation failed", error);
      setAddressError("We couldn't locate that venue. Try refining the address.");
      setGeneratedLayout(null);
      setConfirmedAddress(null);
      setLayoutStatus("idle");
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validating) return;
    await runSearchFlow();
  };

  const handleLandingReveal = () => {
    setLandingVisible(false);
    setShakeStage(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('popSkipLanding', 'true');
    }
    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current);
    }
    shakeTimeoutRef.current = setTimeout(() => setShakeStage(false), 700);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleReigniteLanding = () => {
    setShakeStage(false);
    setLandingVisible(true);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('popSkipLanding');
    }
  };

  const handleBoxClick = () => {
    if (!generatedLayout || layoutStatus !== "ready" || !confirmedAddress) {
      return;
    }

    clearLayoutTimers();
    setLayoutStatus("packing");

    if (typeof window !== "undefined") {
      try {
        const payload = {
          layout: generatedLayout,
          address: confirmedAddress,
          theme,
          timestamp: Date.now(),
        };
        sessionStorage.setItem("popGeneratedLayout", JSON.stringify(payload));
        sessionStorage.setItem("popSkipLanding", "true");
      } catch (error) {
        console.error("Unable to cache generated layout", error);
      }
    }

    const navigationTimer = setTimeout(() => {
      router.push(
        `/designlabs?prefillLayout=1&address=${encodeURIComponent(confirmedAddress)}`
      );
      layoutTimersRef.current = layoutTimersRef.current.filter(
        (timerRef) => timerRef !== navigationTimer
      );
    }, 720);

    layoutTimersRef.current.push(navigationTimer);
  };

  const boardClassName = clsx(
    "h-full shadow-[0_0_32px_rgba(0,0,0,0.35)] transition-transform duration-500",
    isDarkTheme ? "bg-[#111111]" : "bg-[#fcfcfc]",
    shakeStage && "animate-screen-shake"
  );

  const containerClassName = clsx(
    "relative h-screen w-screen overflow-hidden transition-colors duration-500",
    isDarkTheme ? "bg-[#050505] text-[#f2f2f2]" : "bg-[#f7f7f7] text-[#1f1f1f]"
  );

  const inputClassName = clsx(
    "w-full rounded-lg border px-4 py-3 text-sm tracking-wide outline-none shadow-inner transition",
    isDarkTheme
      ? "border-[#3a3a3a] bg-[#1a1a1a] text-[#f2f2f2] placeholder-[#9a9a9a] focus:border-[#4c4c4c] focus:ring-2 focus:ring-[#4c4c4c]/40"
      : "border-[#c9c9c9] bg-white text-[#1f1f1f] placeholder-[#7a7a7a] focus:border-[#a8a8a8] focus:ring-2 focus:ring-[#a8a8a8]/40"
  );

  const enterButtonClassName = clsx(
    "relative inline-flex h-11 min-w-[112px] items-center justify-center rounded-lg border px-6 text-[11px] font-semibold uppercase tracking-[0.32em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed",
    isDarkTheme
      ? "border-white/20 bg-black text-white shadow-[0_14px_32px_rgba(0,0,0,0.55)] hover:border-white/30 hover:bg-black/85 focus-visible:ring-white/30"
      : "border-black/15 bg-white text-[#111111] shadow-[0_16px_34px_rgba(0,0,0,0.14)] hover:border-black/25 hover:bg-white/95 focus-visible:ring-black/20",
    (validating || layoutStatus === "packing") && "opacity-80"
  );
  const showLayoutPreview = Boolean(generatedLayout && layoutStatus !== "idle");
  const displaySpinner = validating || layoutStatus === "generating";
  const previewLayout = showLayoutPreview ? generatedLayout : null;
  const previewStatus: "generating" | "revealing" | "ready" | "packing" =
    layoutStatus === "generating" || layoutStatus === "revealing" || layoutStatus === "packing"
      ? (layoutStatus as "generating" | "revealing" | "packing")
      : "ready";

  const cardBorderClass = isDarkTheme
    ? "border-[#3a3a3a] bg-[#1b1b1b]"
    : "border-[#d1d1d1] bg-white/85";

  const taglineClass = isDarkTheme ? "text-white/60" : "text-[#4a4a4a]/70";
  const exploreLinkClass = isDarkTheme
    ? "text-xs uppercase tracking-[0.35em] text-[#bdbdbd] hover:text-white transition-colors"
    : "text-xs uppercase tracking-[0.35em] text-[#5a5a5a] hover:text-[#1f1f1f] transition-colors";
  const hamburgerClass = clsx(
    "absolute left-4 top-6 z-30 h-10 w-10 flex flex-col items-center justify-center gap-1.5 rounded-md border transition-colors",
    isDarkTheme
      ? "border-white/10 bg-[#181818] hover:bg-[#222222]"
      : "border-[#d8d8d8] bg-white/80 hover:bg-white"
  );
  const hamburgerBarClass = isDarkTheme ? "bg-[#f1f1f1]" : "bg-[#2f2f2f]";
  const sidebarNavClass = isDarkTheme
    ? "space-y-2 text-[14px] font-semibold tracking-tight text-[#e0e0e0]"
    : "space-y-2 text-[14px] font-semibold tracking-tight text-[#1f1f1f]";
  const profileTextClass = isDarkTheme ? "text-[#e0e0e0]" : "text-[#1f1f1f]";

  return (
    <div className={containerClassName}>
      {landingVisible && <LandingIntro onReveal={handleLandingReveal} isDark={isDarkTheme} />}

      {/* Outer dotted paper backdrop */}
      <div className="relative h-full w-full">
        <DottedPaperBackdrop isDark={isDarkTheme} />

        {/* Framed board - full screen */}
        <div className="relative h-full w-full">
          <div className={boardClassName}>
            {/* Main content area - full height */}
            <div className="relative h-full overflow-hidden">
              {/* Title at top center */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
                <button
                  type="button"
                  onClick={handleReigniteLanding}
                  className={clsx(
                    "font-black tracking-tight text-[38px] sm:text-[56px] leading-none transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                    isDarkTheme ? "text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.6)]" : "text-[#1a1a1a] drop-shadow-[0_0_10px_rgba(0,0,0,0.15)]"
                  )}
                  aria-label="Replay POP! landing experience"
                >
                  POP!
                </button>
              </div>

              {/* Inner square grid background */}
              <InnerGrid isDark={isDarkTheme} />

              {/* Center card with search + CTA */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-full max-w-[720px] flex flex-col items-center gap-6 px-4">
                  <p className={clsx("text-center text-sm uppercase tracking-[0.25em]", taglineClass)}>
                    drop an address, unlock the night
                  </p>
                  <form
                    onSubmit={handleSubmit}
                    className={clsx(
                      "w-full rounded-xl border p-2 backdrop-blur-md shadow-[0_0_24px_rgba(0,0,0,0.18)]",
                      cardBorderClass,
                      addressError ? "border-red-500/60" : ""
                    )}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                        <div className="relative flex-1">
                          <input
                            className={clsx(
                              inputClassName,
                              "pr-12", // Add padding for the icon
                              addressError ? "border-red-500/60 focus:border-red-400 focus:ring-red-400/30" : ""
                            )}
                            placeholder="ENTER ADDRESS"
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);
                              if (addressError) {
                                setAddressError(null);
                              }
                            }}
                            ref={inputRef}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                runSearchFlow();
                              }
                            }}
                          />
                          <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            aria-label="Search address"
                            disabled={validating || layoutStatus === "packing"}
                          >
                            {displaySpinner ? (
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                            ) : (
                              <Search className="h-4 w-4 text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  {addressError && (
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {addressError}
                    </div>
                  )}
                  {previewLayout && (
                    <div className="relative flex w-full flex-col items-center gap-5 pt-4">
                      <div
                        className={clsx(
                          "pointer-events-none absolute inset-0 -z-10 rounded-[36px] transition-all duration-700",
                          layoutStatus === "revealing"
                            ? isDarkTheme
                              ? "opacity-80 bg-white/10 blur-2xl"
                              : "opacity-75 bg-black/10 blur-2xl"
                            : "opacity-0"
                        )}
                      />
                      <GeneratedLayoutPreview
                        layout={previewLayout}
                        theme={isDarkTheme ? "dark" : "light"}
                        status={previewStatus}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <button
                          type="button"
                          onClick={handleBoxClick}
                          className={clsx(
                            "group relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
                            isDarkTheme
                              ? "border-white/20 bg-black/70 text-white/80 hover:bg-black/60 hover:text-white focus-visible:ring-white/30"
                              : "border-black/15 bg-white text-[#1a1a1a] hover:bg-white/85 focus-visible:ring-black/20",
                            layoutStatus === "packing" && "box-launch"
                          )}
                          disabled={layoutStatus !== "ready" || !confirmedAddress}
                          aria-label="Send generated layout to Design Lab"
                        >
                          <PackageOpen
                            className={clsx(
                              "h-8 w-8 transition-transform duration-500",
                              layoutStatus === "ready"
                                ? "group-hover:-translate-y-1 group-hover:scale-110"
                                : "",
                              layoutStatus === "packing" ? "translate-y-3 scale-50 opacity-0" : ""
                            )}
                          />
                        </button>
                        <span
                          className={clsx(
                            "text-[10px] uppercase tracking-[0.36em] transition-colors duration-500",
                            isDarkTheme ? "text-white/60" : "text-[#1a1a1a]/60"
                          )}
                        >
                          send to design lab
                        </span>
                      </div>
                    </div>
                  )}
                  <Link href="/intake" className={exploreLinkClass}>
                    need help finding your venue?
                  </Link>
                  <Link
                    href="/designlabs"
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="h-18 w-18">
                      <Image
                        src="/lab-flask.svg"
                        alt="DesignLabz"
                        width={64}
                        height={64}
                        className="h-16 w-16 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <span className="text-xs uppercase tracking-[0.35em] text-gray-400 group-hover:text-white transition-colors">
                      explore designlabz
                    </span>
                  </Link>
                </div>
              </div>

              {/* Hamburger Button - Always visible */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={hamburgerClass}
              >
                <span
                  className={clsx(
                    "h-1 transition-all duration-300",
                    hamburgerBarClass,
                    sidebarOpen ? "w-6 rotate-45 translate-y-1.5" : "w-6"
                  )}
                />
                <span
                  className={clsx(
                    "h-1 transition-all duration-300",
                    hamburgerBarClass,
                    sidebarOpen ? "w-0 opacity-0" : "w-6"
                  )}
                />
                <span
                  className={clsx(
                    "h-1 transition-all duration-300",
                    hamburgerBarClass,
                    sidebarOpen ? "w-6 -rotate-45 -translate-y-1.5" : "w-6"
                  )}
                />
              </button>

              {/* Theme Toggle Button - Top right */}
              <div className="absolute right-4 top-6 z-30">
                <ThemeToggle />
              </div>

              {/* Collapsible Left Sidebar */}
              <aside className={`absolute left-0 top-0 z-20 h-full transition-all duration-300 ${
                sidebarOpen ? 'w-[180px] border-r border-gray-200 dark:border-white/10 bg-gray-50/5 dark:bg-white/5 backdrop-blur' : 'w-0'
              }`}>

                {/* Nav - Only show when sidebar is open */}
                <div className={`transition-all duration-300 overflow-hidden ${
                  sidebarOpen ? 'opacity-100 mt-20 px-4 py-5' : 'opacity-0 h-0'
                }`}>
                  <nav className={sidebarNavClass}>
                    <NavItem label="discover" href="/unlstd" isDark={isDarkTheme} />
                    <NavItem label="designlabs" href="/designlabs" isDark={isDarkTheme} />
                    <NavItem label="MyEvents" href="/myevents" isDark={isDarkTheme} />
                    <NavItem label="marketplace" href="/marketplace" isDark={isDarkTheme} />
                    <NavItem label="Metrics" href="/metrics" isDark={isDarkTheme} />
                    <NavItem label="Settings" href="/settings" isDark={isDarkTheme} />
                  </nav>

                  {/* Bottom profile area */}
                  <div className={clsx("absolute inset-x-0 bottom-3 px-4 text-[13px]", profileTextClass)}>
                    <div className={clsx("mb-2 h-10 w-10 rounded-full border", isDarkTheme ? "border-white/15 bg-[#1c1c1c]" : "border-[#d0d0d0] bg-white/85")} />
                    <div className="pl-0.5 text-xs opacity-70">Name</div>
                    <button
                      className={clsx(
                        "mt-2 rounded border px-2 py-1 text-left text-xs transition-colors",
                        isDarkTheme
                          ? "border-white/15 opacity-90 hover:bg-white/10"
                          : "border-[#d0d0d0] text-[#1f1f1f] hover:bg-white"
                      )}
                    >
                      invite
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, href, isDark }: { label: string; href: string; isDark: boolean }) {
  const itemClass = clsx(
    "w-full rounded-sm px-1 py-1.5 transition cursor-pointer",
    isDark ? "hover:bg-white/10" : "hover:bg-black/5"
  );
  return (
    <Link href={href}>
      <div className={itemClass}>
        {label}
      </div>
    </Link>
  );
}

/** Dotted paper background (outside the main board) */
function DottedPaperBackdrop({ isDark }: { isDark: boolean }) {
  const dotColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const cornerBorderClass = isDark ? "border-white/20" : "border-black/10";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundImage:
          `radial-gradient(${dotColor} 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
        backgroundPosition: "-9px -9px",
      }}
    >
      {/* Rounded corner squiggle (top-right) */}
      <div className={clsx("absolute right-2 top-2 h-10 w-10 rounded-tl-[22px] border-l-2 border-t-2", cornerBorderClass)} />
    </div>
  );
}

/** Inner square grid like the mock */
function InnerGrid({ isDark }: { isDark: boolean }) {
  const baseFillStyle = {
    backgroundImage: isDark
      ? "radial-gradient(circle at top, rgba(60,60,60,0.5), rgba(10,10,10,0.85))"
      : "radial-gradient(circle at top, rgba(255,255,255,0.95), rgba(215,215,215,0.85))",
  };
  const gridStyle = {
    backgroundImage: isDark
      ? "repeating-linear-gradient(0deg, transparent 0 29px, rgba(255,255,255,0.08) 29px 30px), repeating-linear-gradient(90deg, transparent 0 29px, rgba(255,255,255,0.08) 29px 30px)"
      : "repeating-linear-gradient(0deg, transparent 0 29px, rgba(96,96,96,0.22) 29px 30px), repeating-linear-gradient(90deg, transparent 0 29px, rgba(96,96,96,0.22) 29px 30px)",
  };

  return (
    <div className="absolute inset-0">
      {/* base fill */}
      <div className="absolute inset-0" style={baseFillStyle} />
      {/* square grid using repeating-linear-gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={gridStyle}
      />
    </div>
  );
}

function LandingIntro({ onReveal, isDark }: { onReveal: () => void; isDark: boolean }) {
  const backgroundColor = isDark ? "#050505" : "#ffffff";
  const labelTone = isDark ? "text-white/60" : "text-[#505050]/70";
  const buttonPalette = isDark
    ? "from-[#2f2f2f] via-[#3d3d3d] to-[#4b4b4b] text-white"
    : "from-[#f0f0f0] via-[#e2e2e2] to-[#d4d4d4] text-[#1f1f1f]";

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <div className="relative flex h-full w-full max-w-[960px] flex-col items-center justify-center px-6">
        <div className="relative mb-12 flex h-64 w-full max-w-[420px] items-center justify-center">
          <div
            className="landing-map absolute inset-x-4 bottom-0 h-48 rounded-full"
            style={{
              backgroundImage: "url('/landing-map-grid.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(1) drop-shadow(0 14px 40px rgba(0,0,0,0.35))",
              opacity: isDark ? 0.78 : 0.92,
              pointerEvents: "none",
            }}
          />
          <BeaconPin animated aria-hidden={true} />
        </div>
        <div className="flex flex-col items-center gap-5 text-center">
          <div className={clsx("text-xs uppercase tracking-[0.42em]", labelTone)}>
            drop safe. plan bold.
          </div>
          <button
            type="button"
            onClick={onReveal}
            className={clsx(
              "landing-enter-btn rounded-full px-12 py-3 text-sm font-semibold uppercase tracking-[0.32em] bg-gradient-to-r focus-visible:outline-none focus-visible:ring-4",
              buttonPalette,
              isDark
                ? "border border-[#4d4d4d] shadow-[0_18px_45px_rgba(0,0,0,0.45)] focus-visible:ring-white/15"
                : "border border-[#d4d4d4] shadow-[0_18px_45px_rgba(0,0,0,0.2)] focus-visible:ring-black/10"
            )}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}
