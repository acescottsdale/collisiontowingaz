# Location Button Setup Guide

The LocationButton component allows users to share their current location with emergency services and copy location details for sharing. This guide explains how to set up the required API keys.

## Features

- 🗺️ Get current GPS location
- 📍 Display location on Google Maps
- 📋 Copy address and coordinates to clipboard
- 📱 Share location via SMS
- 📞 Direct call to towing service
- 🎯 Reverse geocoding for human-readable addresses

## API Keys Setup

### 1. Google Maps API Key (Optional but Recommended)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Maps Embed API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security
6. Add the key to your `.env` file:

```bash
PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2. Mapbox Token (Optional - for Address Lookup)

1. Sign up at [Mapbox](https://www.mapbox.com/)
2. Get your public access token
3. Add it to your `.env` file:

```bash
PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Edit the `.env` file:

```bash
# Google Maps API Configuration
PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Mapbox API Configuration (alternative to Google Maps for geocoding)
PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

## Fallback Behavior

The component works even without API keys:

- **Without Google Maps API**: Shows coordinates instead of map preview
- **Without Mapbox Token**: Uses GPS coordinates instead of human-readable address
- **Without Geolocation Permission**: Shows error with retry option

## Component Features

### Location Detection

- Uses browser's Geolocation API
- High accuracy positioning
- 10-second timeout with retry option
- Handles permission denied gracefully

### Address Resolution

- Reverse geocoding via Mapbox API
- Fallback to coordinates if API unavailable
- Human-readable street addresses

### Sharing Options

- Copy address to clipboard
- Copy coordinates to clipboard
- SMS sharing (mobile-optimized)
- Direct call to towing service
- Open in Google Maps

### User Experience

- Floating action button in bottom-right corner
- Responsive design for all screen sizes
- Loading states and error handling
- Accessibility features (ARIA labels, keyboard navigation)
- Visual feedback with animations

## Usage

The LocationButton is automatically included on all pages via the Layout.astro file. Users can:

1. Click the floating map pin button
2. Allow location access when prompted
3. View their location on the map
4. Copy or share their location details
5. Call the towing service directly

## Browser Compatibility

- Modern browsers with Geolocation API support
- HTTPS required for location access
- Mobile-friendly SMS sharing
- Desktop fallback for non-mobile devices

## Security Considerations

- Always restrict API keys to your domain
- Use environment variables for sensitive keys
- HTTPS is required for geolocation
- No location data is stored or transmitted to your servers

## Troubleshooting

### Location Not Working

- Ensure HTTPS is enabled
- Check browser location permissions
- Verify user granted location access

### Map Not Showing

- Verify Google Maps API key is correct
- Check API key restrictions and quotas
- Ensure Maps Embed API is enabled

### Address Shows Coordinates

- Check Mapbox token configuration
- Verify token has geocoding permissions
- Check console for API errors
