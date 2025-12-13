"use client"

import { useWeather } from "@/hooks/use-weather"
import { WeatherIcon } from "./weather-icon"
import { Loader2 } from "lucide-react"

export function WeatherCard() {
  const { weather, loading } = useWeather()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border bg-card p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">Weather unavailable</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-muted-foreground">{weather.location}</h2>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-5xl font-bold tracking-tight text-card-foreground">{weather.temperature}°</div>
          <div className="mt-1 text-sm text-muted-foreground">{weather.description}</div>
        </div>

        <WeatherIcon condition={weather.condition} className="h-16 w-16 text-primary" />
      </div>

      <div className="flex items-center justify-between border-t pt-4 text-sm">
        <div>
          <div className="text-muted-foreground">High</div>
          <div className="font-semibold text-card-foreground">{weather.high}°</div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground">Low</div>
          <div className="font-semibold text-card-foreground">{weather.low}°</div>
        </div>
      </div>
    </div>
  )
}
