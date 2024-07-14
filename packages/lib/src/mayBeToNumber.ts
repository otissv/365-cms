export function mayBeToNumber(none = 0) {
  return (value: unknown): number => {
    const int = Number.parseInt(value as string, 10)
    return Number.isNaN(int) ? none : int
  }
}
