import { getType } from "./getType"
import { tryCatch } from "./exP/tryCatch"

/**
 * Checks value is a WeakSet
 *
 * @param   value  - Value to be evaluated.
 *
 * @returns Returns true if value is a WeakSet.
 *
 * @usage
 * `import \{ isWeakSet \} from "c-ufunc/libs/isWeakSet"`
 *
 * @example
 * ```
 * isWeakSet(new Map()) // true
 *
 * isWeakSet(1) // false
 * ```
 */
export const isWeakSet = <Value>(value: Value) =>
  tryCatch(() => value instanceof WeakSet)(
    () => getType(value) === "isWeakSet"
  )(value)
