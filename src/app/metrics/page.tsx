'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MetricsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings?tab=metrics');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="text-sm uppercase tracking-[0.35em] mb-2">Redirecting to Settings...</div>
      </div>
    </div>
  );
}
