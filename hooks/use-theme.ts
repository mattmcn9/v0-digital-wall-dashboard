"use client"

import { useEffect, useState } from "react"
import holidays from "@/config/holidays.json"

export type ThemeMode = "day" | "night"
export type HolidayTheme = {
  name: string
  theme: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("day")
  const [holiday, setHoliday] = useState<HolidayTheme | null>(null)

  useEffect(() => {
    const checkTimeAndHoliday = () => {
      const now = new Date()
      const hour = now.getHours()

      // Night mode between 8 PM and 6 AM
      const isNight = hour >= 20 || hour < 6
      setMode(isNight ? "night" : "day")

      // Check for holidays
      const monthDay = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

      for (const [key, value] of Object.entries(holidays)) {
        if (value.dates.includes(monthDay)) {
          setHoliday({
            name: key,
            theme: value.theme,
            colors: value.colors,
          })
          return
        }
      }
      setHoliday(null)
    }

    checkTimeAndHoliday()
    const interval = setInterval(checkTimeAndHoliday, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  return { mode, holiday }
}
