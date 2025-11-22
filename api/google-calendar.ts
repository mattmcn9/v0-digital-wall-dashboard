// Mock API for Google Calendar
// In production, this would call the actual Google Calendar API

export type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  color?: string
}

export async function getCalendarEvents(year: number, month: number): Promise<CalendarEvent[]> {
  // Mock data - replace with actual Google Calendar API calls
  return [
    {
      id: "1",
      title: "Team Meeting",
      start: new Date(year, month, 5, 10, 0),
      end: new Date(year, month, 5, 11, 0),
      allDay: false,
      color: "blue",
    },
    {
      id: "2",
      title: "Birthday Party",
      start: new Date(year, month, 12),
      end: new Date(year, month, 12),
      allDay: true,
      color: "pink",
    },
    {
      id: "3",
      title: "Dentist Appointment",
      start: new Date(year, month, 18, 14, 30),
      end: new Date(year, month, 18, 15, 30),
      allDay: false,
      color: "green",
    },
    {
      id: "4",
      title: "Vacation",
      start: new Date(year, month, 22),
      end: new Date(year, month, 25),
      allDay: true,
      color: "orange",
    },
  ]
}
