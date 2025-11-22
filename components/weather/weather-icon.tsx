import type { WeatherCondition } from "@/api/weather"
import { Cloud, CloudRain, CloudSnow, Sun, CloudSun, CloudLightning } from "lucide-react"

type WeatherIconProps = {
  condition: WeatherCondition
  className?: string
}

export function WeatherIcon({ condition, className }: WeatherIconProps) {
  const iconMap = {
    sunny: Sun,
    cloudy: Cloud,
    "partly-cloudy": CloudSun,
    rain: CloudRain,
    snow: CloudSnow,
    thunderstorm: CloudLightning,
  }

  const Icon = iconMap[condition] || CloudSun

  return <Icon className={className} />
}
