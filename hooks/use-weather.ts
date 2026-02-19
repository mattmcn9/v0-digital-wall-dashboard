"use client"

import { useState, useEffect } from "react"
import { getWeather, type WeatherData, type SunTimes } from "@/api/weather"

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      try {
        const data = await getWeather()
        setWeather(data)
      } catch (error) {
        console.error("[v0] Failed to fetch weather:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()

    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 1800000)
    return () => clearInterval(interval)
  }, [])

  return { weather, loading }
}

export type { SunTimes }
