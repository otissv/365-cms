import { toInt } from "../toInt"

export function isFieldMinValue(value: unknown, min: unknown): boolean {
  return toInt()(value) < (min as number)
}
