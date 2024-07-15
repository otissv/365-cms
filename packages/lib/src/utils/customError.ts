import { isDev } from "../isDev"

export class CustomError extends Error {
  message = ""
  name = "ResponseError"
  code = 422
  issues: { [index: string]: string } = {}
  stack = ""
  entries: string[][] = []
  type: string | undefined

  constructor(
    message: string,
    options?: {
      name: string
      code?: number
      issues?: Record<string, any>[]
      stack?: string
      type?: string
    }
  ) {
    super(message)

    if (message) this.message = message
    if (options?.code) this.code = options?.code
    if (options?.stack && isDev) this.stack = options?.stack
    if (options?.type && isDev) this.stack = options?.type

    if (options?.issues) {
      for (const { path, message } of options.issues) {
        if (typeof path?.[0] === "string") {
          this.issues[path[0]] = message
          this.entries.push([path[0], message])
        }
      }
    }
  }
}

export function errorResponse(error: unknown): {
  data: never[]
  error: string
} {
  if (isDev) console.error(new Error(error as string))

  return {
    data: [],
    error: error instanceof Error ? error.message : (error as string),
  }
}
