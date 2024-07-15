import { isMap } from "./isMap"

describe("isMap", () => {
  it("should return true if value is of type isMap", () => {
    expect(isMap(new Map())).toBe(true)
    expect(isMap("")).toBe(false)
    expect(isMap(undefined)).toBe(false)
    expect(isMap([])).toBe(false)
    expect(isMap({})).toBe(false)
  })
})
