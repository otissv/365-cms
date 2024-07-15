import { update } from "./update"

type Corod = {
  lg: number
  lt: number
}

const data: Corod[] = [
  { lg: 0, lt: 0 },
  { lg: 1, lt: 1 },
  { lg: 2, lt: 2 },
]

describe("update", () => {
  it("should update first item", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = update(0)(list)(99)

    expect(actual).toEqual([99, 1, 2, 3, 4])
  })

  it("should update last item", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = update(4)(list)(99)

    expect(actual).toEqual([0, 1, 2, 3, 99])
  })

  it("should update nth item", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = update(2)(list)(99)

    expect(actual).toEqual([0, 1, 99, 3, 4])
  })

  it("should not update if not in list", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = update(10)(list)(99)

    expect(actual).toEqual([0, 1, 2, 3, 4])
  })

  it("should update first item in collection", () => {
    const actual = update((o: Corod) => o.lg === 0)(data)({ lg: 99, lt: 99 })

    expect(actual).toEqual([
      { lg: 99, lt: 99 },
      { lg: 1, lt: 1 },
      { lg: 2, lt: 2 },
    ])
  })

  it("should update last item in collection", () => {
    const actual = update((o: Corod) => o.lg === 1)(data)({ lg: 99, lt: 99 })

    expect(actual).toEqual([
      { lg: 0, lt: 0 },
      { lg: 99, lt: 99 },
      { lg: 2, lt: 2 },
    ])
  })

  it("should update nth item in collection", () => {
    const actual = update((o: Corod) => o.lg === 2)(data)({ lg: 99, lt: 99 })

    expect(actual).toEqual([
      { lg: 0, lt: 0 },
      { lg: 1, lt: 1 },
      { lg: 99, lt: 99 },
    ])
  })

  it("should not update if not in collection", () => {
    const actual = update(10)(data)(99)

    expect(actual).toEqual([
      { lg: 0, lt: 0 },
      { lg: 1, lt: 1 },
      { lg: 2, lt: 2 },
    ])
  })
})
