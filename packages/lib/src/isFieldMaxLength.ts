import { isString } from "./isString"

export function isFieldMaxLength(value: unknown, length: unknown): boolean {
  return isString(value) && (length as number) < (value as string).length
}
