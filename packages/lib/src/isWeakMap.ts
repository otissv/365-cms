import { getType } from "./getType"

/**
 * Checks value is a WeakMap
 *
 * @param   value  - Value to be evaluated.
 *
 * @returns Returns true if value is a WeakMap.
 *
 * @usage
 * `import \{ isMap \} from "c-ufunc/libs/isWeakMap"`
 *
 * @example
 * ```
 * isWeakMap(new isWeakMap()) // true
 *
 * isWeakMap(1) // false
 * ```
 */

// eslint-disable-next-line functional/no-expression-statement
export const isWeakMap = <Value>(value: Value) =>
  value instanceof WeakMap || getType(value) === "WeakMap"
