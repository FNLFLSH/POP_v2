'use client';

import { useThemeContext } from '@/components/providers/ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useThemeContext();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button className="relative h-6 w-12 cursor-pointer">
        <div className="absolute top-0 left-0 h-6 w-6 rounded-full bg-gray-300" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative h-6 w-12 cursor-pointer"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Black Circle */}
      <div 
        className={`absolute top-0 h-6 w-6 rounded-full transition-all duration-300 ${
          theme === 'dark' 
            ? 'left-0 bg-black z-10 scale-100' 
            : 'left-3 bg-black z-0 scale-90'
        }`}
      />
      
      {/* White Circle */}
      <div 
        className={`absolute top-0 h-6 w-6 rounded-full transition-all duration-300 ${
          theme === 'light' 
            ? 'left-0 bg-white z-10 scale-100' 
            : 'left-3 bg-white z-0 scale-90'
        }`}
      />
    </button>
  );
}
