import type { Func } from "./types"

/**
 * Returns a functions arguments names.
 *
 * @param fn -  function whose arguments will be extracted.
 *
 * @returns Returns an array of argument names.
 *
 * @usage
 * `import \{ argNames \} from "c-ufunc/libs/argNames"`
 *
 * @example
 * ```
 * argNames((a: number, b: number) => a + b)
 * // ["a", "b"]
 * ```
 */

export const argNames = <Fn extends Func>(fn: Fn): readonly string[] => {
  if (!fn) {
    return []
  }

  const match = fn
    .toString()
    .replace(/[\r\n\s]+/g, " ")
    .match(/(?:function\s*\w*)?\s*(?:\((.*?)\)|([^\s]+))/) as RegExpMatchArray

  const result = match.slice(1, 3).filter(Boolean)
  return result.length === 0 ? [] : result.join("").split(/\s*,\s*/)
}
