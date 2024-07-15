import { isNull } from "./isNull"

describe("isNull", () => {
  it("should return true if value is of type string", () => {
    expect(isNull(null)).toBe(true)
    expect(isNull(undefined)).toBe(false)
    expect(isNull(false)).toBe(false)
    expect(isNull("")).toBe(false)
    expect(isNull("hello")).toBe(false)
    expect(isNull(1)).toBe(false)
  })
})
