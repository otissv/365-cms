export function toInt<None extends number>(none: None | number = 0) {
  return (value: unknown): number | None => {
    switch (typeof value) {
      case "boolean":
        return value ? 1 : 0
      case "number":
        return value
      case "string": {
        const number = Number.parseInt(value, 10)
        return Number.isNaN(number) ? none : number
      }
      default:
        return none
    }
  }
}
