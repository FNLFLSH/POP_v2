'use client';

import ThemeToggle from './ThemeToggle';

interface GlobalThemeToggleProps {
  className?: string;
}

export default function GlobalThemeToggle({ className = "" }: GlobalThemeToggleProps) {
  return (
    <div className={`fixed top-6 right-6 z-50 ${className}`}>
      <ThemeToggle />
    </div>
  );
}
