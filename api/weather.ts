// Mock API for weather data
// In production, this would call a real weather API like OpenWeatherMap

export type WeatherCondition = "sunny" | "cloudy" | "partly-cloudy" | "rain" | "snow" | "thunderstorm"

export type SunTimes = {
  sunrise: Date
  sunset: Date
}

export type WeatherData = {
  temperature: number
  high: number
  low: number
  condition: WeatherCondition
  description: string
  location: string
  sunTimes: SunTimes
}

/**
 * Calculate sunrise and sunset times for a given location and date.
 * Uses the NOAA solar calculator algorithm.
 * @param lat Latitude in degrees
 * @param lng Longitude in degrees
 * @param date The date to calculate for
 * @returns Object with sunrise and sunset as Date objects
 */
export function calculateSunTimes(lat: number, lng: number, date: Date = new Date()): SunTimes {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const toDeg = (rad: number) => (rad * 180) / Math.PI

  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Solar declination angle
  const declination = -23.45 * Math.cos(toRad((360 / 365) * (dayOfYear + 10)))

  // Hour angle at sunrise/sunset
  const latRad = toRad(lat)
  const decRad = toRad(declination)
  
  const cosHourAngle = -Math.tan(latRad) * Math.tan(decRad)
  
  // Clamp for polar regions where sun may not set/rise
  const clampedCos = Math.max(-1, Math.min(1, cosHourAngle))
  const hourAngle = toDeg(Math.acos(clampedCos))

  // Equation of time correction (in minutes)
  const B = toRad((360 / 365) * (dayOfYear - 81))
  const equationOfTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)

  // Solar noon in minutes from midnight UTC
  const solarNoon = 720 - 4 * lng - equationOfTime

  // Sunrise and sunset in minutes from midnight UTC
  const sunriseMinutes = solarNoon - hourAngle * 4
  const sunsetMinutes = solarNoon + hourAngle * 4

  // Create Date objects for sunrise and sunset
  const sunrise = new Date(date)
  sunrise.setUTCHours(0, 0, 0, 0)
  sunrise.setUTCMinutes(sunriseMinutes)

  const sunset = new Date(date)
  sunset.setUTCHours(0, 0, 0, 0)
  sunset.setUTCMinutes(sunsetMinutes)

  return { sunrise, sunset }
}

// Default coordinates for San Francisco
const DEFAULT_LAT = 37.7749
const DEFAULT_LNG = -122.4194

export async function getWeather(): Promise<WeatherData> {
  // Mock data - replace with actual weather API calls
  // You can use APIs like OpenWeatherMap, WeatherAPI, etc.

  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  const sunTimes = calculateSunTimes(DEFAULT_LAT, DEFAULT_LNG)

  return {
    temperature: 72,
    high: 78,
    low: 65,
    condition: "partly-cloudy",
    description: "Partly cloudy",
    location: "San Francisco, CA",
    sunTimes,
  }
}
