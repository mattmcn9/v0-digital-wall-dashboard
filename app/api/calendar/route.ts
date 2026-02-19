import { NextRequest, NextResponse } from 'next/server'

interface GoogleCalendarEvent {
  id: string
  summary?: string
  start?: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  end?: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  colorId?: string
}

interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  allDay: boolean
  color?: string
}

const GOOGLE_CALENDAR_COLOR_MAP: Record<string, string> = {
  '1': 'blue',
  '2': 'blue',
  '9': 'blue',
  '4': 'green',
  '5': 'green',
  '6': 'green',
  '3': 'pink',
  '11': 'pink',
  '7': 'orange',
  '8': 'orange',
  '10': 'orange',
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google OAuth credentials in environment variables')
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text()
    throw new Error(`Failed to refresh access token: ${error}`)
  }

  const tokenData = await tokenResponse.json()
  return tokenData.access_token
}

function mapGoogleEventToCalendarEvent(event: GoogleCalendarEvent): CalendarEvent {
  const isAllDay = !event.start?.dateTime
  const startDate = event.start?.dateTime || event.start?.date || ''
  const endDate = event.end?.dateTime || event.end?.date || ''

  return {
    id: event.id,
    title: event.summary || 'Untitled Event',
    start: startDate,
    end: endDate,
    allDay: isAllDay,
    color: event.colorId ? GOOGLE_CALENDAR_COLOR_MAP[event.colorId] : undefined,
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const month = parseInt(searchParams.get('month') || new Date().getMonth().toString())

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'
    
    const timeMin = new Date(year, month, 1).toISOString()
    const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString()

    const accessToken = await getAccessToken()

    const calendarUrl = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
    )
    calendarUrl.searchParams.set('timeMin', timeMin)
    calendarUrl.searchParams.set('timeMax', timeMax)
    calendarUrl.searchParams.set('singleEvents', 'true')
    calendarUrl.searchParams.set('orderBy', 'startTime')
    calendarUrl.searchParams.set('maxResults', '100')

    const calendarResponse = await fetch(calendarUrl.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!calendarResponse.ok) {
      const error = await calendarResponse.text()
      console.error('Google Calendar API error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch calendar events' },
        { status: calendarResponse.status }
      )
    }

    const calendarData = await calendarResponse.json()
    const events: CalendarEvent[] = (calendarData.items || []).map(mapGoogleEventToCalendarEvent)

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Calendar API error:', error)
    
    if (error instanceof Error && error.message.includes('Missing Google OAuth credentials')) {
      return NextResponse.json(
        { error: 'Google Calendar not configured. Please set up OAuth credentials.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
