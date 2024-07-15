import type { Func } from "./types"

/**
 * Times how long a function takes to run in milliseconds.
 *
 * @param callback - A function that takes the time in milliseconds.
 *
 * @param fn - The function to be time.
 *
 * @param value - A value to pass to the function.
 *
 * @returns The result of the timed function.
 *
 * @usage
 * `import { timer } from './timer'
 *
 *
 * @example
 * ```
 * const callback = (ms: number) => console.log(ms)
 * const add = (a: number) => (b: number) => a + b
 *
 * const time = timer(callback)(add(1))(2) // 3
 * ```
 */
export const timer =
  (callback: (ms: number) => number | undefined) =>
  <Fn extends Func>(fn: Fn) =>
  <Value>(value?: Value) => {
    const start = new Date().getTime()
    // eslint-disable-next-line functional/no-expression-statement
    const result = fn(value)
    const end = new Date().getTime()

    // eslint-disable-next-line functional/no-expression-statement
    callback(end - start)
    return result
  }
