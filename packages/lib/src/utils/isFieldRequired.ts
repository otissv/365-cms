import { isNullOrUndefined } from "../isNullOrUndefined"

export function isFieldRequired(value: unknown, required: unknown): boolean {
  // biome-ignore lint/complexity/noExtraBooleanCast: if not cast returns may return none boolean value
  return !isNullOrUndefined(required) && !Boolean(value) && Boolean(required)
}
