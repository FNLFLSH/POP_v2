'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Compass, 
  FlaskConical, 
  Calendar, 
  Store, 
  Settings,
  Menu
} from "lucide-react";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/unlstd", label: "Discover", icon: Compass },
  { href: "/designlabs", label: "Design Labs", icon: FlaskConical },
  { href: "/myevents", label: "My Events", icon: Calendar },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function UniversalHamburger() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useThemeContext();
  const isDarkTheme = theme === 'dark';

  // Don't show on welcome page
  if (pathname === '/welcome') {
    return null;
  }

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button - Only visible when menu is closed */}
      {!isOpen && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={clsx(
            "fixed top-4 left-4 z-[100] flex items-center justify-center h-12 w-12 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-105 pointer-events-auto",
            isDarkTheme
              ? "border-white/20 bg-[#0a0a0a]/80 hover:bg-[#1a1a1a]/90 text-white"
              : "border-black/20 bg-white/80 hover:bg-white text-black"
          )}
          aria-label="Open navigation menu"
          type="button"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={(e) => {
            // Close menu when clicking on overlay (outside the sidebar)
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        />
      )}

      {/* Sidebar Menu */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-[95] h-full w-72 max-w-[80vw] border-r backdrop-blur-md",
          isDarkTheme
            ? "border-white/10 bg-[#0a0a0a]/95"
            : "border-black/10 bg-white/95"
        )}
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease-in-out',
        }}
      >
        <div className="flex flex-col h-full p-6 pt-6 overflow-y-auto">
          {/* Spacer to push content down below the X button */}
          <div className="h-40"></div>
          {/* Navigation Items - Slimmed */}
          <nav className="flex-1 space-y-2 px-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              // Special handling for settings - also active on /metrics
              const isActive = item.href === '/settings' 
                ? (pathname === '/settings' || pathname === '/metrics')
                : (pathname === item.href || 
                   (item.href !== '/' && pathname?.startsWith(item.href)));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    "flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200",
                    isActive
                      ? isDarkTheme
                        ? "bg-white/10 text-white border border-white/20"
                        : "bg-black/10 text-black border border-black/20"
                      : isDarkTheme
                      ? "text-white/70 hover:bg-white/5 hover:text-white"
                      : "text-black/70 hover:bg-black/5 hover:text-black"
                  )}
                >
                  <Icon className={clsx(
                    "h-6 w-6 flex-shrink-0",
                    isActive 
                      ? isDarkTheme ? "text-white" : "text-black"
                      : isDarkTheme ? "text-white/60" : "text-black/60"
                  )} />
                  <span className="text-base font-medium tracking-wide">
                    {item.label}
                  </span>
                  {isActive && (
                    <div className={clsx(
                      "ml-auto h-2 w-2 rounded-full",
                      isDarkTheme ? "bg-white" : "bg-black"
                    )} />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

