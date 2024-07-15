import { getType } from "./getType"

/**
 * Checks value is a Map
 *
 * @param   value  - Value to be evaluated.
 *
 * @returns Returns true if value is a Map.
 *
 * @usage
 * `import \{ isMap \} from "c-ufunc/libs/isMap"`
 *
 * @example
 * ```
 * isMap(new Map()) // true
 *
 * isMap(1) // false
 * ```
 */
export const isMap = <Value>(value: Value) =>
  value instanceof Map || getType(value) === "Map"
