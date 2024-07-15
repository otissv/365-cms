/**
 * Checks if values is a type
 *
 * @param   value  - Value to be evaluated.
 *
 * @returns Returns a values type.
 *
 * @usage
 * `import \{ getType \} from "c-ufunc/libs/getType"`
 *
 * @example
 * ```
 * isArray('Hello, World!') // true
 *
 * getType(1) // false
 * ```
 */
export const getType = <Value>(value: Value) =>
  (({}) as Record<any, any>).toString.call(value).slice(8, -1)
