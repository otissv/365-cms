import type { Func } from "./types"

/**
 * Evaluates functions in a right to left sequence. Where the return value of the previous function become the argument of the next function in the sequence.
 *
 * @param fns     - Functions to be invoked.
 * @param value   - Initial value to be mapped.
 *
 * @returns Returns the result of all the mapped functions.
 *
 * @usage
 * `import \{ compose \} from "c-ufunc/libs/compose"`
 *
 * @example
 * ```
 * const toUpper = (string: string) => string.toUpperCase();
 * const toSnake = (string: string) => string.replace(' ', '_');
 *
 * compose(toUpper, toSnake)('Hello World!')
 * // "HELLO_WORLD!"
 * ```
 */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-loop-statement */
export const compose =
  <Fn extends Func>(...fns: readonly Fn[]) =>
  <Value>(value: Value): any => {
    const fnsLength = fns.length - 1
    let result = value

    for (let i = 0; i < fns.length; i++) {
      const fn = fns[fnsLength - i]
      result = fn(result)
    }

    return result
  }
