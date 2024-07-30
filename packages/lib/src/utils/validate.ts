import type { z } from "zod"

import { isDev } from "../isDev"
import { isEmpty } from "../isEmpty"
import { CustomError } from "./customError"

export function validate<Validator extends z.ZodTypeAny>(
  validator: Validator,
  message = "Invalid data",
  code = 422,
  type?: "input" | "system"
): <Data extends Record<string, any>>(data: Data) => Data | CustomError {
  return <Data extends Record<string, any>>(data: Data) => {
    try {
      const result = validator.parse(data)
      if (isEmpty(result)) throw "Not found"

      return result
    } catch (error) {
      if (isDev) console.error(new Error(error as string))

      const options = {
        name: "ValidationError",
        code,
        type,
        issues: (error as any).issues,
        stack: (error as any).stack,
      }
      const validationError = new CustomError(message, options)

      return validationError
    }
  }
}
