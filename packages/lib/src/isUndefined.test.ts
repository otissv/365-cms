import { isUndefined } from "./isUndefined"

describe("isUndefined", () => {
  it("should return true if value is of type string", () => {
    expect(isUndefined(undefined)).toBe(true)
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(false)).toBe(false)
    expect(isUndefined("")).toBe(false)
    expect(isUndefined("hello")).toBe(false)
    expect(isUndefined(1)).toBe(false)
  })
})
