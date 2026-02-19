"use client"

import { useState, useEffect } from "react"
import { getWeather, getWeatherByCoords, type WeatherData, type SunTimes } from "@/api/weather"

const DEFAULT_COORDS = { latitude: 37.7749, longitude: -122.4194 } // San Francisco

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getWeather()
        setWeather(data)
      } catch (err) {
        console.warn("[Weather] Geolocation failed, using default location:", err)
        try {
          const data = await getWeatherByCoords(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude)
          setWeather(data)
        } catch (fallbackErr) {
          console.error("[Weather] Failed to fetch weather:", fallbackErr)
          setError("Unable to load weather data")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()

    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 1800000)
    return () => clearInterval(interval)
  }, [])

  return { weather, loading, error }
}

export type { SunTimes }
