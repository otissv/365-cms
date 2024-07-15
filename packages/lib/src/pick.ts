/**
 * Transforms a string to snake case
 *
 * @param   array - Array of keys (strings) to inclued.
 *
 * @returns Returns a new object with only the requested keys included.
 *
 * @usage
 * `import { pick } from "c-ufunc/libs/pick"`
 *
 * @example
 * ```
 * const obj = { a:'a', b:'b', c:'c', d:'d' }
 *
 * pick(['a', 'd'])(obj) //{ a:'a', d:'d' }
 * ```
 */
export const pick =
  (keysToExtract: readonly string[]) =>
  <Obj extends {}>(obj: Obj): Partial<Obj> => {
    const newObj: Partial<Obj> = {}

    for (const key in obj) {
      if (keysToExtract.includes(key)) {
        ;(newObj as any)[key] = obj[key]
      }
    }

    return newObj
  }
