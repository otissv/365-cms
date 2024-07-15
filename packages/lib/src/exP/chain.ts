import type { Func } from "../types"

const cache: Func[] = []

/* eslint-disable functional/no-expression-statement */
/**
 * Lazy evaluates a sequence of functions.
 *
 * @param   ...fns - Function to be executed in sequence.
 * @returns Returns a transformed value, where the previous functions output becomes the input of the next function.
 *
 * @method chain
 * @param  fn - Function to mapped on a value
 * @returns Returns a new chain.
 *
 * @method effect
 * @param  fn - Function to that excuses a side effect.
 * @returns Returns a new chain.
 *
 * @method exec
 * @param initialValue -  Initial value to passed to the reducer.
 *
 * @usage
 * `import \{ chain \} from "c-ufunc/libs/chain"`
 *
 * @example
 * ```
 * chain(toUpperCase)
 * .effect(console.log)
 * .chain(toSnake)
 * .exec('hello world') // HELLO_WORLD
 * ```
 */

// eslint-disable-next-line functional/prefer-readonly-type
export const chain = <Fn extends Func>(fn: Fn) => {
  // eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
  cache.push(fn as any)

  const exec = <Value>(initialValue: Value) => {
    // eslint-disable-next-line functional/no-let
    let result: any = initialValue
    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let i = 0; i < cache.length; i++) {
      // eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
      result = cache[i](result)
    }

    return result
  }
  const effect = (action: (...logs: readonly unknown[]) => unknown) => {
    // eslint-disable-next-line functional/immutable-data
    cache.push(((value: any) => {
      action(value)
      return value
    }) as any)

    return {
      chain,
      effect,
      exec,
    }
  }

  return {
    chain,
    exec,
    effect,
  }
}
