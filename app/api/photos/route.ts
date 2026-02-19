import { readdir } from "fs/promises"
import { join } from "path"

export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]
export const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"]

export function getMediaType(file: string): "photo" | "video" | null {
  const lower = file.toLowerCase()
  if (IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))) return "photo"
  if (VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext))) return "video"
  return null
}

export async function GET() {
  const photosDir = join(process.cwd(), "public", "photos")

  try {
    const files = await readdir(photosDir)

    const media = files
      .map((file) => ({ file, type: getMediaType(file) }))
      .filter((item): item is { file: string; type: "photo" | "video" } => item.type !== null)
      .map((item, index) => ({
        id: String(index + 1),
        url: `/photos/${item.file}`,
        type: item.type,
      }))

    return Response.json(media)
  } catch {
    return Response.json([])
  }
}
