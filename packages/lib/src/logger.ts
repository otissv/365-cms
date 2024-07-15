export const logger =
  (printer: (...logs: readonly unknown[]) => unknown) =>
  (...logs: readonly unknown[]) =>
  <Value>(value: Value): Value => {
    printer(...logs)
    return value
  }
