"use client"

import React from "react"
import { z } from "zod"
import { Mail, TriangleAlert } from "lucide-react"

import { cn } from "@repo/ui/cn"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"
import { Input } from "@repo/ui/input"
import type {
  CmsCollectionColumn,
  CmsConfigField,
  CmsField,
} from "@repo/cms/types.cms"
import { Label } from "@repo/ui/label"
import { hasDisallowCharacters } from "@repo/lib/utils/hasDisallowCharacters"
import { isFieldRequired } from "@repo/lib/utils/isFieldRequired"
import { isEmail } from "@repo/lib/isEmail"

import { InternetValidation } from "../validation.cms"

type Option = {
  value: { defaultValue?: string }
}

export type FieldOptionsProps = {
  fieldId: string
  onUpdate: (
    newValue: NonNullable<CmsCollectionColumn["fieldOptions"]>,
    errorMessage?: "string"
  ) => void
} & Option

export type FieldProps = CmsField<HTMLInputElement, string> & {
  id: string
  value: string
}

const validationValidator = z
  .object({
    required: z.boolean().optional(),
    disallowCharacters: z.string().optional(),
    blacklist: z.array(z.string().url()).optional(),
  })
  .optional()
export type EmailFieldValidation = z.infer<typeof validationValidator>

const FieldValidation = InternetValidation

const fieldConfig: CmsConfigField<string, EmailFieldValidation, Option> = {
  initialState: "",
  title: "Email",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <Mail className={cn("h-3 text-muted-foreground", className)} {...props} />
  ),
  type: "email",
  description: "Email Address",
  validationDefaults: {
    required: false,
    disallowCharacters: "",
    blacklist: [],
  },
  validate: ({ value, validation, columnName }) => {
    const { required, disallowCharacters, blacklist } = validation || {}

    switch (true) {
      case isFieldRequired(value, required):
        return {
          value,
          error: `${columnName} field is required`,
        }

      case !isEmail(value as any):
        return {
          value,
          error: "Not a valid email address",
        }

      case hasDisallowCharacters(value, disallowCharacters):
        return {
          value,
          error: `Must not include ${disallowCharacters} characters`,
        }

      case blacklist?.includes(value as string):
        return {
          value,
          error: `${value} is not allowed`,
        }

      default:
        return {
          value,
          error: "",
        }
    }
  },
}

function Field({
  id,
  value,
  className,
  isInline,
  onUpdate,
  errorMessage,
  validate,
  validation,
  columnName,
}: FieldProps): JSX.Element {
  const [state, setState] = React.useState(value || "")

  const handleOnUpdate = () => {
    const { error } = validate?.({
      value: state.trim(),
      validation,
      columnName,
    }) || {
      error: "",
    }

    if ((state !== value && onUpdate) || error) {
      onUpdate(state, error)
    }
  }

  const handleOnBlur = (_e: React.FocusEvent<HTMLInputElement>): void => {
    handleOnUpdate()
  }

  const handleOnKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Enter") {
      handleOnUpdate()
    }
  }

  return (
    <div
      className={cn(
        "flex rounded-md border cursor-text",
        isInline && "rounded-none border-t-0",
        errorMessage && "flex items-center",
        className
      )}
    >
      <Input
        type='email'
        id={id}
        className={cn(
          "min-w-48 p-2 border-0 bg-transparent rounded-none focus:bg-accent",
          !isInline && "rounded-md"
        )}
        aria-describedby={id}
        value={state}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setState(e.target.value)
        }
        onKeyDown={handleOnKeyDown}
        onBlur={handleOnBlur}
      />
      {errorMessage ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <TriangleAlert className='mr-2 size-5 text-destructive' />
            </TooltipTrigger>
            <TooltipContent>
              <p>{errorMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </div>
  )
}

function FieldOptions({
  value = {},
  onUpdate,
  fieldId,
}: FieldOptionsProps): JSX.Element {
  const defaultValue = value.defaultValue || ""

  const handleOnUpdate = (defaultValue: unknown) => {
    onUpdate?.({ defaultValue })
  }

  return (
    <div className='mb-6'>
      <Label htmlFor='defaultValue' className='flex mb-2'>
        Default Value
      </Label>

      <Field
        id='defaultValue'
        fieldId={fieldId}
        value={defaultValue}
        onUpdate={handleOnUpdate}
      />
    </div>
  )
}

export const EmailField = {
  fieldConfig,
  Field,
  FieldOptions,
  FieldValidation,
  validationValidator,
}

export default EmailField
