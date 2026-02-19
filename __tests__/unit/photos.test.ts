import { describe, it, expect } from "vitest"
import {
  isValidMediaType,
  sanitizePhoto,
  sanitizePhotos,
  VALID_MEDIA_TYPES,
  PHOTO_DISPLAY_TIME,
  MAX_VIDEO_DURATION,
} from "@/hooks/use-photos"

describe("constants", () => {
  it("has correct photo display time (25 seconds)", () => {
    expect(PHOTO_DISPLAY_TIME).toBe(25000)
  })

  it("has correct max video duration (3 minutes)", () => {
    expect(MAX_VIDEO_DURATION).toBe(180000)
  })

  it("has valid media types defined", () => {
    expect(VALID_MEDIA_TYPES).toContain("photo")
    expect(VALID_MEDIA_TYPES).toContain("video")
    expect(VALID_MEDIA_TYPES.length).toBe(2)
  })
})

describe("isValidMediaType", () => {
  it("returns true for 'photo'", () => {
    expect(isValidMediaType("photo")).toBe(true)
  })

  it("returns true for 'video'", () => {
    expect(isValidMediaType("video")).toBe(true)
  })

  it("returns false for invalid string", () => {
    expect(isValidMediaType("image")).toBe(false)
    expect(isValidMediaType("audio")).toBe(false)
    expect(isValidMediaType("")).toBe(false)
  })

  it("returns false for non-string types", () => {
    expect(isValidMediaType(123)).toBe(false)
    expect(isValidMediaType(null)).toBe(false)
    expect(isValidMediaType(undefined)).toBe(false)
    expect(isValidMediaType({})).toBe(false)
    expect(isValidMediaType([])).toBe(false)
  })
})

describe("sanitizePhoto", () => {
  it("returns valid photo object for correct input", () => {
    const input = {
      id: "1",
      url: "/photos/test.jpg",
      type: "photo",
    }

    const result = sanitizePhoto(input)

    expect(result).toEqual({
      id: "1",
      url: "/photos/test.jpg",
      type: "photo",
      caption: undefined,
      timestamp: undefined,
    })
  })

  it("returns valid video object for correct input", () => {
    const input = {
      id: "2",
      url: "/photos/test.mp4",
      type: "video",
    }

    const result = sanitizePhoto(input)

    expect(result).toEqual({
      id: "2",
      url: "/photos/test.mp4",
      type: "video",
      caption: undefined,
      timestamp: undefined,
    })
  })

  it("includes caption when provided as string", () => {
    const input = {
      id: "1",
      url: "/photos/test.jpg",
      type: "photo",
      caption: "A beautiful sunset",
    }

    const result = sanitizePhoto(input)

    expect(result?.caption).toBe("A beautiful sunset")
  })

  it("ignores non-string caption", () => {
    const input = {
      id: "1",
      url: "/photos/test.jpg",
      type: "photo",
      caption: 123,
    }

    const result = sanitizePhoto(input)

    expect(result?.caption).toBeUndefined()
  })

  it("includes timestamp when provided as Date", () => {
    const timestamp = new Date("2024-01-15T10:30:00Z")
    const input = {
      id: "1",
      url: "/photos/test.jpg",
      type: "photo",
      timestamp,
    }

    const result = sanitizePhoto(input)

    expect(result?.timestamp).toBe(timestamp)
  })

  it("ignores non-Date timestamp", () => {
    const input = {
      id: "1",
      url: "/photos/test.jpg",
      type: "photo",
      timestamp: "2024-01-15",
    }

    const result = sanitizePhoto(input)

    expect(result?.timestamp).toBeUndefined()
  })

  it("returns null for null input", () => {
    expect(sanitizePhoto(null)).toBeNull()
  })

  it("returns null for undefined input", () => {
    expect(sanitizePhoto(undefined)).toBeNull()
  })

  it("returns null for non-object input", () => {
    expect(sanitizePhoto("string")).toBeNull()
    expect(sanitizePhoto(123)).toBeNull()
    expect(sanitizePhoto(true)).toBeNull()
  })

  it("returns null when id is missing", () => {
    const input = {
      url: "/photos/test.jpg",
      type: "photo",
    }

    expect(sanitizePhoto(input)).toBeNull()
  })

  it("returns null when url is missing", () => {
    const input = {
      id: "1",
      type: "photo",
    }

    expect(sanitizePhoto(input)).toBeNull()
  })

  it("returns null when type is missing", () => {
    const input = {
      id: "1",
      url: "/photos/test.jpg",
    }

    expect(sanitizePhoto(input)).toBeNull()
  })

  it("returns null when id is not a string", () => {
    const input = {
      id: 1,
      url: "/photos/test.jpg",
      type: "photo",
    }

    expect(sanitizePhoto(input)).toBeNull()
  })

  it("returns null when url is not a string", () => {
    const input = {
      id: "1",
      url: 123,
      type: "photo",
    }

    expect(sanitizePhoto(input)).toBeNull()
  })

  it("returns null when type is invalid", () => {
    const input = {
      id: "1",
      url: "/photos/test.jpg",
      type: "invalid",
    }

    expect(sanitizePhoto(input)).toBeNull()
  })
})

describe("sanitizePhotos", () => {
  it("returns empty array for non-array input", () => {
    expect(sanitizePhotos(null)).toEqual([])
    expect(sanitizePhotos(undefined)).toEqual([])
    expect(sanitizePhotos("string")).toEqual([])
    expect(sanitizePhotos(123)).toEqual([])
    expect(sanitizePhotos({})).toEqual([])
  })

  it("returns empty array for empty array input", () => {
    expect(sanitizePhotos([])).toEqual([])
  })

  it("sanitizes valid photos array", () => {
    const input = [
      { id: "1", url: "/photos/a.jpg", type: "photo" },
      { id: "2", url: "/photos/b.mp4", type: "video" },
    ]

    const result = sanitizePhotos(input)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe("1")
    expect(result[0].type).toBe("photo")
    expect(result[1].id).toBe("2")
    expect(result[1].type).toBe("video")
  })

  it("filters out invalid items from array", () => {
    const input = [
      { id: "1", url: "/photos/a.jpg", type: "photo" },
      { id: 2, url: "/photos/b.jpg", type: "photo" },
      null,
      { id: "3", url: "/photos/c.jpg", type: "invalid" },
      { id: "4", url: "/photos/d.mp4", type: "video" },
    ]

    const result = sanitizePhotos(input)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe("1")
    expect(result[1].id).toBe("4")
  })

  it("returns empty array when all items are invalid", () => {
    const input = [
      { id: 1, url: "/photos/a.jpg", type: "photo" },
      null,
      { id: "3", type: "photo" },
    ]

    const result = sanitizePhotos(input)

    expect(result).toEqual([])
  })
})
