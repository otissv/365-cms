import type { Func } from "./types"

import { isFunction } from "./isFunction"

/**
 * Checks if value is of type function.
 *
 * @param   value - Value to be evaluated.
 *
 * @returns Executes function if value is a function, else returns value
 *
 * @usage
 * `import \{ ifFunction \} from "c-ufunc/libs/ifFunction"`
 *
 * @example
 * ```
 * ifFunction(function() { return 'hello' }) // 'hello'
 * ifFunction('hello') // 'hello'
 * ```
 */
export const ifFunction = <Value>(value: Value) =>
  isFunction(value) ? (value as Func)() : value
