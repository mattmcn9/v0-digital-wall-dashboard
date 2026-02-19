import { describe, it, expect } from "vitest"
import {
  calculateSunTimes,
  celsiusToFahrenheit,
  parseWeatherCode,
} from "@/api/weather"

describe("celsiusToFahrenheit", () => {
  it("converts 0°C to 32°F", () => {
    expect(celsiusToFahrenheit(0)).toBe(32)
  })

  it("converts 100°C to 212°F", () => {
    expect(celsiusToFahrenheit(100)).toBe(212)
  })

  it("converts -40°C to -40°F (equal point)", () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40)
  })

  it("converts 20°C to 68°F", () => {
    expect(celsiusToFahrenheit(20)).toBe(68)
  })

  it("rounds to nearest integer", () => {
    expect(celsiusToFahrenheit(21.5)).toBe(71)
    expect(celsiusToFahrenheit(21.1)).toBe(70)
  })
})

describe("parseWeatherCode", () => {
  it("returns sunny for clear sky (code 0)", () => {
    const result = parseWeatherCode(0)
    expect(result.condition).toBe("sunny")
    expect(result.description).toBe("Clear sky")
  })

  it("returns sunny for mainly clear (code 1)", () => {
    const result = parseWeatherCode(1)
    expect(result.condition).toBe("sunny")
    expect(result.description).toBe("Mainly clear")
  })

  it("returns partly-cloudy for code 2", () => {
    const result = parseWeatherCode(2)
    expect(result.condition).toBe("partly-cloudy")
    expect(result.description).toBe("Partly cloudy")
  })

  it("returns cloudy for overcast (code 3)", () => {
    const result = parseWeatherCode(3)
    expect(result.condition).toBe("cloudy")
    expect(result.description).toBe("Overcast")
  })

  it("returns rain for drizzle codes", () => {
    expect(parseWeatherCode(51).condition).toBe("rain")
    expect(parseWeatherCode(53).condition).toBe("rain")
    expect(parseWeatherCode(55).condition).toBe("rain")
  })

  it("returns rain for rain codes", () => {
    expect(parseWeatherCode(61).condition).toBe("rain")
    expect(parseWeatherCode(63).condition).toBe("rain")
    expect(parseWeatherCode(65).condition).toBe("rain")
  })

  it("returns snow for snow codes", () => {
    expect(parseWeatherCode(71).condition).toBe("snow")
    expect(parseWeatherCode(73).condition).toBe("snow")
    expect(parseWeatherCode(75).condition).toBe("snow")
    expect(parseWeatherCode(77).condition).toBe("snow")
  })

  it("returns thunderstorm for thunderstorm codes", () => {
    expect(parseWeatherCode(95).condition).toBe("thunderstorm")
    expect(parseWeatherCode(96).condition).toBe("thunderstorm")
    expect(parseWeatherCode(99).condition).toBe("thunderstorm")
  })

  it("returns cloudy with Unknown for unrecognized codes", () => {
    const result = parseWeatherCode(999)
    expect(result.condition).toBe("cloudy")
    expect(result.description).toBe("Unknown")
  })
})

describe("calculateSunTimes", () => {
  it("calculates sunrise before sunset", () => {
    const date = new Date("2024-06-21T12:00:00Z")
    const result = calculateSunTimes(37.7749, -122.4194, date)
    
    expect(result.sunrise).toBeInstanceOf(Date)
    expect(result.sunset).toBeInstanceOf(Date)
    expect(result.sunrise.getTime()).toBeLessThan(result.sunset.getTime())
  })

  it("calculates longer days in summer for San Francisco", () => {
    const summerSolstice = new Date("2024-06-21T12:00:00Z")
    const winterSolstice = new Date("2024-12-21T12:00:00Z")
    const lat = 37.7749
    const lng = -122.4194

    const summer = calculateSunTimes(lat, lng, summerSolstice)
    const winter = calculateSunTimes(lat, lng, winterSolstice)

    const summerDayLength = summer.sunset.getTime() - summer.sunrise.getTime()
    const winterDayLength = winter.sunset.getTime() - winter.sunrise.getTime()

    expect(summerDayLength).toBeGreaterThan(winterDayLength)
  })

  it("calculates approximately equal day length at equator", () => {
    const march = new Date("2024-03-21T12:00:00Z")
    const june = new Date("2024-06-21T12:00:00Z")
    const lat = 0
    const lng = 0

    const marchTimes = calculateSunTimes(lat, lng, march)
    const juneTimes = calculateSunTimes(lat, lng, june)

    const marchDayLength = marchTimes.sunset.getTime() - marchTimes.sunrise.getTime()
    const juneDayLength = juneTimes.sunset.getTime() - juneTimes.sunrise.getTime()

    const twelveHours = 12 * 60 * 60 * 1000
    const tolerance = 1.5 * 60 * 60 * 1000

    expect(Math.abs(marchDayLength - twelveHours)).toBeLessThan(tolerance)
    expect(Math.abs(juneDayLength - twelveHours)).toBeLessThan(tolerance)
  })

  it("handles polar regions without crashing", () => {
    const date = new Date("2024-06-21T12:00:00Z")
    const arcticLat = 80
    const lng = 0

    expect(() => calculateSunTimes(arcticLat, lng, date)).not.toThrow()
    const result = calculateSunTimes(arcticLat, lng, date)
    expect(result.sunrise).toBeInstanceOf(Date)
    expect(result.sunset).toBeInstanceOf(Date)
  })

  it("calculates different times for different longitudes", () => {
    const date = new Date("2024-06-21T12:00:00Z")
    const lat = 40

    const eastCoast = calculateSunTimes(lat, -74, date)
    const westCoast = calculateSunTimes(lat, -122, date)

    expect(eastCoast.sunrise.getTime()).not.toBe(westCoast.sunrise.getTime())
    expect(eastCoast.sunrise.getTime()).toBeLessThan(westCoast.sunrise.getTime())
  })

  it("uses current date when no date provided", () => {
    const result = calculateSunTimes(37.7749, -122.4194)
    
    expect(result.sunrise).toBeInstanceOf(Date)
    expect(result.sunset).toBeInstanceOf(Date)
  })
})
