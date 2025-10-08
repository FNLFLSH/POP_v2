'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBuilding } from '@/contexts/BuildingContext';

export default function PopLogo() {
  const router = useRouter();
  const { clearBuildingData } = useBuilding();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Clear any existing building data
    clearBuildingData();
    // Navigate to home page
    router.push('/');
  };

  return (
    <button
      onClick={handleClick}
      className="text-5xl font-black tracking-tight text-[#ff4d00] hover:text-[#e64400] transition-colors cursor-pointer drop-shadow-lg"
      title="Back to Home - Start Fresh"
    >
      POP!
    </button>
  );
}
