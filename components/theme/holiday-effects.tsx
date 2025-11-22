"use client"

import { useThemeContext } from "./theme-provider"
import { useEffect, useState } from "react"

export function HolidayEffects() {
  const { holiday } = useThemeContext()
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([])

  useEffect(() => {
    if (holiday?.theme === "snow" || holiday?.theme === "fireworks") {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
      }))
      setParticles(newParticles)
    } else {
      setParticles([])
    }
  }, [holiday])

  if (!holiday) return null

  if (holiday.theme === "snow") {
    return (
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute -top-2 h-2 w-2 animate-fall rounded-full bg-white/60"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    )
  }

  if (holiday.theme === "fireworks") {
    return (
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-20">
        {particles.slice(0, 5).map((particle) => (
          <div
            key={particle.id}
            className="absolute top-1/3 animate-pulse"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: "2s",
            }}
          >
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-red-500 via-white to-blue-500 blur-xl" />
          </div>
        ))}
      </div>
    )
  }

  return null
}
