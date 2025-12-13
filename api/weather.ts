// Mock API for weather data
// In production, this would call a real weather API like OpenWeatherMap

export type WeatherCondition = "sunny" | "cloudy" | "partly-cloudy" | "rain" | "snow" | "thunderstorm"

export type WeatherData = {
  temperature: number
  high: number
  low: number
  condition: WeatherCondition
  description: string
  location: string
}

export async function getWeather(): Promise<WeatherData> {
  // Mock data - replace with actual weather API calls
  // You can use APIs like OpenWeatherMap, WeatherAPI, etc.

  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  return {
    temperature: 72,
    high: 78,
    low: 65,
    condition: "partly-cloudy",
    description: "Partly cloudy",
    location: "San Francisco, CA",
  }
}
