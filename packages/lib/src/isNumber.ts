export const isNumber = <Value>(value: Value): boolean =>
  !Number.isNaN(Number.parseInt(value as string))
