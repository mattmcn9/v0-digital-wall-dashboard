"use client"

import { useEffect, useState } from "react"
import holidays from "@/config/holidays.json"
import type { SunTimes } from "@/api/weather"

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

// Helper function to calculate initial mode based on Eastern Time (fallback)
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

// Check if current time is after sunset or before sunrise
function isNightTime(sunTimes: SunTimes | null): boolean {
  if (!sunTimes) {
    // Fallback to fixed hours if sun times not available
    const now = new Date()
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hour12: false,
    })
    const parts = formatter.formatToParts(now)
    const hour = parseInt(parts.find(p => p.type === "hour")?.value || "0", 10)
    return hour >= 20 || hour < 6
  }

  const now = new Date()
  return now < sunTimes.sunrise || now >= sunTimes.sunset
}

export function useTheme(sunTimes?: SunTimes | null) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)
  const [holiday, setHoliday] = useState<HolidayTheme | null>(null)
  
  console.log("[Theme Debug] useTheme initialized, initial mode:", mode)

  // Update mode when sun times change or periodically
  useEffect(() => {
    const checkMode = () => {
      const now = new Date()
      const isNight = isNightTime(sunTimes ?? null)
      
      if (sunTimes) {
        console.log("[Theme Debug] Using actual sun times:")
        console.log("[Theme Debug] Sunrise:", sunTimes.sunrise.toLocaleTimeString())
        console.log("[Theme Debug] Sunset:", sunTimes.sunset.toLocaleTimeString())
        console.log("[Theme Debug] Current time:", now.toLocaleTimeString())
      } else {
        console.log("[Theme Debug] Sun times not available, using fallback hours")
      }
      
      console.log("[Theme Debug] Setting mode to:", isNight ? "night" : "day")
      setMode(isNight ? "night" : "day")
    }

    checkMode()
    // Check every minute for more precise sunrise/sunset transitions
    const interval = setInterval(checkMode, 60000)

    return () => clearInterval(interval)
  }, [sunTimes])

  // Check for holidays separately
  useEffect(() => {
    const checkHoliday = () => {
      const now = new Date()
      console.log("[Theme Debug] Current UTC/local time:", now.toISOString(), "Local:", now.toLocaleString())
      
      // Always use Eastern Time (handles EST/EDT automatically)
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        month: "2-digit",
        day: "2-digit",
      })
      const parts = formatter.formatToParts(now)
      const month = parts.find(p => p.type === "month")?.value || "01"
      const day = parts.find(p => p.type === "day")?.value || "01"

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

    checkHoliday()
    const interval = setInterval(checkHoliday, 600000) // Check every 10 minutes

    return () => clearInterval(interval)
  }, [])

  return { mode, holiday }
}
