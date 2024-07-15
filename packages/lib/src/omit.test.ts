import { omit } from "./omit"

describe("omit", () => {
  it("should return new object with omitted keys", () => {
    const obj = { a: "a", b: "b", c: "c", d: "d" }

    expect(omit(["a", "d"])(obj)).toEqual({ b: "b", c: "c" })
  })
})
