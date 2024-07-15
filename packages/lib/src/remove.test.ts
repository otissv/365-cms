import { remove } from "./remove"

type Corod = {
  lg: number
  lt: number
}

const data: Corod[] = [
  { lg: 0, lt: 0 },
  { lg: 1, lt: 1 },
  { lg: 2, lt: 2 },
]

describe("remove", () => {
  it("should remove first item", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = remove(0)(list)

    expect(actual).toEqual([1, 2, 3, 4])
  })

  it("should remove last item", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = remove(4)(list)

    expect(actual).toEqual([0, 1, 2, 3])
  })

  it("should remove nth item", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = remove(2)(list)

    expect(actual).toEqual([0, 1, 3, 4])
  })

  it("should not remove if not in list", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = remove(10)(list)

    expect(actual).toEqual([0, 1, 2, 3, 4])
  })

  it("should remove first item in collection", () => {
    const actual = remove((o: Corod) => o.lg === 0)(data)

    expect(actual).toEqual([
      { lg: 1, lt: 1 },
      { lg: 2, lt: 2 },
    ])
  })

  it("should remove last item in collection", () => {
    const actual = remove((o: Corod) => o.lg === 2)(data)

    expect(actual).toEqual([
      { lg: 0, lt: 0 },
      { lg: 1, lt: 1 },
    ])
  })

  it("should remove nth item in collection", () => {
    const actual = remove((o: Corod) => o.lg === 1)(data)

    expect(actual).toEqual([
      { lg: 0, lt: 0 },
      { lg: 2, lt: 2 },
    ])
  })

  it("should not remove if not in collection", () => {
    const actual = remove(10)(data)

    expect(actual).toEqual([
      { lg: 0, lt: 0 },
      { lg: 1, lt: 1 },
      { lg: 2, lt: 2 },
    ])
  })
})
