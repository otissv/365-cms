import { isSet } from "./isSet"

describe("isSet", () => {
  it("should return true if value is of type isSet", () => {
    expect(isSet(new Set())).toBe(true)
    expect(isSet("")).toBe(false)
    expect(isSet(undefined)).toBe(false)
    expect(isSet([])).toBe(false)
    expect(isSet({})).toBe(false)
  })
})
