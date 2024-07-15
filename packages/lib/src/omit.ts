/**
 * Omits keys from an object.
 *
 *
 * @param   array- Array of keys (strings) to omitted.
 *
 * @returns New object with keys with the omit keys.
 *
 * @usage
 * `import { omit } from "c-ufunc/libs/omit"`
 *
 * @example
 * ```
 * const obj = { a:'a', b:'b', c:'c', d:'d' }
 *
 * omit(['a', 'd'])(obj) //{ b:'b', c:'c' }
 * ```
 */
export const omit =
  (keysToExtract: readonly string[]) =>
  <Obj extends Record<any, any>>(obj: Obj) => {
    const newObj: Partial<Obj> = {}

    for (const key in obj) {
      if (!keysToExtract.includes(key)) {
        ;(newObj as any)[key] = obj[key]
      }
    }
    return newObj
  }
