'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Compass, 
  FlaskConical, 
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
          {/* 3D POP Logo */}
          <Pop3DLogo isDarkTheme={isDarkTheme} />
          {/* Spacer to push content down */}
          <div className="h-8"></div>
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

// 3D Interactive POP Logo Component
function Pop3DLogo({ isDarkTheme }: { isDarkTheme: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      setRotation((prev) => ({
        x: Math.max(-30, Math.min(30, prev.x + deltaY * 0.5)),
        y: prev.y + deltaX * 0.5,
      }));

      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, lastMousePos]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  // Auto-rotate when not dragging
  useEffect(() => {
    if (isDragging) return;

    const interval = setInterval(() => {
      setRotation((prev) => ({
        x: prev.x * 0.95, // Gradually return to center
        y: prev.y + 0.5, // Slow continuous rotation
      }));
    }, 16);

    return () => clearInterval(interval);
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className="relative h-32 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: '1200px' }}
    >
      <div
        className="relative"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* 3D Extruded Text - Using many thin layers for smooth extrusion */}
        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* Create smooth 3D extrusion with many layers */}
          {[...Array(30)].map((_, i) => {
            const depth = -i * 0.5;
            const opacity = Math.max(0, 1 - (i / 30) * 0.3); // Fade layers as they go back
            return (
              <div
                key={i}
                className={clsx(
                  "absolute inset-0 text-6xl sm:text-7xl font-black tracking-tight whitespace-nowrap",
                  isDarkTheme ? "text-white" : "text-black"
                )}
                style={{
                  transform: `translateZ(${depth}px)`,
                  transformStyle: 'preserve-3d',
                  opacity: opacity,
                  WebkitTextStroke: isDarkTheme 
                    ? `0.5px rgba(255,255,255,${opacity * 0.3})`
                    : `0.5px rgba(0,0,0,${opacity * 0.3})`,
                }}
              >
                <span>P</span>
                <span>O</span>
                <span>P</span>
                <span className="text-4xl sm:text-5xl ml-1">!</span>
              </div>
            );
          })}
          {/* Front face with glow */}
          <div
            className={clsx(
              "relative text-6xl sm:text-7xl font-black tracking-tight",
              isDarkTheme ? "text-white" : "text-black"
            )}
            style={{
              transform: 'translateZ(1px)',
              transformStyle: 'preserve-3d',
              textShadow: isDarkTheme
                ? `
                  0 0 15px rgba(255,255,255,0.4),
                  0 3px 6px rgba(0,0,0,0.6),
                  0 0 30px rgba(168,85,247,0.5),
                  0 0 60px rgba(236,72,153,0.4)
                `
                : `
                  0 0 15px rgba(0,0,0,0.3),
                  0 3px 6px rgba(0,0,0,0.4),
                  0 0 30px rgba(168,85,247,0.4),
                  0 0 60px rgba(236,72,153,0.3)
                `,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: 'translateZ(0px)',
              }}
            >
              P
            </span>
            <span
              style={{
                display: 'inline-block',
                transform: 'translateZ(3px)',
              }}
            >
              O
            </span>
            <span
              style={{
                display: 'inline-block',
                transform: 'translateZ(6px)',
              }}
            >
              P
            </span>
            <span
              className="text-4xl sm:text-5xl ml-1"
              style={{
                display: 'inline-block',
                transform: 'translateZ(9px)',
              }}
            >
              !
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

