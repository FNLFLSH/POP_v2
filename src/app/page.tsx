'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchPage from '@/components/home/SearchPage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has seen the welcome page before
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = sessionStorage.getItem('popHasSeenWelcome');
      if (!hasSeenWelcome) {
        // First visit - show welcome page
        router.replace('/welcome');
        return;
      }
    }
  }, [router]);

  // If they've seen welcome, show search page
  return <SearchPage />;
}