import { ifFunction } from "./ifFunction"

describe("ifFunction", () => {
  it("should", () => {
    expect(ifFunction(() => "hello")).toBe("hello")
    expect(ifFunction("hello")).toBe("hello")
  })
})
