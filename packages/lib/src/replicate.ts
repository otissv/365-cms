/**
 * Replicates a value in a list n number of times.
 *
 * @param length - Number of times the value will be replicated
 * @param value - Value to be replicated.
 *
 * @returns Returns a list with the value replicated n times.
 *
 * @usage
 * `import \{ replicate \} from "c-ufunc/libs/replicate"`
 *
 * @example
 * ```
 * replicate(3)(1) // [1, 1, 1]
 * ```
 */
export const replicate =
  (length: number) =>
  <Value>(value: Value): readonly Value[] =>
    // eslint-disable-next-line functional/immutable-data
    Array(length).fill(value) as readonly Value[]
