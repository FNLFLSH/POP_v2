'use client';

import { useState, FormEvent, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';
import { useThemeContext } from '@/components/providers/ThemeProvider';
import { DottedPaperBackdrop, InnerGrid } from './HomeChrome';

export default function SearchPage() {
  const [address, setAddress] = useState('');
  const router = useRouter();
  const { theme } = useThemeContext();
  const isDarkTheme = theme === 'dark';
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [validating, setValidating] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const runSearchFlow = async () => {
    const sanitizedAddress = address.trim();
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

      if (typeof window !== "undefined") {
        localStorage.setItem("venueAddress", sanitizedAddress);
      }

      router.push(`/blueprint?address=${encodeURIComponent(sanitizedAddress)}`);
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
    await runSearchFlow();
  };

  const boardClassName = clsx(
    "h-full shadow-[0_0_32px_rgba(0,0,0,0.35)] transition-transform duration-500",
    isDarkTheme ? "bg-[#111111]" : "bg-[#fcfcfc]"
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

  const displaySpinner = validating;

  const cardBorderClass = isDarkTheme
    ? "border-[#3a3a3a] bg-[#1b1b1b]"
    : "border-[#d1d1d1] bg-white/85";

  const taglineClass = isDarkTheme ? "text-white/60" : "text-[#4a4a4a]/70";
  const exploreLinkClass = isDarkTheme
    ? "text-xs uppercase tracking-[0.35em] text-[#bdbdbd] hover:text-white transition-colors"
    : "text-xs uppercase tracking-[0.35em] text-[#5a5a5a] hover:text-[#1f1f1f] transition-colors";

  return (
    <div className={containerClassName}>
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
                <h1
                  className={clsx(
                    "font-black tracking-tight text-[38px] sm:text-[56px] leading-none transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                    isDarkTheme ? "text-white drop-shadow-[0_0_12px_rgba(0,0,0,0.6)]" : "text-[#1a1a1a] drop-shadow-[0_0_10px_rgba(0,0,0,0.15)]"
                  )}
                >
                  POP!
                </h1>
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
                              "pr-12",
                              addressError ? "border-red-500/60 focus:border-red-400 focus:ring-red-400/30" : "",
                              validating ? "opacity-70 cursor-wait" : ""
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
                            disabled={validating}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !validating && address.trim()) {
                                e.preventDefault();
                                runSearchFlow();
                              }
                            }}
                          />
                          <button
                            type="submit"
                            onClick={runSearchFlow}
                            className={clsx(
                              "absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                              validating
                                ? "bg-white/30 cursor-not-allowed"
                                : "bg-white/20 hover:bg-white/30 hover:scale-105 active:scale-95"
                            )}
                            aria-label="Search address"
                            disabled={validating || !address.trim()}
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
                  {validating && (
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Locating venue...</span>
                    </div>
                  )}
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

              {/* Theme Toggle Button - Top right */}
              <div className="absolute right-4 top-6 z-30">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

