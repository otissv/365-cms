export function omitColumnFromCollection<T extends Record<string, any>>(
  fn?: ([key, value, columns]: [keyof T, any, (keyof T)[]]) => any
) {
  const callback = ([key, value, columns]: [keyof T, any, (keyof T)[]]) => {
    if (!columns.includes(key as keyof T)) return value
  }

  return (columns: (keyof T)[]) => (array: T[]) => {
    return array.map((obj) => {
      const picked: Partial<T> = {}

      for (const [key, value] of Object.entries(obj)) {
        const result = fn
          ? fn([key, value, columns])
          : callback([key, value, columns])

        if (result) {
          ;(picked as any)[key] = result
        }
      }

      return picked
    })
  }
}
