export function toInt(none?: unknown) {
  return (value: unknown) => {
    const int = Number.parseInt(value as string)
    return Number.isNaN(int) ? none : int
  }
}
