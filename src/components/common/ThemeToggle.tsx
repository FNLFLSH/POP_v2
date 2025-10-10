'use client';

import { useEffect, useState } from 'react';
import { useThemeContext } from '@/components/providers/ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useThemeContext();
  const [isPressed, setIsPressed] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!mounted) return;
    setIsPressed(false);
  }, [mounted, theme]);

  const toggleTheme = () => {
    setIsPressed(true);
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  if (!mounted) {
    return <div className="h-12 w-12" />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      aria-pressed={isDark}
      className={`group relative h-12 w-12 rounded-full border border-[#cfcfcf] bg-gradient-to-br from-[#fbfbfb] to-[#d9d9d9] p-[3px] shadow-[0_0_18px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 ${isPressed ? 'animate-pulse' : ''}`}
    >
      <div
        className={`yin-toggle-face absolute inset-0 overflow-hidden rounded-full bg-[#1a1a1a] transition-transform duration-500 ease-out ${isDark ? 'rotate-180' : 'rotate-0'}`}
      >
        <div className="absolute inset-0 flex flex-col">
          <div className="h-1/2 bg-[#f4f4f4]" />
          <div className="h-1/2 bg-[#2a2a2a]" />
        </div>
        <div className="absolute left-1/2 top-[25%] h-[32%] w-[32%] -translate-x-1/2 rounded-full bg-[#2a2a2a] shadow-[0_0_10px_rgba(0,0,0,0.45)]" />
        <div className="absolute left-1/2 bottom-[25%] h-[32%] w-[32%] -translate-x-1/2 rounded-full bg-[#f4f4f4] shadow-[0_0_10px_rgba(0,0,0,0.18)]" />
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
    </button>
  );
}
