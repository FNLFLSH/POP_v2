'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import ThemeToggle from '@/components/common/ThemeToggle';
import { useThemeContext } from '@/components/providers/ThemeProvider';
import { BeaconPin } from '@/components/icons/BeaconPin';

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
    };
  }, []);

  const sanitizedAddress = useMemo(() => address.trim(), [address]);

  const validateAndNavigate = async () => {
    if (!sanitizedAddress) {
      setAddressError("Enter an address");
      inputRef.current?.focus();
      return;
    }

    try {
      setValidating(true);
      setAddressError(null);

      const response = await fetch("/api/venue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: sanitizedAddress }),
      });

      if (!response.ok) {
        throw new Error("Invalid address");
      }

      localStorage.setItem('venueAddress', sanitizedAddress);
      router.push(`/blueprint?address=${encodeURIComponent(sanitizedAddress)}&flow=search`);
    } catch (error) {
      console.error("Address validation failed", error);
      setAddressError("We couldn't locate that venue. Try refining the address.");
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validating) return;
    await validateAndNavigate();
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
                    <div className="relative flex items-center">
                      <input
                        className={clsx(
                          inputClassName,
                          "pr-12",
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
                      />
                      <button
                        type="submit"
                        className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed"
                        aria-label="Search address"
                        disabled={validating}
                      >
                        {validating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </form>
                  {addressError && (
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      {addressError}
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
