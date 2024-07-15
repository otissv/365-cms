import { isWeakMap } from "./isWeakMap"

describe("isWeakMap", () => {
  it("should return true if value is of type isWeakMap", () => {
    expect(isWeakMap(new WeakMap())).toBe(true)
    expect(isWeakMap("")).toBe(false)
    expect(isWeakMap(undefined)).toBe(false)
    expect(isWeakMap([])).toBe(false)
    expect(isWeakMap({})).toBe(false)
  })
})
