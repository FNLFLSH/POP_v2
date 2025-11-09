'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchPage from '@/components/home/SearchPage';

export default function Home() {
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome page before
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = sessionStorage.getItem('popHasSeenWelcome');
      if (!hasSeenWelcome) {
        // First visit - show welcome page
        router.replace('/welcome');
      } else {
        // They've seen welcome, show search page
        setShouldRender(true);
      }
    } else {
      // Server-side: default to showing search page
      setShouldRender(true);
    }
  }, [router]);

  // Only render SearchPage after we've checked sessionStorage
  if (!shouldRender) {
    return null;
  }

  return <SearchPage />;
}