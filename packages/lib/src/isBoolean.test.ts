import { isBoolean } from "./isBoolean"

describe("isBoolean", () => {
  it("should return true if value is of type string", () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
    expect(isBoolean("")).toBe(false)
    expect(isBoolean("hello")).toBe(false)
    expect(isBoolean(1)).toBe(false)
  })
})
