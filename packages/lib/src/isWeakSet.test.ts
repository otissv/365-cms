import { isWeakSet } from "./isWeakSet"

describe("isWeakSet", () => {
  it("should return true if value is of type isWeakSet", () => {
    expect(isWeakSet(new WeakSet())).toBe(true)
    expect(isWeakSet("")).toBe(false)
    expect(isWeakSet(undefined)).toBe(false)
    expect(isWeakSet([])).toBe(false)
    expect(isWeakSet({})).toBe(false)
  })
})
