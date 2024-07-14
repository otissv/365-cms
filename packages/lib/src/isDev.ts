/**
 * Evaluates if the NODE_ENV environment variable is set to development.
 *
 * @returns Returns true if NODE_ENV environment variable is development.
 *
 * @usage
 * `import \{ isDev \} from "c-ufunc/libs/isDev"`
 *
 * @example
 * ```
 * isDev() // true | false
 * ```
 */
export const isDev: boolean =
  process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development"
