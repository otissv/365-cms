/**
 * Returns the first argument supplied to itself.
 *
 * @param   arg - Argument
 * @returns Returns the first argument supplied to itself.
 *
 * @usage
 * `import \{ identity \} from "c-ufunc/libs/identity"`
 *
 * @example
 */
export const identity = <Value>(arg: Value): Value => arg
export const _ = identity
