import { cloneDeep } from "./cloneDeep"

describe("cloneDeep", () => {
  it("should not clone primitives", () => {
    expect(cloneDeep(1)).toBe(1)
    expect(cloneDeep("a")).toBe("a")
    expect(cloneDeep(true)).toBe(true)
    expect(cloneDeep(undefined)).toBe(undefined)
    expect(cloneDeep(null)).toBe(null)
  })

  it("should clone dates", () => {
    const date = new Date("2023-01-01")
    const newDate = cloneDeep(date)
    newDate.setFullYear(2000)

    expect(date.getFullYear()).toBe(2023)
    expect(newDate.getFullYear()).toBe(2000)
  })

  it("should clone maps", () => {
    const obj = {
      id: 1,
      name: { first: "o", last: "v" },
    }

    const map = new Map()
    map.set("a", 1)
    map.set("b", 2)
    map.set("c", obj)

    const newMap = cloneDeep(map)
    newMap.set("a", "a")

    obj.id = 99
    obj.name.first = "m"
    map.set("b", "hey")

    expect(map).toEqual(
      new Map(
        Object.entries({
          a: 1,
          b: "hey",
          c: { id: 99, name: { first: "m", last: "v" } },
        })
      )
    )
    expect(newMap).toEqual(
      new Map(
        Object.entries({
          a: "a",
          b: 2,
          c: { id: 1, name: { first: "o", last: "v" } },
        })
      )
    )
  })

  it("should clone sets", () => {
    const obj = {
      id: 1,
      name: { first: "o", last: "v" },
    }
    const set = new Set()
    set.add(1)
    set.add(2)
    set.add(obj)

    const newSet = cloneDeep(set)
    newSet.add("a")

    obj.id = 99
    obj.name.first = "m"

    expect(set).toEqual(
      new Set([1, 2, { id: 99, name: { first: "m", last: "v" } }])
    )
    expect(newSet).toEqual(
      new Set([1, 2, "a", { id: 1, name: { first: "o", last: "v" } }])
    )
  })

  // it('should clone regex', () => {
  //   const regex = /a/g
  //   expect(cloneDeep(regex)).toEqual(regex)
  // })

  it("should clone arrays", () => {
    const arr = [1, 2, 3]
    const nestedArr = [1, [2, 3]]
    const deeplyNestedArr = [1, { a: 2, b: [3, 4] }]

    expect(cloneDeep(arr)).toEqual(arr)
    expect(cloneDeep(nestedArr)).toEqual(nestedArr)
    expect(cloneDeep(deeplyNestedArr)).toEqual(deeplyNestedArr)
  })

  it("should clone objects", () => {
    const obj = { a: 1, b: 2 }
    const nestedObj = { a: 1, b: { c: 2 } }

    expect(cloneDeep(obj)).toEqual(obj)
    expect(cloneDeep(nestedObj)).toEqual(nestedObj)
  })

  it("should not clone functions", () => {
    const fn = () => 1
    expect(cloneDeep(fn)).toEqual(fn)
  })

  it("should not clone errors", () => {
    const error = new Error("a")

    expect(cloneDeep(error)).toEqual(error)
  })

  // it('should clone symbols', () => {
  //   const symbol = Symbol('a')
  //   expect(cloneDeep(symbol)).toEqual(symbol)
  // })
})
