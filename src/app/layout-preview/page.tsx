'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, PackageOpen } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import { DottedPaperBackdrop, InnerGrid, NavItem } from "@/components/home/HomeChrome";
import { generateMockLayout, type GeneratedLayout } from "@/lib/layoutEngine";
import { GeneratedLayoutPreview } from "@/components/floorplan/GeneratedLayoutPreview";

type LayoutStatus = "generating" | "revealing" | "ready" | "packing";

export default function LayoutPreviewPage() {
  const router = useRouter();
  const params = useSearchParams();
  const queryAddress = params.get("address");
  const { theme } = useThemeContext();
  const isDarkTheme = theme === "dark";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [layout, setLayout] = useState<GeneratedLayout | null>(null);
  const [layoutStatus, setLayoutStatus] = useState<LayoutStatus>("generating");
  const statusTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearStatusTimers = useCallback(() => {
    if (statusTimersRef.current.length === 0) return;
    statusTimersRef.current.forEach((timerId) => clearTimeout(timerId));
    statusTimersRef.current = [];
  }, []);

  const scheduleStatus = useCallback(
    (nextStatus: LayoutStatus, delay: number) => {
      const timerId = setTimeout(() => {
        setLayoutStatus(nextStatus);
        statusTimersRef.current = statusTimersRef.current.filter(
          (existing) => existing !== timerId,
        );
      }, delay);
      statusTimersRef.current.push(timerId);
    },
    [],
  );

  useEffect(() => {
    return () => {
      clearStatusTimers();
    };
  }, [clearStatusTimers]);

  useEffect(() => {
    let resolvedAddress = queryAddress?.trim() ?? null;

    if (!resolvedAddress && typeof window !== "undefined") {
      const stored = localStorage.getItem("venueAddress");
      if (stored && stored.trim().length > 0) {
        resolvedAddress = stored.trim();
      }
    }

    if (!resolvedAddress) {
      router.replace("/");
      return;
    }

    setAddress(resolvedAddress);
    clearStatusTimers();
    setLayoutStatus("generating");
    const nextLayout = generateMockLayout(resolvedAddress);
    setLayout(nextLayout);
    scheduleStatus("revealing", 120);
    scheduleStatus("ready", 820);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("popSkipLanding", "true");
    }
  }, [queryAddress, clearStatusTimers, scheduleStatus, router]);

  const handleReturnHome = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("popSkipLanding", "true");
    }
    router.push("/");
  }, [router]);

  const handleLaunchDesignLab = useCallback(() => {
    if (!layout || !address) {
      return;
    }

    clearStatusTimers();
    setLayoutStatus("packing");

    if (typeof window !== "undefined") {
      try {
        const payload = {
          layout,
          address,
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
        `/designlabs?prefillLayout=1&address=${encodeURIComponent(address)}`,
      );
      statusTimersRef.current = statusTimersRef.current.filter(
        (timerId) => timerId !== navigationTimer,
      );
    }, 720);

    statusTimersRef.current.push(navigationTimer);
  }, [address, clearStatusTimers, layout, router, theme]);

  const containerClassName = clsx(
    "relative h-screen w-screen overflow-hidden transition-colors duration-500",
    isDarkTheme ? "bg-[#050505] text-[#f2f2f2]" : "bg-[#f7f7f7] text-[#1f1f1f]",
  );

  const boardClassName = clsx(
    "h-full shadow-[0_0_32px_rgba(0,0,0,0.35)] transition-transform duration-500",
    isDarkTheme ? "bg-[#111111]" : "bg-[#fcfcfc]",
  );

  const hamburgerClass = clsx(
    "absolute left-4 top-6 z-30 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border transition-colors",
    isDarkTheme
      ? "border-white/10 bg-[#181818] hover:bg-[#222222]"
      : "border-[#d8d8d8] bg-white/80 hover:bg-white",
  );

  const hamburgerBarClass = isDarkTheme ? "bg-[#f1f1f1]" : "bg-[#2f2f2f]";

  const sidebarNavClass = isDarkTheme
    ? "space-y-2 text-[14px] font-semibold tracking-tight text-[#e0e0e0]"
    : "space-y-2 text-[14px] font-semibold tracking-tight text-[#1f1f1f]";

  const profileTextClass = isDarkTheme ? "text-[#e0e0e0]" : "text-[#1f1f1f]";

  const upperAddress = useMemo(
    () => (address ? address.toUpperCase() : ""),
    [address],
  );

  const canLaunch =
    Boolean(layout && address) && layoutStatus === "ready";

  return (
    <div className={containerClassName}>
      <div className="relative h-full w-full">
        <DottedPaperBackdrop isDark={isDarkTheme} />

        <div className="relative h-full w-full">
          <div className={boardClassName}>
            <div className="relative h-full overflow-hidden">
              <div className="absolute left-1/2 top-6 z-30 -translate-x-1/2 transform">
                <button
                  type="button"
                  onClick={handleReturnHome}
                  className={clsx(
                    "font-black tracking-tight text-[38px] leading-none transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-[56px]",
                    isDarkTheme
                      ? "text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.6)]"
                      : "text-[#1a1a1a] drop-shadow-[0_0_10px_rgba(0,0,0,0.15)]",
                  )}
                  aria-label="Return to POP! search"
                >
                  POP!
                </button>
              </div>

              <InnerGrid isDark={isDarkTheme} />

              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="flex w-full max-w-[520px] flex-col items-center gap-8 px-4">
                  <p
                    className={clsx(
                      "text-center text-xs uppercase tracking-[0.35em]",
                      isDarkTheme ? "text-white/60" : "text-[#4a4a4a]/70",
                    )}
                  >
                    layout unlocked
                  </p>
                  <div className="w-full">
                    {layout ? (
                      <GeneratedLayoutPreview
                        layout={layout}
                        theme={isDarkTheme ? "dark" : "light"}
                        status={layoutStatus}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 rounded-[32px] border border-dashed border-white/20 py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-white/70" />
                        <span className="text-xs uppercase tracking-[0.32em] opacity-60">
                          unlocking layout
                        </span>
                      </div>
                    )}
                  </div>
                  {upperAddress && (
                    <span
                      className={clsx(
                        "text-[10px] uppercase tracking-[0.36em]",
                        isDarkTheme ? "text-white/45" : "text-[#333333]/60",
                      )}
                    >
                      {upperAddress}
                    </span>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLaunchDesignLab}
                      className={clsx(
                        "group relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
                        isDarkTheme
                          ? "border-white/20 bg-black/70 text-white/80 hover:bg-black/60 hover:text-white focus-visible:ring-white/30"
                          : "border-black/15 bg-white text-[#1a1a1a] hover:bg-white/85 focus-visible:ring-black/20",
                        layoutStatus === "packing" && "box-launch",
                      )}
                      disabled={!canLaunch}
                      aria-label="Send generated layout to Design Labz"
                    >
                      <PackageOpen
                        className={clsx(
                          "h-8 w-8 transition-transform duration-500",
                          canLaunch
                            ? "group-hover:-translate-y-1 group-hover:scale-110"
                            : "",
                          layoutStatus === "packing"
                            ? "translate-y-3 scale-50 opacity-0"
                            : "",
                        )}
                      />
                    </button>
                    <span
                      className={clsx(
                        "text-[10px] uppercase tracking-[0.36em] transition-colors duration-500",
                        isDarkTheme ? "text-white/60" : "text-[#1a1a1a]/60",
                      )}
                    >
                      send to design lab
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className={hamburgerClass}
              >
                <span
                  className={clsx(
                    "h-1 transition-all duration-300",
                    hamburgerBarClass,
                    sidebarOpen ? "w-6 translate-y-1.5 rotate-45" : "w-6",
                  )}
                />
                <span
                  className={clsx(
                    "h-1 transition-all duration-300",
                    hamburgerBarClass,
                    sidebarOpen ? "w-0 opacity-0" : "w-6",
                  )}
                />
                <span
                  className={clsx(
                    "h-1 transition-all duration-300",
                    hamburgerBarClass,
                    sidebarOpen ? "w-6 -translate-y-1.5 -rotate-45" : "w-6",
                  )}
                />
              </button>

              <div className="absolute right-4 top-6 z-30">
                <ThemeToggle />
              </div>

              <aside
                className={clsx(
                  "absolute left-0 top-0 z-20 h-full border-r border-transparent backdrop-blur transition-all duration-300",
                  sidebarOpen
                    ? isDarkTheme
                      ? "w-[180px] border-white/10 bg-white/5"
                      : "w-[180px] border-[#d8d8d8] bg-gray-50/5"
                    : "w-0",
                )}
              >
                <div
                  className={clsx(
                    "transition-all duration-300",
                    sidebarOpen ? "mt-20 h-full px-4 py-5 opacity-100" : "h-0 opacity-0",
                  )}
                >
                  <nav className={sidebarNavClass}>
                    <NavItem label="discover" href="/unlstd" isDark={isDarkTheme} />
                    <NavItem label="designlabs" href="/designlabs" isDark={isDarkTheme} />
                    <NavItem label="MyEvents" href="/myevents" isDark={isDarkTheme} />
                    <NavItem label="marketplace" href="/marketplace" isDark={isDarkTheme} />
                    <NavItem label="Metrics" href="/metrics" isDark={isDarkTheme} />
                    <NavItem label="Settings" href="/settings" isDark={isDarkTheme} />
                  </nav>

                  <div
                    className={clsx(
                      "absolute inset-x-0 bottom-3 px-4 text-[13px]",
                      profileTextClass,
                    )}
                  >
                    <div
                      className={clsx(
                        "mb-2 h-10 w-10 rounded-full border",
                        isDarkTheme
                          ? "border-white/15 bg-[#1c1c1c]"
                          : "border-[#d0d0d0] bg-white/85",
                      )}
                    />
                    <div className="pl-0.5 text-xs opacity-70">Name</div>
                    <button
                      className={clsx(
                        "mt-2 rounded border px-2 py-1 text-left text-xs transition-colors",
                        isDarkTheme
                          ? "border-white/15 opacity-90 hover:bg-white/10"
                          : "border-[#d0d0d0] text-[#1f1f1f] hover:bg-white",
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
