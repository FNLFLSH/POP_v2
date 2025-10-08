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
      return NextResponse.json({ error: 'No building footprint found' }, { status: 404 });
    }

    return NextResponse.json(footprint);
  } catch (error) {
    console.error('Building footprint error:', error);
    return NextResponse.json({ error: 'Failed to fetch building footprint' }, { status: 500 });
  }
}

async function getBuildingFootprint(lat: number, lon: number) {
  try {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = `
      [out:json];
      (
        way(around:50,${lat},${lon})["building"];
      );
      out geom;
    `;

    const response = await fetch(overpassUrl, {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'text/plain',
        'User-Agent': 'POP-UI/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Overpass API request failed');
    }

    const data = await response.json();
    
    if (data.elements && data.elements.length > 0) {
      // Find the building closest to our coordinates
      let closestBuilding = null;
      let minDistance = Infinity;
      
      for (const element of data.elements) {
        if (element.geometry) {
          // Calculate distance from center point
          const coords = element.geometry.map((pt: any) => [pt.lon, pt.lat]);
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
        return {
          coordinates: closestBuilding.geometry.map((pt: any) => [pt.lon, pt.lat]),
          type: 'polygon',
          properties: {
            id: closestBuilding.id,
            building_type: closestBuilding.tags?.building || 'unknown'
          }
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Building footprint error:', error);
    throw error;
  }
}
