import type { Func } from "./types"

/**
 * Passes arguments to non-behavioral functions and called the main function.
 * Non-behavioral functions are side effects that do not have any affect the on the main function.
 *
 * @param fn              - Function to be called.
 * @param nonBehavioral   - Side effect function.
 * @param args            - Functions arguments.
 *
 * @returns Returns the result of the function called with the arguments.
 */
export const withNonBehavioral =
  <Fn extends Func>(fn: Fn) =>
  <NonBehavioral extends Func>(...nonBehavioral: readonly NonBehavioral[]) =>
  <Args>(...args: readonly Args[]): any => {
    nonBehavioral?.forEach((nonBehavioralFn) => {
      return nonBehavioralFn(fn.name, ...args)
    })

    return fn(...args)
  }
