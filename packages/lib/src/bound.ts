import { type BoundTypes, EQ, GT, LT } from "./types"

/**
 * Compares a the position of an item in a list to another item in the list.
 *
 * @param list
 * @param a - Value to be compare.
 * @param b - value to be compared to.
 *
 * @returns Returns "EQ", "LT", "GT" or Error.
 * If an value is not in the list an Error is returned.
 *
 * @usage
 * `import \{ bound \} from "c-ufunc/libs/bound"`
 *
 * @example
 * ```
 * const days = [
 * 'Monday',
 * 'Tuesday',
 * 'Wednesday',
 * 'Thursday',
 * 'Friday',
 * 'Saturday',
 * 'Sunday',
 * ]
 *
 * bound(days)('Monday')('Monday')
 * // EQ
 *
 * bound(days)('Monday')('Sunday')
 * LT
 *
 * bound(days)('Friday')('Monday')
 * GT
 * ```
 */
export const bound =
  <Value>(list: readonly Value[]) =>
  (a: Value) =>
  (b: Value): BoundTypes | Error => {
    const indexA = list.indexOf(a)
    const indexB = list.indexOf(b)

    if (indexA === -1) {
      const error = new Error(`${a} is not a value in list`)
      return error
    }

    switch (true) {
      case indexA === -1: {
        const error = new Error(`${a} is not a value in list`)
        return error
      }
      case indexB === -1: {
        const error = new Error(`${b} is not a value in list`)
        return error
      }
      case indexA < indexB:
        return LT
      case indexA > indexB:
        return GT
      default:
        return EQ
    }
  }
