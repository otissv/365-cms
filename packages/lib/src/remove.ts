/**
 * Removes an item in a list
 *
 * @param   number | function  —  Number or a function that returns the number to be removed
 * @param   array - List of values
 * @returns Returns a new list with item removed.
 *
 * @usage
 * `import { remove } from "c-ufunc/libs/remove"`
 *
 * @example
 * ```
 * const list = [0, 1, 2, 3, 4]
 * remove(2)(list) // [0, 1, 3, 4]
 *
 *
 * const data: Coord[] = [
 *  { lg: 0, lt: 0 },
 *  { lg: 1, lt: 1 },
 *  { lg: 2, lt: 2 },
 * ]
 * remove((o: Coord) => o.lg === 1)(data) //[{ lg: 0, lt: 0 }, { lg: 2, lt: 2 }]
 *
 * ```
 */
export const remove =
  <Value>(
    index:
      | number
      | ((value: Value, index: number, obj: readonly Value[]) => unknown)
  ) =>
  (list: readonly Value[]) => {
    const n = typeof index === "number" ? index : list.findIndex(index)

    if (n === -1 || n > list.length - 1) return list // did not find item
    if (n === 0) return list.slice(1, list.length) // remove first item in collection
    if (n === list.length - 1) return list.slice(0, list.length - 1) // remove last item in collection
    return [
      ...list.slice(0, n as number),
      ...list.slice((n as number) + 1, list.length),
    ] // remove nth item in collection
  }
