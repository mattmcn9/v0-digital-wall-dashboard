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

### 📸 Photo Slideshow
- Rotating slideshow with fade transitions
- Photo captions and timestamps
- Fit-to-frame cropping
- Auto-dims in night mode
- Changes photo every 10 seconds

### 🌙 Night Mode
- Automatically activates between 8 PM - 6 AM
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
- **Build Tool**: Vercel
- **Font**: Geist Sans & Geist Mono

## Setup

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000)

## API Integration

The dashboard uses mock data by default. To connect real data sources:

### Google Calendar
Edit `api/google-calendar.ts` to integrate with Google Calendar API:
\`\`\`typescript
// Replace mock data with actual API calls
export async function getCalendarEvents(year: number, month: number) {
  // Add Google Calendar API integration here
}
\`\`\`

### Weather API
Edit `api/weather.ts` to integrate with a weather service:
\`\`\`typescript
// Use OpenWeatherMap, WeatherAPI, or similar
export async function getWeather() {
  // Add weather API integration here
}
\`\`\`

### Google Photos
Edit `api/google-photos.ts` to integrate with Google Photos API:
\`\`\`typescript
// Replace mock data with actual API calls
export async function getPhotos() {
  // Add Google Photos API integration here
}
\`\`\`

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
Edit `hooks/use-theme.ts` to customize night mode hours:
\`\`\`typescript
// Change the hour values
const isNight = hour >= 20 || hour < 6
\`\`\`

### Refresh Intervals
- Calendar: 10 minutes (in `hooks/use-calendar.ts`)
- Weather: 30 minutes (in `hooks/use-weather.ts`)
- Photos: 10 seconds per photo (in `hooks/use-photos.ts`)

## Design Notes

- Designed for 24"-32" displays
- Readable from 5-10 feet away
- Minimalist, calm aesthetic
- Optimized for always-on operation
- No memory leaks with proper cleanup

## License

MIT
