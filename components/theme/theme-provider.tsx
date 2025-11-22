"use client"

import type React from "react"

import { createContext, useContext, type ReactNode } from "react"
import { useTheme, type ThemeMode, type HolidayTheme } from "@/hooks/use-theme"

type ThemeContextType = {
  mode: ThemeMode
  holiday: HolidayTheme | null
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { mode, holiday } = useTheme()

  return (
    <ThemeContext.Provider value={{ mode, holiday }}>
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
