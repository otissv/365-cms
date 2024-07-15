/**
 * Updates an item in a list
 *
 * @param   number | function  —  Number or a function that returns the number to be removed
 * @param   array - List of values
 * @param   data - Updated value
 * @returns Returns a new list with item updated.
 *
 * @usage
 * `import { update } from "c-ufunc/libs/update"`
 *
 * @example
 * ```
 * const list = [0, 1, 2, 3, 4]
 * update(2)(list)(99) // [0, 1, 99, 3, 4]
 *
 * const data: Corod[] = [
 *   { lg: 0, lt: 0 },
 *   { lg: 1, lt: 1 },
 *   { lg: 2, lt: 2 },
 * ]
 * update((o: Corod) => o.lg === 2)(data)({ lg: 99, lt: 99 })
 * [
 *   { lg: 0, lt: 0 },
 *   { lg: 1, lt: 1 },
 *   { lg: 99, lt: 99 },
 * ]
 * ```
 */
export const update =
  <Value>(
    index:
      | number
      | ((value: Value, index: number, obj: readonly Value[]) => unknown)
  ) =>
  (list: readonly Value[]) =>
  (value: Value) => {
    const n = typeof index === "number" ? index : list.findIndex(index)

    if (n === -1 || n > list.length - 1) return list // did not find item
    if (n === 0) return [value, ...list.slice(1, list.length)] // update first item in collection
    if (n === list.length - 1) return [...list.slice(0, list.length - 1), value] // update last item in collection
    return [
      ...list.slice(0, n as number),
      value,
      ...list.slice((n as number) + 1, list.length),
    ] // update nth item in collection
  }
