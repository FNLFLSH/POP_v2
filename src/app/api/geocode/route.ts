import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();
    
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Geocode the address using Nominatim
    const geocoded = await geocodeAddress(address);
    
    if (!geocoded) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json(geocoded);
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
  }
}

async function geocodeAddress(address: string) {
  try {
    const url = 'https://nominatim.openstreetmap.org/search';
    const params = new URLSearchParams({
      q: address,
      format: 'json',
      limit: '1',
      addressdetails: '1'
    });

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'User-Agent': 'POP-UI/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name,
        address: result.address
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}
