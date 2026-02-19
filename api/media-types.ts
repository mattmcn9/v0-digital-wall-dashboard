// Types for media items (photos and videos)

export type MediaType = "photo" | "video"

export type Photo = {
  id: string
  url: string
  type: MediaType
  caption?: string
  timestamp?: Date
}
