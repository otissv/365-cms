import { getType } from "./getType"

describe("getType", () => {
  it("should return type", () => {
    expect(getType([])).toBe("Array")
    expect(getType({})).toBe("Object")
    expect(getType(1)).toBe("Number")
    expect(getType(0)).toBe("Number")
    expect(getType(Number.NaN)).toBe("Number")
    expect(getType(true)).toBe("Boolean")
    expect(getType(false)).toBe("Boolean")
    expect(getType(new Map())).toBe("Map")
    expect(getType(new WeakMap())).toBe("WeakMap")
    expect(getType(new Set())).toBe("Set")
    expect(getType(new WeakSet())).toBe("WeakSet")
    expect(getType(new Date())).toBe("Date")
    expect(getType(() => 1)).toBe("as Function)")
  })
})
