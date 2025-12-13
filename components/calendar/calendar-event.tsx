import type { CalendarEvent } from "@/api/google-calendar"
import { cn } from "@/lib/utils"

type CalendarEventProps = {
  event: CalendarEvent
  compact?: boolean
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  pink: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  green: "bg-green-500/20 text-green-300 border-green-500/30",
  orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  default: "bg-primary/20 text-primary-foreground border-primary/30",
}

export function CalendarEventItem({ event, compact = false }: CalendarEventProps) {
  const colorClass = event.color ? colorMap[event.color] || colorMap.default : colorMap.default

  return (
    <div
      className={cn(
        "rounded-md border px-2 py-1 text-xs font-medium truncate",
        colorClass,
        compact && "py-0.5 text-[10px]",
      )}
    >
      {!event.allDay && (
        <span className="mr-1 opacity-75">
          {new Date(event.start).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      )}
      {event.title}
    </div>
  )
}
