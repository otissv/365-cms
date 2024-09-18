export function removeObjectKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = {} as Omit<T, K>

  for (const [key, value] of Object.entries(obj)) {
    if (!keys.includes(key as K)) {
      ;(result as any)[key] = value
    }
  }

  return result
}
