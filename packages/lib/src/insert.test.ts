import { insert } from "./insert"

type Corod = {
  lg: number
  lt: number
}

const data: Corod[] = [
  { lg: 0, lt: 0 },
  { lg: 1, lt: 1 },
  { lg: 2, lt: 2 },
]

describe("insert", () => {
  it("should insert at first posistion", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = insert(0)(list)(99)

    expect(actual).toEqual([99, 0, 1, 2, 3, 4])
  })

  it("should insert at last posistion", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = insert(4)(list)(99)

    expect(actual).toEqual([0, 1, 2, 3, 99, 4])
  })

  it("should insert at nth posistion", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = insert(2)(list)(99)

    expect(actual).toEqual([0, 1, 99, 2, 3, 4])
  })

  it("should insert at end if not in list", () => {
    const list = [0, 1, 2, 3, 4]
    const actual = insert(10)(list)(99)

    expect(actual).toEqual([0, 1, 2, 3, 4, 99])
  })

  it("should insert at first posistion in collection", () => {
    const actual = insert((o: Corod) => o.lg === 0)(data)({ lg: 99, lt: 99 })

    expect(actual).toEqual([
      { lg: 99, lt: 99 },
      { lg: 0, lt: 0 },
      { lg: 1, lt: 1 },
      { lg: 2, lt: 2 },
    ])
  })

  it("should insert at last posistion in collection", () => {
    const actual = insert((o: Corod) => o.lg === 1)(data)({ lg: 99, lt: 99 })

    expect(actual).toEqual([
      { lg: 0, lt: 0 },
      { lg: 99, lt: 99 },
      { lg: 1, lt: 1 },
      { lg: 2, lt: 2 },
    ])
  })

  it("should insert at nth posistion in collection", () => {
    const actual = insert((o: Corod) => o.lg === 2)(data)({ lg: 99, lt: 99 })

    expect(actual).toEqual([
      { lg: 0, lt: 0 },
      { lg: 1, lt: 1 },
      { lg: 99, lt: 99 },
      { lg: 2, lt: 2 },
    ])
  })

  it("should insert at end if not in collection", () => {
    const actual = insert(10)(data)({ lg: 99, lt: 99 })

    expect(actual).toEqual([
      { lg: 0, lt: 0 },
      { lg: 1, lt: 1 },
      { lg: 2, lt: 2 },
      { lg: 99, lt: 99 },
    ])
  })
})
