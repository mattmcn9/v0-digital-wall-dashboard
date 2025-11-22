"use client"

import { useState, useEffect } from "react"
import { getCalendarEvents, type CalendarEvent } from "@/api/google-calendar"

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const calendarEvents = await getCalendarEvents(year, month)
        setEvents(calendarEvents)
      } catch (error) {
        console.error("[v0] Failed to fetch calendar events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()

    // Refresh events every 10 minutes
    const interval = setInterval(fetchEvents, 600000)
    return () => clearInterval(interval)
  }, [currentDate])

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

      return eventStart <= checkDate && eventEnd >= checkDate
    })
  }

  return {
    currentDate,
    events,
    loading,
    getDaysInMonth,
    getEventsForDay,
  }
}
