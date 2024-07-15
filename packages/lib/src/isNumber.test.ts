import { isNumber } from "./isNumber"

describe("isNumber", () => {
  it("should return true if value is of type string", () => {
    expect(isNumber(1)).toBe(true)
    expect(isNumber(0)).toBe(true)
    expect(isNumber(-1)).toBe(true)
    expect(isNumber(0.2)).toBe(true)
  })

  it("should return false if value is not of type string", () => {
    expect(isNumber(false as any)).toBe(false)
    expect(isNumber(true as any)).toBe(false)
    expect(isNumber("1" as any)).toBe(false)
    expect(isNumber("0" as any)).toBe(false)
    expect(isNumber([] as any)).toBe(false)
    expect(isNumber({} as any)).toBe(false)
  })
})
