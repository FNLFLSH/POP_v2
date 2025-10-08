'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProcessedBuilding } from '@/lib/building-service';

interface BuildingContextType {
  buildingData: ProcessedBuilding | null;
  setBuildingData: (data: ProcessedBuilding | null) => void;
  clearBuildingData: () => void;
}

const BuildingContext = createContext<BuildingContextType | undefined>(undefined);

export function BuildingProvider({ children }: { children: ReactNode }) {
  const [buildingData, setBuildingData] = useState<ProcessedBuilding | null>(null);

  // Load building data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('pop-building-data');
    console.log('BuildingContext - Loading from localStorage:', savedData);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        console.log('BuildingContext - Parsed data:', parsed);
        setBuildingData(parsed);
      } catch (error) {
        console.error('Failed to parse saved building data:', error);
      }
    }
  }, []);

  // Save building data to localStorage whenever it changes
  useEffect(() => {
    if (buildingData) {
      console.log('BuildingContext - Saving to localStorage:', buildingData);
      localStorage.setItem('pop-building-data', JSON.stringify(buildingData));
    } else {
      console.log('BuildingContext - Clearing localStorage');
      localStorage.removeItem('pop-building-data');
    }
  }, [buildingData]);

  const clearBuildingData = () => {
    setBuildingData(null);
  };

  return (
    <BuildingContext.Provider value={{ buildingData, setBuildingData, clearBuildingData }}>
      {children}
    </BuildingContext.Provider>
  );
}

export function useBuilding() {
  const context = useContext(BuildingContext);
  if (context === undefined) {
    throw new Error('useBuilding must be used within a BuildingProvider');
  }
  return context;
}
