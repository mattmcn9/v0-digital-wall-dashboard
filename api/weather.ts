// Weather API using Open-Meteo (free, no API key required)
// https://open-meteo.com/

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

type Coordinates = {
  latitude: number
  longitude: number
  city?: string
  region?: string
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

const WMO_CODE_MAP: Record<number, { condition: WeatherCondition; description: string }> = {
  0: { condition: "sunny", description: "Clear sky" },
  1: { condition: "sunny", description: "Mainly clear" },
  2: { condition: "partly-cloudy", description: "Partly cloudy" },
  3: { condition: "cloudy", description: "Overcast" },
  45: { condition: "cloudy", description: "Foggy" },
  48: { condition: "cloudy", description: "Depositing rime fog" },
  51: { condition: "rain", description: "Light drizzle" },
  53: { condition: "rain", description: "Moderate drizzle" },
  55: { condition: "rain", description: "Dense drizzle" },
  56: { condition: "rain", description: "Light freezing drizzle" },
  57: { condition: "rain", description: "Dense freezing drizzle" },
  61: { condition: "rain", description: "Slight rain" },
  63: { condition: "rain", description: "Moderate rain" },
  65: { condition: "rain", description: "Heavy rain" },
  66: { condition: "rain", description: "Light freezing rain" },
  67: { condition: "rain", description: "Heavy freezing rain" },
  71: { condition: "snow", description: "Slight snow" },
  73: { condition: "snow", description: "Moderate snow" },
  75: { condition: "snow", description: "Heavy snow" },
  77: { condition: "snow", description: "Snow grains" },
  80: { condition: "rain", description: "Slight rain showers" },
  81: { condition: "rain", description: "Moderate rain showers" },
  82: { condition: "rain", description: "Violent rain showers" },
  85: { condition: "snow", description: "Slight snow showers" },
  86: { condition: "snow", description: "Heavy snow showers" },
  95: { condition: "thunderstorm", description: "Thunderstorm" },
  96: { condition: "thunderstorm", description: "Thunderstorm with slight hail" },
  99: { condition: "thunderstorm", description: "Thunderstorm with heavy hail" },
}

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32)
}

export function parseWeatherCode(code: number): { condition: WeatherCondition; description: string } {
  return WMO_CODE_MAP[code] ?? { condition: "cloudy", description: "Unknown" }
}

async function getCoordinates(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`))
      },
      { timeout: 10000, maximumAge: 300000 }
    )
  })
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse")
  url.searchParams.set("lat", lat.toString())
  url.searchParams.set("lon", lon.toString())
  url.searchParams.set("format", "json")

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "DigitalWallDashboard/1.0" },
  })

  if (!response.ok) {
    return "Current Location"
  }

  const data = await response.json()
  const city = data.address?.city || data.address?.town || data.address?.village || ""
  const state = data.address?.state || ""

  if (city && state) {
    return `${city}, ${state}`
  }
  return city || state || "Current Location"
}

export async function getWeatherByCoords(latitude: number, longitude: number): Promise<WeatherData> {
  const url = new URL("https://api.open-meteo.com/v1/forecast")
  url.searchParams.set("latitude", latitude.toString())
  url.searchParams.set("longitude", longitude.toString())
  url.searchParams.set("current", "temperature_2m,weather_code")
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min")
  url.searchParams.set("temperature_unit", "celsius")
  url.searchParams.set("timezone", "auto")

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  const data = await response.json()

  const { condition, description } = parseWeatherCode(data.current.weather_code)
  const location = await reverseGeocode(latitude, longitude)
  const sunTimes = calculateSunTimes(latitude, longitude)

  return {
    temperature: celsiusToFahrenheit(data.current.temperature_2m),
    high: celsiusToFahrenheit(data.daily.temperature_2m_max[0]),
    low: celsiusToFahrenheit(data.daily.temperature_2m_min[0]),
    condition,
    description,
    location,
    sunTimes,
  }
}

export async function getWeather(): Promise<WeatherData> {
  const coords = await getCoordinates()
  return getWeatherByCoords(coords.latitude, coords.longitude)
}
