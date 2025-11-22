"use client"

import { useCalendar } from "@/hooks/use-calendar"
import { CalendarEventItem } from "./calendar-event"
import { cn } from "@/lib/utils"

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function CalendarGrid() {
  const { currentDate, getDaysInMonth, getEventsForDay } = useCalendar()
  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth()

  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month
  const currentDay = today.getDate()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-4xl font-bold tracking-tight text-balance">
          {currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </h1>
      </div>

      {/* Week day headers */}
      <div className="mb-2 grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-muted-foreground">
            {day.slice(0, 3)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid flex-1 grid-cols-7 gap-2">
        {/* Empty cells before first day */}
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="rounded-lg bg-card/30" />
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const dayEvents = getEventsForDay(day)
          const isToday = isCurrentMonth && day === currentDay

          return (
            <div
              key={day}
              className={cn(
                "relative flex min-h-[80px] flex-col rounded-lg border bg-card p-2 transition-colors",
                isToday && "border-primary bg-primary/10 ring-2 ring-primary/50",
              )}
            >
              <div
                className={cn("mb-1 text-right text-lg font-semibold", isToday ? "text-primary" : "text-foreground")}
              >
                {day}
              </div>

              <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 2).map((event) => (
                  <CalendarEventItem key={event.id} event={event} compact />
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
