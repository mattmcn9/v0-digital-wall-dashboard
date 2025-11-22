"use client"

import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { WeatherCard } from "@/components/weather/weather-card"
import { PhotoSlideshow } from "@/components/photos/photo-slideshow"
import { HolidayEffects } from "@/components/theme/holiday-effects"
import { useThemeContext } from "@/components/theme/theme-provider"
import { Clock } from "lucide-react"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { mode, holiday } = useThemeContext()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-background p-4">
      <HolidayEffects />

      <div className="mx-auto flex h-screen max-w-[800px] flex-col gap-4">
        {/* Header with time - compact for vertical space */}
        <div className="flex shrink-0 items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-4xl font-bold tracking-tight">
              <Clock className="h-8 w-8 text-primary" />
              {currentTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Mode indicator - compact */}
          <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs">
            <div className={`h-2 w-2 rounded-full ${mode === "night" ? "bg-blue-500" : "bg-yellow-500"}`} />
            <span className="font-medium capitalize">{mode}</span>
            {holiday && (
              <>
                <div className="h-3 w-px bg-border" />
                <span className="font-medium">{holiday.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Calendar Grid - takes most vertical space */}
        <div className="flex-1 overflow-hidden">
          <CalendarGrid />
        </div>

        {/* Weather and Photos - stacked at bottom */}
        <div className="grid shrink-0 grid-cols-2 gap-4">
          {/* Weather Card - left bottom */}
          <div className="h-[200px]">
            <WeatherCard />
          </div>

          {/* Photo Slideshow - right bottom */}
          <div className="h-[200px]">
            <PhotoSlideshow />
          </div>
        </div>
      </div>
    </main>
  )
}
