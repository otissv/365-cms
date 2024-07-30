"use client"

import { Flag } from "lucide-react"
import type { z } from "zod"

import { cn } from "@repo/ui/cn"
import TextFelid, {
  type FieldOptionsProps as TextFieldOptionsProps,
  type FieldProps as TextFieldProps,
} from "./text"

const validationValidator = TextFelid.validationValidator
export type TitleFieldValidation = z.infer<typeof validationValidator>

export type FieldOptionsProps = TextFieldOptionsProps
export type FieldProps = TextFieldProps

const fieldConfig: typeof TextFelid.fieldConfig = {
  ...TextFelid.fieldConfig,
  title: "Title",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <Flag className={cn("h-4 text-muted-foreground", className)} {...props} />
  ),
  type: "title",
  description: "Primary key",
}

export function FieldOptions(props: FieldOptionsProps): JSX.Element {
  return TextFelid.FieldOptions({ ...props, type: "title" })
}

const TitleField = {
  ...TextFelid,
  FieldOptions,
  fieldConfig,
  validationValidator,
}

export default TitleField
