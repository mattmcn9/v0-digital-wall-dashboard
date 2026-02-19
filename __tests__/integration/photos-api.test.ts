import { describe, it, expect, vi, beforeEach } from "vitest"
import { getMediaType, IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from "@/app/api/photos/route"

describe("photos API route helpers", () => {
  describe("getMediaType", () => {
    it("returns 'photo' for all supported image extensions", () => {
      IMAGE_EXTENSIONS.forEach((ext) => {
        const filename = `test${ext}`
        expect(getMediaType(filename)).toBe("photo")
      })
    })

    it("returns 'video' for all supported video extensions", () => {
      VIDEO_EXTENSIONS.forEach((ext) => {
        const filename = `test${ext}`
        expect(getMediaType(filename)).toBe("video")
      })
    })

    it("is case insensitive", () => {
      expect(getMediaType("test.JPG")).toBe("photo")
      expect(getMediaType("test.MP4")).toBe("video")
    })

    it("returns null for unsupported files", () => {
      expect(getMediaType("test.txt")).toBeNull()
      expect(getMediaType("test.pdf")).toBeNull()
      expect(getMediaType(".DS_Store")).toBeNull()
    })
  })

  describe("IMAGE_EXTENSIONS constant", () => {
    it("contains expected image formats", () => {
      expect(IMAGE_EXTENSIONS).toContain(".jpg")
      expect(IMAGE_EXTENSIONS).toContain(".jpeg")
      expect(IMAGE_EXTENSIONS).toContain(".png")
      expect(IMAGE_EXTENSIONS).toContain(".webp")
      expect(IMAGE_EXTENSIONS).toContain(".gif")
      expect(IMAGE_EXTENSIONS).toContain(".svg")
    })
  })

  describe("VIDEO_EXTENSIONS constant", () => {
    it("contains expected video formats", () => {
      expect(VIDEO_EXTENSIONS).toContain(".mp4")
      expect(VIDEO_EXTENSIONS).toContain(".webm")
      expect(VIDEO_EXTENSIONS).toContain(".mov")
    })
  })
})
