import { when } from "./when"

describe("when", () => {
  it("should return first case", () => {
    const toUpperCase = (str: string) => str.toUpperCase()
    const testStr = "hello world"

    expect(
      when("upper", "HELLO WORLD")
        .when("snake", "hello_world")
        .none(null)
        .exec("upper")
    ).toBe("HELLO WORLD")

    expect(
      when("upper", () => toUpperCase(testStr))
        .when("snake", "hello_world")
        .none(null)
        .exec("upper")
    ).toBe("HELLO WORLD")

    expect(
      when(
        () => "upper",
        () => toUpperCase(testStr)
      )
        .when("snake", "hello_world")
        .none(null)
        .exec("upper")
    ).toBe("HELLO WORLD")

    expect(
      when(() => "upper", "HELLO WORLD")
        .when("snake", "hello_world")
        .none(null)
        .exec("upper")
    ).toBe("HELLO WORLD")
  })

  it("should return middle case", () => {
    const toSnake = (str: string) => str.replace(" ", "_")
    const testStr = "hello world"

    expect(
      when("upper", "HELLO WORLD")
        .when("snake", "hello_world")
        .none(null)
        .exec("snake")
    ).toBe("hello_world")

    expect(
      when("upper", "HELLO WORLD")
        .when("snake", () => toSnake(testStr))
        .none(null)
        .exec("snake")
    ).toBe("hello_world")

    expect(
      when("upper", "HELLO WORLD")
        .when(
          () => "snake",
          () => toSnake(testStr)
        )
        .none(null)
        .exec("snake")
    ).toBe("hello_world")

    expect(
      when("upper", "HELLO WORLD")
        .when(() => "snake", "hello_world")
        .none(null)
        .exec("snake")
    ).toBe("hello_world")
  })

  it("should return none", () => {
    expect(
      when("upper", "HELLO WORLD")
        .when("snake", "hello_world")
        .none(null)
        .exec(false)
    ).toBe(null)
  })
})
