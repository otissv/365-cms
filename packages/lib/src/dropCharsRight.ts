import { maybeString } from "./maybeString"

/**
 * Removes a number characters from the end of a string.
 *
 * @param   n       - The number representing number of characters to drop
 * @param   string  - String to be evaluated.
 *
 * @returns Returns a sub-string from the right of the string starting from position n.
 *
 * @usage
 * `import { dropCharsRight } from "c-ufunc/libs/dropCharsRight"`
 *
 * @example
 * ```
 * dropCharsRight(0)("hello") // "hell"
 * ```
 */
export const dropCharsRight =
  (n: number) =>
  (string: string): string => {
    if (typeof n === "number") {
      const str = maybeString(string)
      return n >= 0 ? str.substr(0, str.length - (n + 1)) : ""
    }

    return maybeString(string)
  }
