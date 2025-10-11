import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { lat, lon } = await request.json();
    
    if (!lat || !lon) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    // Fetch building footprint from Overpass API
    const footprint = await getBuildingFootprint(lat, lon);

    if (!footprint) {
      console.log('No footprint detected, returning synthesized outline');
      return NextResponse.json(createMockFootprint(lat, lon));
    }

    return NextResponse.json(footprint);
  } catch (error) {
    console.error('Building footprint error:', error);
    return NextResponse.json({ error: 'Failed to fetch building footprint' }, { status: 500 });
  }
}

async function getBuildingFootprint(lat: number, lon: number) {
  try {
    console.log(`Searching for buildings near ${lat}, ${lon}`);
    
    // Try multiple search strategies
    const searchStrategies = [
      // Strategy 1: Small radius for exact location
      { radius: 50, name: 'exact' },
      // Strategy 2: Medium radius for nearby buildings
      { radius: 200, name: 'nearby' },
      // Strategy 3: Large radius for any building
      { radius: 500, name: 'wide' }
    ];

    for (const strategy of searchStrategies) {
      console.log(`Trying ${strategy.name} search with radius ${strategy.radius}m`);
      
      const overpassUrl = 'https://overpass-api.de/api/interpreter';
      const query = `
        [out:json];
        (
          way(around:${strategy.radius},${lat},${lon})["building"];
          relation(around:${strategy.radius},${lat},${lon})["building"];
        );
        out geom;
      `;

      const response = await fetch(overpassUrl, {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'text/plain',
          'User-Agent': 'POP-Event-Manager/1.0'
        },
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        console.warn(`Overpass API request failed: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`Found ${data.elements?.length || 0} elements with ${strategy.name} search`);
      
      if (data.elements && data.elements.length > 0) {
        // Find the building closest to our coordinates
        let closestBuilding = null;
        let minDistance = Infinity;
        
        for (const element of data.elements) {
          if (element.geometry && element.geometry.length > 2) { // Ensure it's a valid polygon
            // Calculate distance from center point
            const coords = element.geometry.map((pt: { lon: number; lat: number }) => [pt.lon, pt.lat]);
            const centerLon = coords.reduce((sum: number, pt: number[]) => sum + pt[0], 0) / coords.length;
            const centerLat = coords.reduce((sum: number, pt: number[]) => sum + pt[1], 0) / coords.length;
            
            const distance = Math.sqrt(
              Math.pow(centerLat - lat, 2) + Math.pow(centerLon - lon, 2)
            );
            
            if (distance < minDistance) {
              minDistance = distance;
              closestBuilding = element;
            }
          }
        }
        
        if (closestBuilding && closestBuilding.geometry) {
          console.log(`Found building: ${closestBuilding.tags?.name || 'Unnamed'} (${closestBuilding.tags?.building || 'unknown'})`);
          return {
            coordinates: closestBuilding.geometry.map((pt: { lon: number; lat: number }) => [pt.lon, pt.lat]),
            type: 'polygon',
            properties: {
              id: closestBuilding.id,
              building_type: closestBuilding.tags?.building || 'unknown',
              name: closestBuilding.tags?.name || 'Unnamed Building',
              distance: minDistance
            }
          };
        }
      }
    }
    
    console.log('No precise building returned by Overpass');
    return null;
  } catch (error) {
    console.error('Building footprint error:', error);
    return null;
  }
}

function createMockFootprint(lat: number, lon: number) {
  const sizeLat = 0.00035; // ~40m
  const sizeLon = 0.00045; // ~45m

  return {
    coordinates: [
      [lon - sizeLon, lat - sizeLat],
      [lon + sizeLon, lat - sizeLat],
      [lon + sizeLon, lat + sizeLat],
      [lon - sizeLon, lat + sizeLat],
      [lon - sizeLon, lat - sizeLat],
    ],
    type: 'polygon',
    properties: {
      id: 'synthetic-building',
      building_type: 'venue',
      name: 'Synthesized Footprint',
      distance: 0,
    },
  };
}
