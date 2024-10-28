import { toInt } from "../toInt"

export function isFieldMaxValue(value: unknown, max: unknown): boolean {
  return toInt()(value) > (max as number)
}
