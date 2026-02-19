import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn", () => {
  it("merges class names", () => {
    const result = cn("foo", "bar")
    expect(result).toBe("foo bar")
  })

  it("handles conditional classes with clsx syntax", () => {
    const result = cn("base", { active: true, disabled: false })
    expect(result).toBe("base active")
  })

  it("handles undefined and null values", () => {
    const result = cn("base", undefined, null, "end")
    expect(result).toBe("base end")
  })

  it("handles arrays of classes", () => {
    const result = cn(["foo", "bar"], "baz")
    expect(result).toBe("foo bar baz")
  })

  it("merges tailwind conflicting classes (tailwind-merge)", () => {
    const result = cn("px-2", "px-4")
    expect(result).toBe("px-4")
  })

  it("merges conflicting padding classes", () => {
    const result = cn("p-4", "p-2")
    expect(result).toBe("p-2")
  })

  it("merges conflicting margin classes", () => {
    const result = cn("mt-4", "mt-2")
    expect(result).toBe("mt-2")
  })

  it("merges conflicting text color classes", () => {
    const result = cn("text-red-500", "text-blue-500")
    expect(result).toBe("text-blue-500")
  })

  it("merges conflicting background color classes", () => {
    const result = cn("bg-red-500", "bg-blue-500")
    expect(result).toBe("bg-blue-500")
  })

  it("keeps non-conflicting classes", () => {
    const result = cn("px-2", "py-4", "mt-2")
    expect(result).toBe("px-2 py-4 mt-2")
  })

  it("handles empty inputs", () => {
    const result = cn()
    expect(result).toBe("")
  })

  it("handles complex conditional merging", () => {
    const isActive = true
    const isDisabled = false
    const result = cn(
      "base-class",
      "p-4",
      isActive && "bg-blue-500",
      isDisabled && "opacity-50",
      { "font-bold": isActive }
    )
    expect(result).toBe("base-class p-4 bg-blue-500 font-bold")
  })

  it("handles responsive variants", () => {
    const result = cn("text-sm", "md:text-lg", "lg:text-xl")
    expect(result).toBe("text-sm md:text-lg lg:text-xl")
  })

  it("merges conflicting responsive classes correctly", () => {
    const result = cn("md:text-lg", "md:text-xl")
    expect(result).toBe("md:text-xl")
  })
})
