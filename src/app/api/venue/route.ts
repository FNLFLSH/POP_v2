import { NextRequest, NextResponse } from 'next/server';
import { VenueService } from '@/lib/venue-service';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();
    
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    console.log('Fetching venue data for:', address);

    // Use the venue service with Supabase caching
    const venueData = await VenueService.getVenue(address);
    
    if (!venueData) {
      return NextResponse.json({ error: 'Failed to fetch venue data' }, { status: 500 });
    }

    console.log('Venue data retrieved:', {
      address: venueData.address,
      display_name: venueData.display_name,
      has_footprint: !!venueData.building_footprint
    });

    return NextResponse.json(venueData);
  } catch (error) {
    console.error('Venue API error:', error);
    return NextResponse.json({ error: 'Failed to fetch venue data' }, { status: 500 });
  }
}


