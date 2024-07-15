export function mayBeToNumber(none = 0) {
  return (value: unknown): number => {
    if (typeof value !== "string" || typeof value !== "number") return none

    const n =
      value % 1 !== 0
        ? Number.parseFloat(value as string)
        : Number.parseInt(value as string, 10)

    return Number.isNaN(n) ? none : n
  }
}
