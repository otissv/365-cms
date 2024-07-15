import { isFunction } from "./isFunction"

export const guard =
  <To>(...guards: readonly any[]) =>
  <Value>(...value: readonly Value[]): To => {
    if (guards.length === 1) {
      return isFunction(guards[0]) ? guards[0](...value) : guards[0]
    }

    const checker = isFunction(guards[0][0])
      ? guards[0][0](...value)
      : guards[0][0]
    const result = isFunction(checker) ? checker(...value) : checker

    return result
      ? isFunction(guards[0][1])
        ? guards[0][1](...value, result)
        : guards[0][1]
      : guard(...guards.slice(1))(...value)
  }
