import { isValidString } from "./isValidString"

/**
 * Checks if the input string includes any of the characters from the specified characters string.
 * @param input The input string to check.
 * @param characters String containing characters to look for in the input string.
 * @returns true if the input string contains any character from 'characters'; otherwise, false.
 */
export function stringIncludesAnyCharacters(value: string) {
  return (characters: string): boolean => {
    if (!isValidString(value) || !isValidString(characters)) return false

    for (let i = 0; i < characters.length; i++) {
      if (value.includes(characters[i])) {
        return true
      }
    }
    return false
  }
}
