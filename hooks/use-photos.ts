"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { type Photo, type MediaType } from "@/api/media-types"

const PHOTO_DISPLAY_TIME = 25000
const MAX_VIDEO_DURATION = 180000 // 3 minutes in ms
const VALID_MEDIA_TYPES: readonly MediaType[] = ["photo", "video"] as const

function isValidMediaType(value: unknown): value is MediaType {
  return typeof value === "string" && VALID_MEDIA_TYPES.includes(value as MediaType)
}

function sanitizePhoto(item: unknown): Photo | null {
  if (
    typeof item !== "object" ||
    item === null ||
    !("id" in item) ||
    !("url" in item) ||
    !("type" in item)
  ) {
    return null
  }

  const record = item as Record<string, unknown>
  if (
    typeof record.id !== "string" ||
    typeof record.url !== "string" ||
    !isValidMediaType(record.type)
  ) {
    return null
  }

  return {
    id: record.id,
    url: record.url,
    type: record.type,
    caption: typeof record.caption === "string" ? record.caption : undefined,
    timestamp: record.timestamp instanceof Date ? record.timestamp : undefined,
  }
}

function sanitizePhotos(data: unknown): Photo[] {
  if (!Array.isArray(data)) return []
  return data.map(sanitizePhoto).filter((photo): photo is Photo => photo !== null)
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [videoFlags, setVideoFlags] = useState<boolean[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const photoCountRef = useRef(0)
  const isCurrentVideoRef = useRef(false)

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/photos")
        const data: unknown = await response.json()
        const sanitizedPhotos = sanitizePhotos(data)
        const flags = sanitizedPhotos.map((p) => p.type === "video")
        photoCountRef.current = sanitizedPhotos.length
        setPhotos(sanitizedPhotos)
        setVideoFlags(flags)
      } catch (error) {
        console.error("[v0] Failed to fetch photos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  const advanceToNext = useCallback(() => {
    const count = photoCountRef.current
    if (count === 0) return
    setCurrentIndex((prev) => (prev + 1) % count)
  }, [])

  const currentPhoto = photos[currentIndex]

  useEffect(() => {
    isCurrentVideoRef.current = videoFlags[currentIndex] ?? false
  }, [currentIndex, videoFlags])

  useEffect(() => {
    const count = photoCountRef.current
    if (count === 0) return

    const isVideo = isCurrentVideoRef.current
    const duration = isVideo ? MAX_VIDEO_DURATION : PHOTO_DISPLAY_TIME
    timeoutRef.current = setTimeout(advanceToNext, duration)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentIndex, advanceToNext])

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
