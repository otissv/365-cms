/**
 * Checks if string is a number
 *
 * @param   value  - Value to be evaluated.
 *
 * @returns Returns true if value is a number.
 *
 * @usage
 * `import \{ isNumber \} from "c-ufunc/libs/isNumber"`
 *
 * @example
 * ```
 * isNumber(1) // true
 *
 * isNumber('1') // false
 * ```
 */
export const isNumber = <Value>(value: Value): boolean =>
  typeof value === "number"
