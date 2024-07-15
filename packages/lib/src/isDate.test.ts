import { isDate } from "./isDate"

describe("isDate", () => {
  it("should return true if value is of type string", () => {
    expect(isDate(new Date())).toBe(true) // true
    expect(isDate("2023/1/1")).toBe(false) // false
  })
})
