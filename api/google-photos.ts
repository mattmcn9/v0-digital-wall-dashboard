// Mock API for Google Photos
// In production, this would call the actual Google Photos API

export type Photo = {
  id: string
  url: string
  caption?: string
  timestamp?: Date
}

export async function getPhotos(): Promise<Photo[]> {
  // Mock data - replace with actual Google Photos API calls
  return [
    {
      id: "1",
      url: "/family-photo-at-beach-sunset.jpg",
      caption: "Beach vacation",
      timestamp: new Date("2024-08-15"),
    },
    {
      id: "2",
      url: "/mountain-hiking-landscape.png",
      caption: "Mountain hiking",
      timestamp: new Date("2024-09-22"),
    },
    {
      id: "3",
      url: "/family-dinner-celebration.png",
      caption: "Family dinner",
      timestamp: new Date("2024-10-10"),
    },
    {
      id: "4",
      url: "/nighttime-cityscape.png",
      caption: "City lights",
      timestamp: new Date("2024-11-05"),
    },
    {
      id: "5",
      url: "/autumn-leaves-forest-path.jpg",
      caption: "Autumn walk",
      timestamp: new Date("2024-10-28"),
    },
  ]
}
