import { isArray } from "./isArray"

describe("isArray", () => {
  it("should return true if Array", () => {
    process.env.NODE_ENV = "development"
    expect(isArray([])).toBe(true)
    expect(isArray([0])).toBe(true)
  })

  it("should return false if NODE_ENV environment variable is not development", () => {
    process.env.NODE_ENV = "test"

    expect(isArray(undefined)).toBe(false)
    expect(isArray({})).toBe(false)
    expect(isArray(new Set())).toBe(false)
  })
})
