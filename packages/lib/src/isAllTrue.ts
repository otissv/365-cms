export function isAllTrue(...values: (() => void)[]): boolean {
  for (const value of values) {
    // biome-ignore lint/complexity/noExtraBooleanCast: covert value to boolean type
    if (!Boolean(value())) return false
  }

  return true
}
