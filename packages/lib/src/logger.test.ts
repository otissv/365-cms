import { logger } from "./logger"

describe("logger", () => {
  it("should log", () => {
    const printer = jest.fn()
    const testStr = "loggeed"
    const value = "hello world"

    expect(logger(printer)(testStr)(value)).toBe(value)
    expect(printer).toBeCalledWith(testStr)
  })
})
