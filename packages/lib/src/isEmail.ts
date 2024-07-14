export const isEmail = (value: string): boolean =>
  /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(value)
