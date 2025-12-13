"use client"

import { usePhotos } from "@/hooks/use-photos"
import { useThemeContext } from "@/components/theme/theme-provider"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function PhotoSlideshow() {
  const { currentPhoto, loading, currentIndex } = usePhotos()
  const { mode } = useThemeContext()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!currentPhoto) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">No photos available</p>
      </div>
    )
  }

  return (
    <div className="relative h-full overflow-hidden rounded-xl border bg-card">
      <div
        className={cn("relative h-full w-full transition-opacity duration-1000", mode === "night" && "opacity-70")}
        key={currentIndex}
      >
        <Image
          src={currentPhoto.url || "/placeholder.svg"}
          alt={currentPhoto.caption || "Photo"}
          fill
          className="object-cover"
          priority
        />

        {/* Gradient overlay for caption readability */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          {currentPhoto.caption && <p className="text-lg font-medium text-white">{currentPhoto.caption}</p>}
          {currentPhoto.timestamp && (
            <p className="mt-1 text-sm text-white/80">
              {currentPhoto.timestamp.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
