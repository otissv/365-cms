/**
 * Checks if value is an array
 *
 * @param   value  - Value to be evaluated.
 *
 * @returns Returns true if value is an array.
 *
 * @usage
 * `import \{ isArray \} from "c-ufunc/libs/isArray"`
 *
 * @example
 * ```
 * isArray([1,2,3]) // true
 *
 * isArray({a:1}) // false
 * ```
 */
export const isArray = <Value>(value: Value): boolean => Array.isArray(value)
