import { maybeType } from "./maybeType"

//TODO: fix test
/**
 * Checks if value is of type number.
 *
 * @param value   - Value to be evaluated.
 *
 * @returns Returns the value if the value is a number, else returns 0.
 *
 * @usage
 * import \{ maybeNumber \} from "c-ufunc/libs/maybeNumber"
 *
 * @example
 * ```
 * maybeNumber(1) // 1
 * maybeNumber(null) // 0
 * ```
 * */
export const maybeNumber =
  (none = 0) =>
  (value: unknown): number => {
    const result = maybeType(none)("number")(value)

    return !Number.isNaN(result) ? result : none
  }
