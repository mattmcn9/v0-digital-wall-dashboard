"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useTheme, type ThemeMode, type HolidayTheme } from "@/hooks/use-theme"
import { calculateSunTimes, type SunTimes } from "@/api/weather"

type ThemeContextType = {
  mode: ThemeMode
  holiday: HolidayTheme | null
  sunTimes: SunTimes | null
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Default coordinates for San Francisco - can be made configurable
const DEFAULT_LAT = 37.7749
const DEFAULT_LNG = -122.4194

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null)
  
  // Calculate sun times on mount and update daily
  useEffect(() => {
    const updateSunTimes = () => {
      const times = calculateSunTimes(DEFAULT_LAT, DEFAULT_LNG)
      console.log("[ThemeProvider Debug] Calculated sun times:")
      console.log("[ThemeProvider Debug] Sunrise:", times.sunrise.toLocaleTimeString())
      console.log("[ThemeProvider Debug] Sunset:", times.sunset.toLocaleTimeString())
      setSunTimes(times)
    }

    updateSunTimes()
    
    // Recalculate at midnight for the new day
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const msUntilMidnight = midnight.getTime() - now.getTime()
    
    const midnightTimeout = setTimeout(() => {
      updateSunTimes()
      // Then update every 24 hours
      const dailyInterval = setInterval(updateSunTimes, 24 * 60 * 60 * 1000)
      return () => clearInterval(dailyInterval)
    }, msUntilMidnight)

    return () => clearTimeout(midnightTimeout)
  }, [])

  const { mode, holiday } = useTheme(sunTimes)
  
  console.log("[ThemeProvider Debug] Current mode:", mode, "Will apply dark class:", mode === "night")
  console.log("[ThemeProvider Debug] Holiday:", holiday)

  return (
    <ThemeContext.Provider value={{ mode, holiday, sunTimes }}>
      <div
        className={mode === "night" ? "dark" : ""}
        style={{
          ...(holiday &&
            ({
              "--holiday-primary": holiday.colors.primary,
              "--holiday-secondary": holiday.colors.secondary,
              "--holiday-accent": holiday.colors.accent,
            } as React.CSSProperties)),
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}
