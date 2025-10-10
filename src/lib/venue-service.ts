import { supabase, VenueData } from './supabase'

export class VenueService {
  // Check if venue data already exists in Supabase
  static async getCachedVenue(address: string): Promise<VenueData | null> {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('address', address.toLowerCase().trim())
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching cached venue:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getCachedVenue:', error)
      return null
    }
  }

  // Save venue data to Supabase for caching
  static async saveVenue(venueData: VenueData): Promise<VenueData | null> {
    try {
      const { data, error } = await supabase
        .from('venues')
        .upsert({
          address: venueData.address.toLowerCase().trim(),
          lat: venueData.lat,
          lon: venueData.lon,
          display_name: venueData.display_name,
          building_footprint: venueData.building_footprint,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving venue:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in saveVenue:', error)
      return null
    }
  }

  // Get venue with caching - tries cache first, then API
  static async getVenue(address: string): Promise<VenueData | null> {
    // First, try to get from cache
    const cachedVenue = await this.getCachedVenue(address)
    if (cachedVenue) {
      console.log('Using cached venue data for:', address)
      return cachedVenue
    }

    // If not cached, fetch from APIs
    console.log('Fetching fresh venue data for:', address)
    
    try {
      // Step 1: Geocode the address
      const geocodeResponse = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })

      if (!geocodeResponse.ok) {
        throw new Error('Failed to geocode address')
      }

      const geocodeData = await geocodeResponse.json()

      // Step 2: Get building footprint
      const footprintResponse = await fetch('/api/building-footprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lat: geocodeData.lat, 
          lon: geocodeData.lon 
        })
      })

      if (!footprintResponse.ok) {
        throw new Error('Failed to get building footprint')
      }

      const footprintData = await footprintResponse.json()

      // Create venue data object
      const venueData: VenueData = {
        address: address.toLowerCase().trim(),
        lat: geocodeData.lat,
        lon: geocodeData.lon,
        display_name: geocodeData.display_name,
        building_footprint: footprintData
      }

      // Save to cache for future use
      await this.saveVenue(venueData)

      return venueData
    } catch (error) {
      console.error('Error fetching venue data:', error)
      return null
    }
  }
}


