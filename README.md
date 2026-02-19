# Digital Wall Dashboard

A full-screen, wall-mounted digital dashboard UI that displays a monthly calendar, local weather, and a rotating photo slideshow. Features automatic night mode and special holiday themes.

## Features

### 🗓️ Monthly Calendar View
- Full-month grid showing all days
- Event integration (Google Calendar API ready)
- Today highlighting
- Color-coded event categories
- Responsive layout readable from 5-10 feet

### 🌤️ Weather Widget
- Current temperature display
- Weather condition icons
- High/low temperature
- Location display
- Auto-refreshes every 30 minutes

### 📸 Photo & Video Slideshow
- Rotating slideshow with fade transitions
- Supports both photos and videos
- Photo captions and timestamps
- Fit-to-frame cropping
- Auto-dims in night mode
- Photos display for 25 seconds, videos up to 3 minutes

### 🌙 Night Mode
- Activates based on actual sunrise/sunset times for your location
- Falls back to 8 PM - 6 AM Eastern Time if location unavailable
- Reduced brightness and dark theme
- Dimmed photo slideshow
- Optimized for nighttime viewing

### 🎉 Holiday Themes
- Automatic holiday detection
- Special color palettes for:
  - 🎆 July 4th (fireworks animation)
  - 🎄 Christmas (snow animation)
  - 🎃 Halloween (spooky theme)
- Custom animations and overlays

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: TailwindCSS v4
- **Testing**: Vitest with React Testing Library
- **Date Handling**: date-fns
- **Package Manager**: pnpm
- **Build/Deploy**: Vercel
- **Font**: Geist Sans & Geist Mono

## Setup

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`
3. Add photos/videos to `public/photos/` directory (optional)
4. Run the development server:
   \`\`\`bash
   pnpm dev
   \`\`\`
5. Open [http://localhost:3000](http://localhost:3000)

## API Integration

The dashboard includes working integrations for weather and local photos. Calendar uses mock data by default.

### Google Calendar
Edit `api/google-calendar.ts` to integrate with Google Calendar API:
\`\`\`typescript
// Replace mock data with actual API calls
export async function getCalendarEvents(year: number, month: number) {
  // Add Google Calendar API integration here
}
\`\`\`

### Weather API
The weather integration is fully implemented using free APIs (no API key required):
- **Open-Meteo API**: Provides current temperature, high/low, and weather conditions
- **OpenStreetMap Nominatim**: Reverse geocoding for location display
- **Browser Geolocation**: Automatically detects user location
- **Sunrise/Sunset**: Calculated using NOAA solar algorithm for accurate night mode timing

The weather updates automatically and requires no configuration.

### Local Photos & Videos
Place your media files in the `public/photos/` directory. Supported formats:
- **Images**: .jpg, .jpeg, .png, .webp, .gif, .svg
- **Videos**: .mp4, .webm, .mov

The slideshow automatically picks up files from this directory via the `/api/photos` route.

## Deployment

Deploy to Vercel with one click or run in kiosk mode locally:

### Kiosk Mode
For a wall-mounted display, run your browser in kiosk mode:

**Chrome:**
\`\`\`bash
chrome --kiosk --app=http://localhost:3000
\`\`\`

**Firefox:**
\`\`\`bash
firefox --kiosk http://localhost:3000
\`\`\`

## Customization

### Holiday Themes
Edit `config/holidays.json` to add or modify holiday themes:
\`\`\`json
{
  "myHoliday": {
    "dates": ["MM-DD"],
    "theme": "themeName",
    "colors": {
      "primary": "oklch(...)",
      "secondary": "oklch(...)",
      "accent": "oklch(...)"
    }
  }
}
\`\`\`

### Night Mode Schedule
Night mode uses actual sunrise/sunset times when weather data is available. To customize the fallback hours, edit `hooks/use-theme.ts`:
\`\`\`typescript
// Change the fallback hour values (used when location unavailable)
export function isNightByHour(hour: number): boolean {
  return hour >= 20 || hour < 6
}
\`\`\`

### Refresh Intervals
- Calendar: 10 minutes (in `hooks/use-calendar.ts`)
- Photos: 25 seconds per photo, videos up to 3 minutes (in `hooks/use-photos.ts`)
- Night mode check: every 1 minute (in `hooks/use-theme.ts`)

## Testing

The project includes a comprehensive test suite using Vitest and React Testing Library.

### Running Tests
```bash
pnpm test              # Run all tests once
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
```

### Test Structure
- `__tests__/unit/` - Unit tests for utility functions and API helpers
- `__tests__/integration/` - Integration tests for React hooks and API routes

## Design Notes

- Designed for 24"-32" displays
- Readable from 5-10 feet away
- Minimalist, calm aesthetic
- Optimized for always-on operation
- No memory leaks with proper cleanup

## License

MIT
