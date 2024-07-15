/**
 * Checks if string is a number
 *
 * @param   value  - Value to be evaluated.
 *
 * @returns Returns true if value is a boolean.
 *
 * @usage
 * `import \{ isNull \} from "c-ufunc/libs/isNull"`
 *
 * @example
 * ```
 * isNull(null) // true
 * isNull(undefined) // false
 * isNull('hello') // false
 *```
 */
export const isNull = <Value>(value: Value) => value === null
