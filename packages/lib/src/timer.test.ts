import { timer } from "./timer"

describe("timer", () => {
  it("should return the time it took to execute a function", () => {
    const callback = jest.fn()
    const fn = () => {
      let i = 0
      while (i < 1000000) {
        i++
      }

      return "completed"
    }

    const time = timer(callback)(fn)()
    expect(callback).toBeCalledTimes(1)
    expect(time).toBe("completed")
  })

  it("should return the time it took to execute a function with a value", () => {
    const callback = (ms: number) => {
      expect(ms).toBeGreaterThanOrEqual(0)
    }
    const fn = (value: number) => {
      let i = 0
      while (i < 1000000) {
        i++
      }

      return value
    }

    const time = timer(callback)(fn)(5)
    expect(time).toBe(5)
  })
})
