# POP! Event Layout Manager - Database Setup

## 🗄️ Database Schema

This document outlines the complete database schema for the POP! Event Layout Manager.

## 📋 Tables Overview

### 1. **venues** - Venue Information & Caching
- Stores geocoded venue data with building footprints
- Caches API responses to avoid repeated geocoding calls
- Links to events hosted at each venue

### 2. **events** - Event Management
- Stores event information and metadata
- Links to venues and contains layout configuration
- Tracks event status (draft, active, completed)

### 3. **event_elements** - Layout Elements
- Individual draggable elements in event layouts
- Stores position, size, rotation, and properties
- Can be assigned to vendors or staff

### 4. **users** - User Management
- Basic user accounts and roles
- Future authentication integration

### 5. **vendors** - Vendor Information
- Vendor contact and business information
- Links to assigned event elements

## 🚀 Setup Instructions

### Step 1: Create Database Tables
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-schema.sql`
4. Click **Run** to create all tables, indexes, and policies

### Step 2: Environment Variables
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yydkydbadronupfabkul.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZGt5ZGJhZHJvbnVwZmFia3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5ODM0MTUsImV4cCI6MjA3NTU1OTQxNX0.dNO-yTkjSukMadLOOPryDMGAFtQnp63THOGZe0Jg7D0
```

### Step 3: Verify Setup
After running the schema, you should see these tables in your Supabase dashboard:
- ✅ venues
- ✅ events  
- ✅ event_elements
- ✅ users
- ✅ vendors

## 📊 Data Flow

### Venue Caching Flow:
1. User enters address → Check `venues` table
2. If found → Return cached data (instant)
3. If not found → Call geocoding APIs → Save to `venues` → Return data

### Event Creation Flow:
1. User selects venue → Create event in `events` table
2. User drags elements → Save each element to `event_elements` table
3. Elements linked to event via `event_id`

### Layout Management:
- Each event can have multiple elements
- Elements store position, size, rotation, and custom properties
- Elements can be assigned to vendors or staff members

## 🔧 API Endpoints

### Venue Operations:
- `POST /api/venue` - Get/create venue with caching
- `GET /api/venue/[id]` - Get specific venue

### Event Operations:
- `POST /api/events` - Create new event
- `GET /api/events/[id]` - Get event with elements
- `PUT /api/events/[id]` - Update event

### Element Operations:
- `POST /api/elements` - Add element to event
- `PUT /api/elements/[id]` - Update element
- `DELETE /api/elements/[id]` - Remove element

## 🎯 Next Steps

1. **Run the database schema** in Supabase
2. **Test venue caching** by entering addresses
3. **Create your first event** and add elements
4. **Implement drag-and-drop** with real-time saving

## 📝 Sample Data

### Sample Venue:
```json
{
  "address": "123 peachtree street, atlanta, ga",
  "lat": 33.7490,
  "lon": -84.3880,
  "display_name": "123 Peachtree Street, Atlanta, GA",
  "building_type": "commercial"
}
```

### Sample Event:
```json
{
  "venue_id": "venue-uuid",
  "name": "Summer Music Festival",
  "description": "Annual outdoor music festival",
  "status": "draft"
}
```

### Sample Element:
```json
{
  "event_id": "event-uuid",
  "element_type": "bar",
  "position_x": 10.5,
  "position_y": 15.2,
  "width": 2.0,
  "height": 1.0,
  "assigned_to": "John's Bar Service"
}
```



