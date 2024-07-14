import { stringIncludesAnyCharacters } from "./stringIncludesAnyCharacters"
import { isString } from "./isString"

export function hasDisallowCharacters(
  value: unknown,
  disallow: unknown
): boolean {
  if (
    isString(value) &&
    stringIncludesAnyCharacters(value as string)(disallow as string)
  ) {
    return true
  }

  return false
}
