import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import { usePhotos } from "@/hooks/use-photos"

describe("usePhotos", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it("starts with loading state", async () => {
    global.fetch = vi.fn().mockImplementation(
      () => new Promise(() => {})
    )

    const { result } = renderHook(() => usePhotos())

    expect(result.current.loading).toBe(true)
  })

  it("fetches photos on mount", async () => {
    const mockPhotos = [
      { id: "1", url: "/photos/a.jpg", type: "photo" },
      { id: "2", url: "/photos/b.mp4", type: "video" },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockPhotos),
    })

    const { result } = renderHook(() => usePhotos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(global.fetch).toHaveBeenCalledWith("/api/photos")
    expect(result.current.photos).toHaveLength(2)
  })

  it("sets currentPhoto to first photo after loading", async () => {
    const mockPhotos = [
      { id: "1", url: "/photos/a.jpg", type: "photo" },
      { id: "2", url: "/photos/b.jpg", type: "photo" },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockPhotos),
    })

    const { result } = renderHook(() => usePhotos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.currentPhoto).toBeDefined()
    expect(result.current.currentPhoto?.id).toBe("1")
    expect(result.current.currentIndex).toBe(0)
  })

  it("sanitizes invalid photo data", async () => {
    const mockPhotos = [
      { id: "1", url: "/photos/a.jpg", type: "photo" },
      { id: 2, url: "/photos/b.jpg", type: "photo" },
      { id: "3", url: "/photos/c.jpg", type: "invalid" },
      { id: "4", url: "/photos/d.jpg", type: "photo" },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockPhotos),
    })

    const { result } = renderHook(() => usePhotos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.photos).toHaveLength(2)
    expect(result.current.photos[0].id).toBe("1")
    expect(result.current.photos[1].id).toBe("4")
  })

  it("provides onVideoEnd callback", async () => {
    const mockPhotos = [
      { id: "1", url: "/photos/a.mp4", type: "video" },
      { id: "2", url: "/photos/b.jpg", type: "photo" },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockPhotos),
    })

    const { result } = renderHook(() => usePhotos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(typeof result.current.onVideoEnd).toBe("function")
  })

  it("onVideoEnd advances to next photo", async () => {
    const mockPhotos = [
      { id: "1", url: "/photos/a.mp4", type: "video" },
      { id: "2", url: "/photos/b.jpg", type: "photo" },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockPhotos),
    })

    const { result } = renderHook(() => usePhotos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.currentIndex).toBe(0)

    act(() => {
      result.current.onVideoEnd()
    })

    expect(result.current.currentIndex).toBe(1)
  })

  it("onVideoEnd wraps around to first photo", async () => {
    const mockPhotos = [
      { id: "1", url: "/photos/a.jpg", type: "photo" },
      { id: "2", url: "/photos/b.jpg", type: "photo" },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockPhotos),
    })

    const { result } = renderHook(() => usePhotos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.onVideoEnd()
    })
    expect(result.current.currentIndex).toBe(1)

    act(() => {
      result.current.onVideoEnd()
    })
    expect(result.current.currentIndex).toBe(0)
  })

  it("handles empty photos array", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([]),
    })

    const { result } = renderHook(() => usePhotos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.photos).toHaveLength(0)
    expect(result.current.currentPhoto).toBeUndefined()
  })

  it("handles fetch error gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => usePhotos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.photos).toHaveLength(0)
    consoleSpy.mockRestore()
  })

  it("handles non-array response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ error: "Invalid" }),
    })

    const { result } = renderHook(() => usePhotos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.photos).toHaveLength(0)
  })

  it("returns photos array", async () => {
    const mockPhotos = [
      { id: "1", url: "/photos/a.jpg", type: "photo" },
    ]

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockPhotos),
    })

    const { result } = renderHook(() => usePhotos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(Array.isArray(result.current.photos)).toBe(true)
  })
})
