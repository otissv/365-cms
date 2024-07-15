/**
 * Checks if string is a number
 *
 * @param   value  - Value to be evaluated.
 *
 * @returns Returns true if value is a boolean.
 *
 * @usage
 * `import \{ isBoolean \} from "c-ufunc/libs/isBoolean"`
 *
 * @example
 * ```
 * isBoolean(true) // true
 * isBoolean(true) // true
 *
 * isBoolean(1) // false
 * ```
 */
export const isBoolean = <Value>(value: Value) => typeof value === "boolean"
