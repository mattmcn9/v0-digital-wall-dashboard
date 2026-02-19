import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  isNightByHour,
  isNightTimeWithSunTimes,
  findHolidayForDate,
  getEasternTimeMonthDay,
} from "@/hooks/use-theme"
import type { SunTimes } from "@/api/weather"

describe("isNightByHour", () => {
  it("returns true for hour 20 (8 PM)", () => {
    expect(isNightByHour(20)).toBe(true)
  })

  it("returns true for hour 23 (11 PM)", () => {
    expect(isNightByHour(23)).toBe(true)
  })

  it("returns true for hour 0 (midnight)", () => {
    expect(isNightByHour(0)).toBe(true)
  })

  it("returns true for hour 5 (5 AM)", () => {
    expect(isNightByHour(5)).toBe(true)
  })

  it("returns false for hour 6 (6 AM)", () => {
    expect(isNightByHour(6)).toBe(false)
  })

  it("returns false for hour 12 (noon)", () => {
    expect(isNightByHour(12)).toBe(false)
  })

  it("returns false for hour 19 (7 PM)", () => {
    expect(isNightByHour(19)).toBe(false)
  })
})

describe("isNightTimeWithSunTimes", () => {
  it("returns night when sunTimes is null and hour is late", () => {
    const lateNight = new Date("2024-06-15T23:00:00")
    vi.setSystemTime(lateNight)
    
    const result = isNightTimeWithSunTimes(null, lateNight)
    
    expect(result).toBe(true)
  })

  it("returns day when current time is between sunrise and sunset", () => {
    const sunrise = new Date("2024-06-15T06:00:00")
    const sunset = new Date("2024-06-15T20:00:00")
    const sunTimes: SunTimes = { sunrise, sunset }
    const currentTime = new Date("2024-06-15T12:00:00")

    const result = isNightTimeWithSunTimes(sunTimes, currentTime)

    expect(result).toBe(false)
  })

  it("returns night when current time is before sunrise", () => {
    const sunrise = new Date("2024-06-15T06:00:00")
    const sunset = new Date("2024-06-15T20:00:00")
    const sunTimes: SunTimes = { sunrise, sunset }
    const currentTime = new Date("2024-06-15T05:00:00")

    const result = isNightTimeWithSunTimes(sunTimes, currentTime)

    expect(result).toBe(true)
  })

  it("returns night when current time is after sunset", () => {
    const sunrise = new Date("2024-06-15T06:00:00")
    const sunset = new Date("2024-06-15T20:00:00")
    const sunTimes: SunTimes = { sunrise, sunset }
    const currentTime = new Date("2024-06-15T21:00:00")

    const result = isNightTimeWithSunTimes(sunTimes, currentTime)

    expect(result).toBe(true)
  })

  it("returns night when current time equals sunset (boundary)", () => {
    const sunrise = new Date("2024-06-15T06:00:00")
    const sunset = new Date("2024-06-15T20:00:00")
    const sunTimes: SunTimes = { sunrise, sunset }
    const currentTime = new Date("2024-06-15T20:00:00")

    const result = isNightTimeWithSunTimes(sunTimes, currentTime)

    expect(result).toBe(true)
  })

  it("returns day when current time equals sunrise (boundary)", () => {
    const sunrise = new Date("2024-06-15T06:00:00")
    const sunset = new Date("2024-06-15T20:00:00")
    const sunTimes: SunTimes = { sunrise, sunset }
    const currentTime = new Date("2024-06-15T06:00:00")

    const result = isNightTimeWithSunTimes(sunTimes, currentTime)

    expect(result).toBe(false)
  })
})

describe("findHolidayForDate", () => {
  const mockHolidays = {
    july4: {
      dates: ["07-04"],
      theme: "fireworks",
      colors: {
        primary: "red",
        secondary: "white",
        accent: "blue",
      },
    },
    christmas: {
      dates: ["12-24", "12-25"],
      theme: "snow",
      colors: {
        primary: "green",
        secondary: "red",
        accent: "white",
      },
    },
    halloween: {
      dates: ["10-31"],
      theme: "spooky",
      colors: {
        primary: "orange",
        secondary: "black",
        accent: "purple",
      },
    },
  }

  it("returns July 4th holiday", () => {
    const date = new Date("2024-07-04T12:00:00")
    vi.setSystemTime(date)

    const result = findHolidayForDate(date, mockHolidays)

    expect(result).not.toBeNull()
    expect(result?.name).toBe("july4")
    expect(result?.theme).toBe("fireworks")
  })

  it("returns Christmas Eve holiday", () => {
    const date = new Date("2024-12-24T12:00:00")
    vi.setSystemTime(date)

    const result = findHolidayForDate(date, mockHolidays)

    expect(result).not.toBeNull()
    expect(result?.name).toBe("christmas")
    expect(result?.theme).toBe("snow")
  })

  it("returns Christmas Day holiday", () => {
    const date = new Date("2024-12-25T12:00:00")
    vi.setSystemTime(date)

    const result = findHolidayForDate(date, mockHolidays)

    expect(result).not.toBeNull()
    expect(result?.name).toBe("christmas")
  })

  it("returns Halloween holiday", () => {
    const date = new Date("2024-10-31T12:00:00")
    vi.setSystemTime(date)

    const result = findHolidayForDate(date, mockHolidays)

    expect(result).not.toBeNull()
    expect(result?.name).toBe("halloween")
    expect(result?.theme).toBe("spooky")
  })

  it("returns null for non-holiday dates", () => {
    const date = new Date("2024-06-15T12:00:00")
    vi.setSystemTime(date)

    const result = findHolidayForDate(date, mockHolidays)

    expect(result).toBeNull()
  })

  it("includes colors in holiday result", () => {
    const date = new Date("2024-07-04T12:00:00")
    vi.setSystemTime(date)

    const result = findHolidayForDate(date, mockHolidays)

    expect(result?.colors).toEqual({
      primary: "red",
      secondary: "white",
      accent: "blue",
    })
  })
})

describe("getEasternTimeMonthDay", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("formats single digit month and day with leading zeros", () => {
    const date = new Date("2024-01-05T12:00:00")
    vi.setSystemTime(date)

    const result = getEasternTimeMonthDay(date)

    expect(result).toBe("01-05")
  })

  it("formats double digit month and day correctly", () => {
    const date = new Date("2024-12-25T12:00:00")
    vi.setSystemTime(date)

    const result = getEasternTimeMonthDay(date)

    expect(result).toBe("12-25")
  })
})
