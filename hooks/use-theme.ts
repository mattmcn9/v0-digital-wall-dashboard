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

export function getEasternTimeHour(date: Date = new Date()): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    hour12: false,
  })
  const parts = formatter.formatToParts(date)
  return parseInt(parts.find(p => p.type === "hour")?.value || "0", 10)
}

export function isNightByHour(hour: number): boolean {
  return hour >= 20 || hour < 6
}

export function getInitialMode(date: Date = new Date()): ThemeMode {
  const hour = getEasternTimeHour(date)
  return isNightByHour(hour) ? "night" : "day"
}

export function isNightTimeWithSunTimes(
  sunTimes: SunTimes | null,
  currentTime: Date = new Date()
): boolean {
  if (!sunTimes) {
    const hour = getEasternTimeHour(currentTime)
    return isNightByHour(hour)
  }

  return currentTime < sunTimes.sunrise || currentTime >= sunTimes.sunset
}

export function getEasternTimeMonthDay(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "2-digit",
    day: "2-digit",
  })
  const parts = formatter.formatToParts(date)
  const month = parts.find(p => p.type === "month")?.value || "01"
  const day = parts.find(p => p.type === "day")?.value || "01"
  return `${month}-${day}`
}

export function findHolidayForDate(
  date: Date,
  holidayConfig: typeof holidays = holidays
): HolidayTheme | null {
  const monthDay = getEasternTimeMonthDay(date)

  for (const [key, value] of Object.entries(holidayConfig)) {
    if (value.dates.includes(monthDay)) {
      return {
        name: key,
        theme: value.theme,
        colors: value.colors,
      }
    }
  }
  return null
}

export function useTheme(sunTimes?: SunTimes | null) {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialMode())
  const [holiday, setHoliday] = useState<HolidayTheme | null>(null)
  
  console.log("[Theme Debug] useTheme initialized, initial mode:", mode)

  // Update mode when sun times change or periodically
  useEffect(() => {
    const checkMode = () => {
      const now = new Date()
      const isNight = isNightTimeWithSunTimes(sunTimes ?? null, now)
      
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
      
      const monthDay = getEasternTimeMonthDay(now)
      console.log("[Theme Debug] Checking holidays for date:", monthDay)

      const foundHoliday = findHolidayForDate(now)
      if (foundHoliday) {
        console.log("[Theme Debug] Found holiday:", foundHoliday.name)
        setHoliday(foundHoliday)
      } else {
        console.log("[Theme Debug] No holiday found")
        setHoliday(null)
      }
    }

    checkHoliday()
    const interval = setInterval(checkHoliday, 600000) // Check every 10 minutes

    return () => clearInterval(interval)
  }, [])

  return { mode, holiday }
}
