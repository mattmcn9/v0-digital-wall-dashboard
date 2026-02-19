"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { type Photo, type MediaType } from "@/api/media-types"

const PHOTO_DISPLAY_TIME = 25000
const MAX_VIDEO_DURATION = 180000 // 3 minutes in ms

function getDisplayDuration(mediaType: MediaType | undefined): number {
  if (mediaType === "video") return MAX_VIDEO_DURATION
  return PHOTO_DISPLAY_TIME
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/photos")
        const data = await response.json()
        setPhotos(data)
      } catch (error) {
        console.error("[v0] Failed to fetch photos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  const advanceToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  const currentPhoto = photos[currentIndex]
  const currentMediaType = currentPhoto?.type

  useEffect(() => {
    if (photos.length === 0 || !currentMediaType) return

    const duration = getDisplayDuration(currentMediaType)
    timeoutRef.current = setTimeout(advanceToNext, duration)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentIndex, photos.length, currentMediaType, advanceToNext])

  const onVideoEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    advanceToNext()
  }, [advanceToNext])

  return {
    currentPhoto,
    photos,
    loading,
    currentIndex,
    onVideoEnd,
  }
}
