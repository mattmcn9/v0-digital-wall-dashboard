import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useCalendar } from "@/hooks/use-calendar"

vi.mock("@/api/google-calendar", () => ({
  getCalendarEvents: vi.fn(),
}))

import { getCalendarEvents } from "@/api/google-calendar"

const mockGetCalendarEvents = vi.mocked(getCalendarEvents)

describe("useCalendar", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it("starts with loading state", async () => {
    mockGetCalendarEvents.mockImplementation(
      () => new Promise(() => {})
    )

    const { result } = renderHook(() => useCalendar())

    expect(result.current.loading).toBe(true)
  })

  it("fetches events on mount", async () => {
    const mockEvents = [
      {
        id: "1",
        title: "Test Event",
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        allDay: false,
      },
    ]
    mockGetCalendarEvents.mockResolvedValue(mockEvents)

    const { result } = renderHook(() => useCalendar())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockGetCalendarEvents).toHaveBeenCalled()
    expect(result.current.events).toEqual(mockEvents)
  })

  it("sets loading to false after fetch completes", async () => {
    mockGetCalendarEvents.mockResolvedValue([])

    const { result } = renderHook(() => useCalendar())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it("provides currentDate as a Date object", async () => {
    mockGetCalendarEvents.mockResolvedValue([])

    const { result } = renderHook(() => useCalendar())

    expect(result.current.currentDate).toBeInstanceOf(Date)
  })

  it("provides getDaysInMonth function with month info", async () => {
    mockGetCalendarEvents.mockResolvedValue([])

    const { result } = renderHook(() => useCalendar())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const monthInfo = result.current.getDaysInMonth()

    expect(monthInfo).toHaveProperty("daysInMonth")
    expect(monthInfo).toHaveProperty("startingDayOfWeek")
    expect(monthInfo).toHaveProperty("year")
    expect(monthInfo).toHaveProperty("month")
    expect(typeof monthInfo.daysInMonth).toBe("number")
    expect(monthInfo.daysInMonth).toBeGreaterThanOrEqual(28)
    expect(monthInfo.daysInMonth).toBeLessThanOrEqual(31)
    expect(monthInfo.startingDayOfWeek).toBeGreaterThanOrEqual(0)
    expect(monthInfo.startingDayOfWeek).toBeLessThanOrEqual(6)
  })

  it("provides getEventsForDay that returns events", async () => {
    mockGetCalendarEvents.mockResolvedValue([])

    const { result } = renderHook(() => useCalendar())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const eventsOnDay = result.current.getEventsForDay(15)
    expect(Array.isArray(eventsOnDay)).toBe(true)
  })

  it("handles fetch error gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    mockGetCalendarEvents.mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useCalendar())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.events).toEqual([])
    consoleSpy.mockRestore()
  })

  it("calls getCalendarEvents with current year and month", async () => {
    mockGetCalendarEvents.mockResolvedValue([])

    const { result } = renderHook(() => useCalendar())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const now = new Date()
    expect(mockGetCalendarEvents).toHaveBeenCalledWith(
      now.getFullYear(),
      now.getMonth()
    )
  })
})
