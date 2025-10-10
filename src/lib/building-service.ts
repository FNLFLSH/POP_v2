/**
 * Building service for handling the complete flow from address to building template
 */

export interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
  address: Record<string, unknown>;
}

export interface BuildingFootprint {
  coordinates: [number, number][];
  type: 'polygon';
  properties: {
    id: number;
    building_type: string;
  };
}

export interface ProcessedBuilding {
  simplified: {
    coordinates: { x: number; y: number }[];
    type: 'rectangle' | 'l-shape' | 'u-shape' | 'complex';
    bounds: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    };
  };
  svg: string;
  metadata: {
    originalPoints: number;
    simplifiedPoints: number;
    shapeType: string;
  };
}

export class BuildingService {
  /**
   * Complete flow: address -> geocoded -> footprint -> processed building
   */
  static async processAddress(address: string): Promise<ProcessedBuilding> {
    try {
      console.log('BuildingService - Processing address:', address);
      
      // Step 1: Geocode the address
      const geocoded = await this.geocodeAddress(address);
      console.log('BuildingService - Geocoded:', geocoded);
      if (!geocoded) {
        throw new Error('Address not found');
      }

      // Step 2: Get building footprint
      const footprint = await this.getBuildingFootprint(geocoded.lat, geocoded.lon);
      console.log('BuildingService - Footprint:', footprint);
      if (!footprint) {
        throw new Error('No building footprint found for this address');
      }

      // Step 3: Process the building footprint
      const processed = await this.processBuildingFootprint(footprint.coordinates);
      console.log('BuildingService - Processed:', processed);
      
      return processed;
    } catch (error) {
      console.error('Building processing error:', error);
      throw error;
    }
  }

  /**
   * Geocode an address using the API
   */
  static async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    const response = await fetch('/api/geocode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    return response.json();
  }

  /**
   * Get building footprint using the API
   */
  static async getBuildingFootprint(lat: number, lon: number): Promise<BuildingFootprint | null> {
    const response = await fetch('/api/building-footprint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lon }),
    });

    if (!response.ok) {
      throw new Error('Building footprint fetch failed');
    }

    return response.json();
  }

  /**
   * Process building footprint using the API
   */
  static async processBuildingFootprint(coordinates: [number, number][]): Promise<ProcessedBuilding> {
    const response = await fetch('/api/process-building', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordinates }),
    });

    if (!response.ok) {
      throw new Error('Building processing failed');
    }

    return response.json();
  }
}
