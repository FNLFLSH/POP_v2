import { supabase, VenueData, EventData, EventElement } from './supabase'

export class EventService {
  // VENUE OPERATIONS
  static async getCachedVenue(address: string): Promise<VenueData | null> {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('address', address.toLowerCase().trim())
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching cached venue:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getCachedVenue:', error)
      return null
    }
  }

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
          building_type: venueData.building_type || 'venue',
          building_name: venueData.building_name,
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

  // EVENT OPERATIONS
  static async createEvent(eventData: Omit<EventData, 'id' | 'created_at' | 'updated_at'>): Promise<EventData | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          venue_id: eventData.venue_id,
          name: eventData.name,
          description: eventData.description,
          event_date: eventData.event_date,
          status: eventData.status || 'draft',
          layout_data: eventData.layout_data
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating event:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in createEvent:', error)
      return null
    }
  }

  static async getEvent(eventId: string): Promise<EventData | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (error) {
        console.error('Error fetching event:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getEvent:', error)
      return null
    }
  }

  static async updateEvent(eventId: string, updates: Partial<EventData>): Promise<EventData | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single()

      if (error) {
        console.error('Error updating event:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in updateEvent:', error)
      return null
    }
  }

  // EVENT ELEMENT OPERATIONS
  static async addElement(elementData: Omit<EventElement, 'id' | 'created_at' | 'updated_at'>): Promise<EventElement | null> {
    try {
      const { data, error } = await supabase
        .from('event_elements')
        .insert({
          event_id: elementData.event_id,
          element_type: elementData.element_type,
          position_x: elementData.position_x,
          position_y: elementData.position_y,
          width: elementData.width || 1.0,
          height: elementData.height || 1.0,
          rotation: elementData.rotation || 0.0,
          properties: elementData.properties,
          assigned_to: elementData.assigned_to
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding element:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in addElement:', error)
      return null
    }
  }

  static async getEventElements(eventId: string): Promise<EventElement[]> {
    try {
      const { data, error } = await supabase
        .from('event_elements')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching event elements:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getEventElements:', error)
      return []
    }
  }

  static async updateElement(elementId: string, updates: Partial<EventElement>): Promise<EventElement | null> {
    try {
      const { data, error } = await supabase
        .from('event_elements')
        .update(updates)
        .eq('id', elementId)
        .select()
        .single()

      if (error) {
        console.error('Error updating element:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in updateElement:', error)
      return null
    }
  }

  static async deleteElement(elementId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('event_elements')
        .delete()
        .eq('id', elementId)

      if (error) {
        console.error('Error deleting element:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteElement:', error)
      return false
    }
  }

  // COMPLETE EVENT WITH ELEMENTS
  static async getCompleteEvent(eventId: string): Promise<{
    event: EventData | null
    venue: VenueData | null
    elements: EventElement[]
  }> {
    try {
      const event = await this.getEvent(eventId)
      if (!event) {
        return { event: null, venue: null, elements: [] }
      }

      const venue = await this.getCachedVenue(event.venue_id)
      const elements = await this.getEventElements(eventId)

      return { event, venue, elements }
    } catch (error) {
      console.error('Error in getCompleteEvent:', error)
      return { event: null, venue: null, elements: [] }
    }
  }
}


