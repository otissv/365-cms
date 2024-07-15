/**
 * Inserts an item in a list
 *
 * @param   number | function  —  Number or a function that returns the number to be removed
 * @param   array - List of values
 * @param   data - Insert value
 * @returns Returns a new list with item inserted.
 *
 * @usage
 * `import { insert } from "c-ufunc/libs/insert"`
 *
 * @example
 * ```
 * const list = [0, 1, 2, 3, 4]
 * insert(2)(list)(99) // [0, 1, 99, 2, 3, 4]
 *
 * const data: Corod[] = [
 *   { lg: 0, lt: 0 },
 *   { lg: 1, lt: 1 },
 *   { lg: 2, lt: 2 },
 * ]
 * insert((o: Corod) => o.lg === 2)(data)({ lg: 99, lt: 99 })
 * [
 *   { lg: 0, lt: 0 },
 *   { lg: 1, lt: 1 },
 *   { lg: 99, lt: 99 },
 *   { lg: 2, lt: 2 },
 * ] ```
 */
export const insert =
  <Value>(
    index:
      | number
      | ((value: Value, index: number, obj: readonly Value[]) => unknown)
  ) =>
  (list: readonly Value[]) =>
  (value: Value) => {
    const n = typeof index === "number" ? index : list.findIndex(index)

    if (n === -1 || n > list.length - 1) return [...list, value] // did not find item
    if (n === 0) return [value, ...list] // insert first item in collection
    if (n === list.length - 1)
      return [
        ...list.slice(0, list.length - 1),
        value,
        ...list.slice(list.length - 1, list.length),
      ] // insert last item in collection
    return [
      ...list.slice(0, n as number),
      value,
      ...list.slice(n as number, list.length),
    ] // insert nth item in collection
  }
