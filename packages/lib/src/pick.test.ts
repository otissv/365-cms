import { pick } from "./pick"

describe("pick", () => {
  it("should", () => {
    expect(pick(["a", "d"])({ a: "a", b: "b", c: "c", d: "d" })).toEqual({
      a: "a",
      d: "d",
    })

    expect(pick(["c", "a", "b"])({ a: 1, b: true, c: null, d: "d" })).toEqual({
      a: 1,
      b: true,
      c: null,
    })
  })
})
