export function removeObjectKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => {
    const { [key]: _, ...rest } = result
    Object.assign(result, rest)
  })
  return result
}
