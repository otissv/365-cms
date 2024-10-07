"use client"

import { format } from "date-fns"

import { cn } from "@repo/ui/cn"
import { Input } from "@repo/ui/input"
import type { CmsConfigField, CmsField } from "@repo/cms/types.cms"

export type FieldProps = CmsField<HTMLInputElement, string> & {
  id: string
  value: string
  formatString?: string
}

const fieldConfig: CmsConfigField<string, undefined, undefined> = {
  initialState: "",
  title: "Information",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <span className={cn("inline-flex w-6", className)} {...props} />
  ),
  type: "infoDate",
  description: "Non-editable text",
}

function Field({
  value,
  className,
  fieldId,
  isInline,
  errorMessage,
  formatString = "MMMM dd yyyy HH:mm:ss OOOO",
}: FieldProps): JSX.Element {
  return (
    <div
      className={cn(
        "block rounded-md border cursor-text hover:bg-accent",
        isInline && "rounded-none border-t-0",

        errorMessage && "flex items-center",
        className
      )}
    >
      <Input
        type='text'
        id={fieldId}
        className={cn(
          "min-w-48 p-2 border-0 bg-transparent rounded-none focus:bg-accent",
          "disabled:cursor-default disabled:opacity-100",
          !isInline && "rounded-md"
        )}
        aria-describedby='helper-text-explanation'
        defaultValue={value && format(value, formatString)}
      />
    </div>
  )
}

const InfoDateField = {
  fieldConfig,
  Field,
}

export default InfoDateField
