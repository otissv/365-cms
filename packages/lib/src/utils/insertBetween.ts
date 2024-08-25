export function insertBetween<T>(separator: string) {
  return (arr: T[]): (T | string)[] => {
    const result: (T | string)[] = []

    for (let i = 0; i < arr.length; i++) {
      result.push(arr[i])
      if (i < arr.length - 1) {
        result.push(separator)
      }
    }

    return result
  }
}
