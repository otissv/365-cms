/**
 * Checks if string is a number
 *
 * @param   value  - Value to be evaluated.
 *
 * @returns Returns true if value is a string.
 *
 * @usage
 * `import \{ isString \} from "c-ufunc/libs/isString"`
 *
 * @example
 * ```
 * isString('Hello, World!') // true
 *
 * isString(1) // false
 * ```
 */
export const isString = <Value>(value: Value): boolean =>
  typeof value === "string"
