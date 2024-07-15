import type { Func } from "./types"

/**
 * Maps a function over another function
 *
 * @param  outerFn  - Outer function which receives the innerFn result as an argument.
 * @param  interFn  - Inner (first) function to be applied to value
 *
 *
 * @returns Returns mapped value.
 *
 * @usage
 * `import \{ fmap \} from "c-ufunc/libs/fmap"`
 *
 * @example
 * ```
 * const innerFn = (person: Record<string, any>) => ({
 *    name: person.name.toUpperCase(),
 *  });
 *  const outerFn =({
 *    name,
 *  }: Record<string, any>) => ({ name });
 *
 * fmap(innerFn)(outerFn)({ name: 'Sam Wilson' })
 * // { name: 'SAM WILSON' }
 * ```
 */
export const fmap =
  <OuterFn extends Func>(outerFn: OuterFn) =>
  <InterFn extends Func>(innerFn: InterFn) =>
  <Value>(value: Value): any =>
    outerFn(innerFn(value))
