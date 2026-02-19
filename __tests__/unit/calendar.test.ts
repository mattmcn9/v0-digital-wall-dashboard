import { describe, it, expect } from "vitest"
import {
  getDaysInMonthForDate,
  getEventsForDayFromList,
} from "@/hooks/use-calendar"
import type { CalendarEvent } from "@/api/google-calendar"

describe("getDaysInMonthForDate", () => {
  it("returns correct days for January 2024", () => {
    const date = new Date(2024, 0, 15)
    const result = getDaysInMonthForDate(date)

    expect(result.daysInMonth).toBe(31)
    expect(result.year).toBe(2024)
    expect(result.month).toBe(0)
    expect(result.startingDayOfWeek).toBe(1) // Monday
  })

  it("returns correct days for February 2024 (leap year)", () => {
    const date = new Date(2024, 1, 15)
    const result = getDaysInMonthForDate(date)

    expect(result.daysInMonth).toBe(29)
    expect(result.year).toBe(2024)
    expect(result.month).toBe(1)
    expect(result.startingDayOfWeek).toBe(4) // Thursday
  })

  it("returns correct days for February 2023 (non-leap year)", () => {
    const date = new Date(2023, 1, 15)
    const result = getDaysInMonthForDate(date)

    expect(result.daysInMonth).toBe(28)
  })

  it("returns correct days for April 2024 (30 days)", () => {
    const date = new Date(2024, 3, 15)
    const result = getDaysInMonthForDate(date)

    expect(result.daysInMonth).toBe(30)
  })

  it("returns correct starting day of week for month starting on Sunday", () => {
    const date = new Date(2024, 8, 15) // September 2024 starts on Sunday
    const result = getDaysInMonthForDate(date)

    expect(result.startingDayOfWeek).toBe(0) // Sunday
  })

  it("returns correct starting day of week for month starting on Saturday", () => {
    const date = new Date(2024, 5, 15) // June 2024 starts on Saturday
    const result = getDaysInMonthForDate(date)

    expect(result.startingDayOfWeek).toBe(6) // Saturday
  })
})

describe("getEventsForDayFromList", () => {
  const createEvent = (
    id: string,
    title: string,
    start: Date,
    end: Date,
    allDay = false
  ): CalendarEvent => ({
    id,
    title,
    start,
    end,
    allDay,
  })

  it("returns empty array when no events", () => {
    const currentDate = new Date(2024, 0, 15)
    const result = getEventsForDayFromList([], currentDate, 15)

    expect(result).toEqual([])
  })

  it("returns event that matches exact day", () => {
    const currentDate = new Date(2024, 0, 1)
    const events: CalendarEvent[] = [
      createEvent("1", "Meeting", new Date(2024, 0, 15), new Date(2024, 0, 15)),
    ]

    const result = getEventsForDayFromList(events, currentDate, 15)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("Meeting")
  })

  it("returns events that span multiple days", () => {
    const currentDate = new Date(2024, 0, 1)
    const events: CalendarEvent[] = [
      createEvent("1", "Vacation", new Date(2024, 0, 10), new Date(2024, 0, 20)),
    ]

    expect(getEventsForDayFromList(events, currentDate, 10)).toHaveLength(1)
    expect(getEventsForDayFromList(events, currentDate, 15)).toHaveLength(1)
    expect(getEventsForDayFromList(events, currentDate, 20)).toHaveLength(1)
  })

  it("does not return events outside the day range", () => {
    const currentDate = new Date(2024, 0, 1)
    const events: CalendarEvent[] = [
      createEvent("1", "Vacation", new Date(2024, 0, 10), new Date(2024, 0, 20)),
    ]

    expect(getEventsForDayFromList(events, currentDate, 9)).toHaveLength(0)
    expect(getEventsForDayFromList(events, currentDate, 21)).toHaveLength(0)
  })

  it("returns multiple events for the same day", () => {
    const currentDate = new Date(2024, 0, 1)
    const events: CalendarEvent[] = [
      createEvent("1", "Meeting", new Date(2024, 0, 15), new Date(2024, 0, 15)),
      createEvent("2", "Lunch", new Date(2024, 0, 15), new Date(2024, 0, 15)),
      createEvent("3", "Call", new Date(2024, 0, 15), new Date(2024, 0, 15)),
    ]

    const result = getEventsForDayFromList(events, currentDate, 15)

    expect(result).toHaveLength(3)
  })

  it("filters events correctly when some match and some don't", () => {
    const currentDate = new Date(2024, 0, 1)
    const events: CalendarEvent[] = [
      createEvent("1", "Event on 10th", new Date(2024, 0, 10), new Date(2024, 0, 10)),
      createEvent("2", "Event on 15th", new Date(2024, 0, 15), new Date(2024, 0, 15)),
      createEvent("3", "Event on 20th", new Date(2024, 0, 20), new Date(2024, 0, 20)),
    ]

    const result = getEventsForDayFromList(events, currentDate, 15)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("Event on 15th")
  })

  it("handles events at month boundaries", () => {
    const currentDate = new Date(2024, 0, 1)
    const events: CalendarEvent[] = [
      createEvent("1", "First day", new Date(2024, 0, 1), new Date(2024, 0, 1)),
      createEvent("2", "Last day", new Date(2024, 0, 31), new Date(2024, 0, 31)),
    ]

    expect(getEventsForDayFromList(events, currentDate, 1)).toHaveLength(1)
    expect(getEventsForDayFromList(events, currentDate, 31)).toHaveLength(1)
    expect(getEventsForDayFromList(events, currentDate, 15)).toHaveLength(0)
  })
})
