export function isBetween(
  value: number | undefined,
  min?: number,
  max?: number
): boolean {
  if (typeof value !== "number") return false

  switch (true) {
    case value === undefined:
      return false
    case min === undefined && max === undefined:
      return false
    case min === undefined && max !== undefined:
      return value <= max
    case max === undefined && min !== undefined:
      return value >= min
    default:
      return min && max ? value >= min && value <= max : false
  }
}
