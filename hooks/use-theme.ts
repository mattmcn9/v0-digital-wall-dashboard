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

// Helper function to calculate initial mode based on Eastern Time
function getInitialMode(): ThemeMode {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    hour12: false,
  })
  const parts = formatter.formatToParts(now)
  const hour = parseInt(parts.find(p => p.type === "hour")?.value || "0", 10)
  const isNight = hour >= 20 || hour < 6
  return isNight ? "night" : "day"
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)
  const [holiday, setHoliday] = useState<HolidayTheme | null>(null)
  
  console.log("[Theme Debug] useTheme initialized, initial mode:", mode)

  useEffect(() => {
    const checkTimeAndHoliday = () => {
      const now = new Date()
      console.log("[Theme Debug] Current UTC/local time:", now.toISOString(), "Local:", now.toLocaleString())
      
      // Always use Eastern Time (handles EST/EDT automatically)
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        hour12: false,
        month: "2-digit",
        day: "2-digit",
      })
      const parts = formatter.formatToParts(now)
      const hour = parseInt(parts.find(p => p.type === "hour")?.value || "0", 10)
      const month = parts.find(p => p.type === "month")?.value || "01"
      const day = parts.find(p => p.type === "day")?.value || "01"
      
      console.log("[Theme Debug] Eastern Time parts:", { hour, month, day })
      console.log("[Theme Debug] All formatter parts:", parts)

      // Night mode between 8 PM and 6 AM Eastern Time
      const isNight = hour >= 20 || hour < 6
      console.log("[Theme Debug] isNight calculation:", `hour (${hour}) >= 20 || hour < 6 = ${isNight}`)
      console.log("[Theme Debug] Setting mode to:", isNight ? "night" : "day")
      setMode(isNight ? "night" : "day")

      // Check for holidays (using Eastern Time date)
      const monthDay = `${month}-${day}`
      console.log("[Theme Debug] Checking holidays for date:", monthDay)

      for (const [key, value] of Object.entries(holidays)) {
        if (value.dates.includes(monthDay)) {
          console.log("[Theme Debug] Found holiday:", key)
          setHoliday({
            name: key,
            theme: value.theme,
            colors: value.colors,
          })
          return
        }
      }
      console.log("[Theme Debug] No holiday found")
      setHoliday(null)
    }

    checkTimeAndHoliday()
    const interval = setInterval(checkTimeAndHoliday, 600000) // Check every 10 minutes

    return () => clearInterval(interval)
  }, [])

  return { mode, holiday }
}
