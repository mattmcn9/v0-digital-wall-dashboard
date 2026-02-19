import { describe, it, expect } from "vitest"
import {
  getMediaType,
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
} from "@/app/api/photos/route"

describe("IMAGE_EXTENSIONS", () => {
  it("includes common image formats", () => {
    expect(IMAGE_EXTENSIONS).toContain(".jpg")
    expect(IMAGE_EXTENSIONS).toContain(".jpeg")
    expect(IMAGE_EXTENSIONS).toContain(".png")
    expect(IMAGE_EXTENSIONS).toContain(".webp")
    expect(IMAGE_EXTENSIONS).toContain(".gif")
    expect(IMAGE_EXTENSIONS).toContain(".svg")
  })
})

describe("VIDEO_EXTENSIONS", () => {
  it("includes common video formats", () => {
    expect(VIDEO_EXTENSIONS).toContain(".mp4")
    expect(VIDEO_EXTENSIONS).toContain(".webm")
    expect(VIDEO_EXTENSIONS).toContain(".mov")
  })
})

describe("getMediaType", () => {
  describe("image files", () => {
    it("returns 'photo' for .jpg files", () => {
      expect(getMediaType("image.jpg")).toBe("photo")
    })

    it("returns 'photo' for .jpeg files", () => {
      expect(getMediaType("image.jpeg")).toBe("photo")
    })

    it("returns 'photo' for .png files", () => {
      expect(getMediaType("image.png")).toBe("photo")
    })

    it("returns 'photo' for .webp files", () => {
      expect(getMediaType("image.webp")).toBe("photo")
    })

    it("returns 'photo' for .gif files", () => {
      expect(getMediaType("image.gif")).toBe("photo")
    })

    it("returns 'photo' for .svg files", () => {
      expect(getMediaType("image.svg")).toBe("photo")
    })
  })

  describe("video files", () => {
    it("returns 'video' for .mp4 files", () => {
      expect(getMediaType("video.mp4")).toBe("video")
    })

    it("returns 'video' for .webm files", () => {
      expect(getMediaType("video.webm")).toBe("video")
    })

    it("returns 'video' for .mov files", () => {
      expect(getMediaType("video.mov")).toBe("video")
    })
  })

  describe("case insensitivity", () => {
    it("handles uppercase extensions for images", () => {
      expect(getMediaType("IMAGE.JPG")).toBe("photo")
      expect(getMediaType("IMAGE.PNG")).toBe("photo")
      expect(getMediaType("IMAGE.JPEG")).toBe("photo")
    })

    it("handles uppercase extensions for videos", () => {
      expect(getMediaType("VIDEO.MP4")).toBe("video")
      expect(getMediaType("VIDEO.MOV")).toBe("video")
    })

    it("handles mixed case extensions", () => {
      expect(getMediaType("image.JpG")).toBe("photo")
      expect(getMediaType("video.Mp4")).toBe("video")
    })
  })

  describe("unsupported files", () => {
    it("returns null for .txt files", () => {
      expect(getMediaType("document.txt")).toBeNull()
    })

    it("returns null for .pdf files", () => {
      expect(getMediaType("document.pdf")).toBeNull()
    })

    it("returns null for .html files", () => {
      expect(getMediaType("page.html")).toBeNull()
    })

    it("returns null for .mp3 files (audio)", () => {
      expect(getMediaType("audio.mp3")).toBeNull()
    })

    it("returns null for files without extension", () => {
      expect(getMediaType("filename")).toBeNull()
    })

    it("returns null for hidden files", () => {
      expect(getMediaType(".gitignore")).toBeNull()
    })

    it("returns null for .DS_Store", () => {
      expect(getMediaType(".DS_Store")).toBeNull()
    })
  })

  describe("filenames with special characters", () => {
    it("handles filenames with spaces", () => {
      expect(getMediaType("my photo.jpg")).toBe("photo")
    })

    it("handles filenames with multiple dots", () => {
      expect(getMediaType("photo.backup.jpg")).toBe("photo")
    })

    it("handles filenames with hyphens and underscores", () => {
      expect(getMediaType("my-photo_2024.png")).toBe("photo")
    })
  })
})
