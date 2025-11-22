"use client"

import { useState, useEffect } from "react"
import { getPhotos, type Photo } from "@/api/google-photos"

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true)
      try {
        const data = await getPhotos()
        setPhotos(data)
      } catch (error) {
        console.error("[v0] Failed to fetch photos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  useEffect(() => {
    if (photos.length === 0) return

    // Rotate to next photo every 10 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [photos.length])

  return {
    currentPhoto: photos[currentIndex],
    photos,
    loading,
    currentIndex,
  }
}
