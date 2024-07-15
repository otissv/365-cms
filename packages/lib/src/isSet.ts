import { getType } from "./getType"

/**
 * Checks value is a Set
 *
 * @param   value  - Value to be evaluated.
 *
 * @returns Returns true if value is a Set.
 *
 * @usage
 * `import \{ isSet \} from "c-ufunc/libs/isSet"`
 *
 * @example
 * ```
 * isSet(new Set()) // true
 *
 * isSet(1) // false
 * ```
 */
export const isSet = <Value>(value: Value) =>
  value instanceof Set || getType(value) === "Set"
