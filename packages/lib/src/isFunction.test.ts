import { ifFunction } from "./ifFunction"

describe("isError", () => {
  it("should return function restult", () => {
    expect(ifFunction(() => "hello")).toBe("hello")
  })

  it("should return vlaue", () => {
    expect(ifFunction("hello")).toBe("hello")
  })
})
