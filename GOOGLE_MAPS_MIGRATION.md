# Google Maps Migration

This document outlines the migration from Mapbox to Google Maps for the collision towing website.

## Changes Made

### 1. Updated Dependencies

- **Removed**: `mapbox-gl` package
- **Added**: `@googlemaps/js-api-loader` and `@types/google.maps`

### 2. Updated Components

#### Map Component (`src/components/Map.tsx`)

- Replaced Mapbox GL JS with Google Maps JavaScript API
- Uses Google Maps Geocoding API for reverse geocoding
- Maintains all existing functionality:
  - City markers for Phoenix metro area
  - Shop location marker with custom styling
  - User location detection and marker
  - Distance calculations
  - Dark/light theme support
- Added loading state for better UX

#### LocationButton Component (`src/components/LocationButton.tsx`)

- Updated geocoding to use Google Maps Geocoding API instead of Mapbox
- Changed API key from `PUBLIC_MAPBOX_TOKEN` to `PUBLIC_GOOGLE_MAPS_API_KEY`

## Configuration

### Environment Variable

Add the following to your `.env` file:

```
PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API (optional, for future enhancements)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### Required Google Maps APIs

- **Maps JavaScript API**: For displaying the interactive map
- **Geocoding API**: For converting coordinates to addresses

## Features Preserved

- ✅ Interactive map with zoom/pan controls
- ✅ City markers for Phoenix metro area
- ✅ Shop location marker with custom styling
- ✅ User location detection and display
- ✅ Distance calculations between locations
- ✅ Reverse geocoding (coordinates to address)
- ✅ Dark/light theme support
- ✅ Responsive design
- ✅ Loading states and error handling

## Benefits of Google Maps

1. **Better Integration**: Works seamlessly with Google services
2. **Reliability**: High uptime and performance
3. **Feature Rich**: Extensive API capabilities
4. **Familiar Interface**: Users are familiar with Google Maps
5. **Mobile Optimization**: Excellent mobile experience

## Development Notes

- The Google Maps loader uses a CommonJS export, requiring a specific import pattern
- Type definitions are provided by `@types/google.maps`
- Map styles for dark mode are configured using Google Maps styling arrays
- Markers use Google Maps symbol paths for consistent appearance

## Testing

The implementation has been tested to ensure:

- Map loads correctly with proper styling
- Markers appear in correct locations
- User location detection works
- Geocoding provides accurate addresses
- Theme switching updates map appearance
