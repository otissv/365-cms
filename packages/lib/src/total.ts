/**
 * Sums a list of numbers.
 *
 * @param list - Array of numbers.
 *
 * @returns Returns the total of all numbers added together.
 *
 * @usage
 * `import { total } from "c-ufunc/libs/total"`
 *
 * @example
 * ```
 * total([2, 4, 6, 8]) // 20
 * ```
 */
export const total = (list: readonly number[]): number => {
  // eslint-disable-next-line functional/no-let
  let acc = 0

  // eslint-disable-next-line functional/no-loop-statement, functional/no-let
  for (let i = 0; i < list.length; i++) {
    // eslint-disable-next-line functional/no-expression-statement
    acc = acc + list[i]
  }

  return acc
}
