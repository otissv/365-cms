/* eslint-disable functional/no-try-statement */

/**
 * Tries to execute a function.
 * @param fn  -Function to be executed.
 * @param caught - Function to be executed if an error is thrown.
 * @returns function value if no errors thrown, else returns an Error object.
 *
 * @usage
 * `import { tryCatch } from "c-ufunc/libs/tryCatch"`
 *
 * @example
 * ```
 * tryCatch((x: number) => x + 1)((x: number) => x - 1)(1)
 * // 2
 *
 */
export const tryCatch =
  <Value, ReturnType>(fn: (value: Value) => ReturnType) =>
  (caught: (value: Value) => ReturnType) =>
  (value: Value): ReturnType => {
    try {
      return fn(value)
    } catch (e) {
      return caught(value)
    }
  }
