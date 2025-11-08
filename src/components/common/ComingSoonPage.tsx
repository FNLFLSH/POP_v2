'use client';

import Link from "next/link";
import { Calendar, Settings } from "lucide-react";
import GlobalThemeToggle from "./GlobalThemeToggle";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import clsx from "clsx";

interface ComingSoonPageProps {
  title: string;
}

export default function ComingSoonPage({ title }: ComingSoonPageProps) {
  const { theme } = useThemeContext();
  const isDarkTheme = theme === 'dark';

  // Get icon based on title
  const getIcon = () => {
    if (title === "My Events") {
      return <Calendar className={clsx("h-8 w-8", isDarkTheme ? "text-white" : "text-black")} />;
    }
    if (title === "Settings") {
      return <Settings className={clsx("h-8 w-8", isDarkTheme ? "text-white" : "text-black")} />;
    }
    return null;
  };

  return (
    <div className={clsx(
      "h-screen w-screen overflow-hidden transition-colors duration-500",
      isDarkTheme ? "bg-[#0e0e0e] text-white" : "bg-[#f5f5f5] text-[#1a1a1a]"
    )}>
      <GlobalThemeToggle />
      {/* Outer dotted paper backdrop */}
      <div className="relative h-full w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: isDarkTheme
              ? "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)"
              : "radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            backgroundPosition: "-9px -9px",
          }}
        >
          <div className={clsx(
            "absolute right-2 top-2 h-10 w-10 rounded-tl-[22px] border-l-2 border-t-2",
            isDarkTheme ? "border-white/30" : "border-black/20"
          )} />
        </div>

        {/* Main content */}
        <div className="relative h-full w-full">
          <div className={clsx(
            "h-full shadow-xl transition-colors duration-500",
            isDarkTheme ? "bg-[#1f1f1f]" : "bg-white"
          )}>
            {/* Header */}
            <div className="relative p-6">
              {/* Title - centered - removed since POP! is now universal */}
            </div>

            {/* Coming Soon Content */}
            <div className="flex flex-col items-center justify-center h-[calc(100%-120px)] text-center px-6">
              <div className="mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {getIcon()}
                  <h1 className={clsx(
                    "font-black tracking-tight text-[32px] sm:text-[48px] leading-none",
                    isDarkTheme ? "text-[#ff4d00]" : "text-[#1a1a1a]"
                  )}>
                    {title}
                  </h1>
                </div>
                <h2 className={clsx(
                  "text-4xl font-bold mb-4",
                  isDarkTheme ? "text-white" : "text-black"
                )}>Coming Soon</h2>
                <p className={clsx(
                  "text-xl max-w-md",
                  isDarkTheme ? "text-gray-400" : "text-gray-600"
                )}>
                  We&apos;re working hard to bring you {title.toLowerCase()}. 
                  Check back soon for updates!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
