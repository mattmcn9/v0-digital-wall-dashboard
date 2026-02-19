export type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  color?: string
}

interface ApiCalendarEvent {
  id: string
  title: string
  start: string
  end: string
  allDay: boolean
  color?: string
}

export async function getCalendarEvents(year: number, month: number): Promise<CalendarEvent[]> {
  try {
    const response = await fetch(`/api/calendar?year=${year}&month=${month}`)
    
    if (!response.ok) {
      console.error('Failed to fetch calendar events:', response.status)
      return []
    }

    const data = await response.json()
    
    if (data.error) {
      console.error('Calendar API error:', data.error)
      return []
    }

    return (data.events || []).map((event: ApiCalendarEvent): CalendarEvent => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      allDay: event.allDay,
      color: event.color,
    }))
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return []
  }
}
