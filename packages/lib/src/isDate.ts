import { getType } from "./getType"

/**
 * Checks if string is a number
 *
 * @param   value  - Value to be evaluated.
 *
 * @returns Returns true if value is a boolean.
 *
 * @usage
 * `import \{ isDate \} from "c-ufunc/libs/isDate"`
 *
 * @example
 * ```
 * isDate(new Date('2020-01-01')) // true
 * isDate(1) // false
 * ```
 */
export const isDate = <Value>(value: Value) =>
  (value instanceof Date || getType(Date) === "Date") &&
  !Number.isNaN((value as Date).valueOf())
