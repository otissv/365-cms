// not a good clone.

import { isString } from "./isString"
import { isNumber } from "./isNumber"
import { isFunction } from "./isFunction"
import { someTrue } from "./someTrue"
import { isNullOrUndefined } from "./isNullOrUndefined"
import { isError } from "./isError"
import { isArray } from "./isArray"
import { isMap } from "./isMap"
import { isSet } from "./isSet"
import { isBoolean } from "./isBoolean"
import { isDate } from "./isDate"

/**
 * Deep clones a value
 *
 * @param value - Value to be cloned.
 *
 * @returns Returns a deep clone of the value.
 *
 * @usage
 * `import { cloneDeep } from "c-ufunc/libs/cloneDeep"`
 * @example
 * ```
 * cloneDeep({ a: 1, b: { c: 2 } })
 * // { a: 1, b: { c: 2 } }
 * ```
 */
export const cloneDeep = <Value>(value: Value): Value => {
  switch (true) {
    case someTrue([
      isNullOrUndefined(value),
      isString(value),
      isNumber(value),
      isBoolean(value),
      isFunction(value),
      isError(value),
    ]): {
      return value
    }
    case isDate(value): {
      return new Date((value as Date).getTime()) as Value
    }
    case isMap(value): {
      const result = new Map<any, any>()
      for (const [key, val] of (value as Map<any, any>).entries()) {
        result.set(key, cloneDeep(val))
      }
      return result as Value
    }

    case isSet(value): {
      const result = new Set<any>()
      for (const val of (value as Set<any>).values()) {
        result.add(cloneDeep(val))
      }
      return result as Value
    }

    case isArray(value): {
      const result: any = []
      for (const val of (value as any[]).values()) {
        result.push(cloneDeep(val))
      }
      return result as Value
    }

    case typeof value === "object": {
      const result: any = Array.isArray(value) ? [] : {}
      for (const key in value) {
        result[key as any] = cloneDeep(value[key])
      }
      return result as Value
    }

    default:
      return value
  }
}
