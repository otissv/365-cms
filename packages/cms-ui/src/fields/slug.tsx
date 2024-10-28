"use client"

import { TriangleAlert, Type } from "lucide-react"
import React from "react"
import { z } from "zod"

import { hasDisallowCharacters } from "@repo/lib/hasDisallowCharacters"
import { isFieldMaxLength } from "@repo/lib/isFieldMaxLength"
import { isFieldMinLength } from "@repo/lib/isFieldMinLength"
import { isFieldRequired } from "@repo/lib/isFieldRequired"
import { cn } from "@repo/ui/cn"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import type {
  CmsCollectionColumn,
  CmsConfigField,
  CmsField,
} from "@repo/cms/types.cms"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"

import { SlugValidation } from "../validation.cms"

type Option = {
  value: { defaultValue?: string }
}

export type FieldOptionsProps = {
  type?: "slug"
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
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    disallowCharacters: z.string().optional(),
  })
  .optional()
export type TextFieldValidation = z.infer<typeof validationValidator>

const FieldValidation = SlugValidation

const fieldConfig: CmsConfigField<string, TextFieldValidation, Option> = {
  initialState: "",
  title: "Slug",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <Type className={cn("h-4 text-muted-foreground", className)} {...props} />
  ),
  type: "slug",
  description: "Slug, title, path",
  validationDefaults: {
    required: false,
    minLength: 0,
    maxLength: 0,
    disallowCharacters: "",
  },
  validate: ({ value, validation, columnName }) => {
    const { required, minLength, maxLength, disallowCharacters } =
      validation || {}

    switch (true) {
      case isFieldRequired(value, required):
        return { value, error: `${columnName} field is required` }

      case hasDisallowCharacters(value, disallowCharacters):
        return {
          value,
          error: `Must not include ${disallowCharacters} characters`,
        }

      case isFieldMinLength(value, minLength):
        return minLength === 0
          ? { value, error: "" }
          : {
              value,
              error: `${columnName} must have a minium length of ${minLength} and a maximum length of ${maxLength}`,
            }

      case isFieldMaxLength(value, maxLength):
        return maxLength === 0
          ? { value, error: "" }
          : {
              value,
              error: `${columnName} must have a minium length of ${minLength} and a maximum length of ${maxLength}`,
            }

      default:
        return { value, error: "" }
    }
  },
}

function Field({
  id,
  value,
  className,
  fieldId,
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

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
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
        type='text'
        id={id}
        className={cn(
          "min-w-48 p-2 border-0 bg-transparent rounded-none focus:bg-accent",
          !isInline && "rounded-md"
        )}
        aria-describedby={id}
        value={state}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setState(e.target.value.replace(" ", "_"))
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
  type = "slug",
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
        type={type}
        value={defaultValue}
        onUpdate={handleOnUpdate}
      />
    </div>
  )
}

export const TextField = {
  fieldConfig,
  Field,
  FieldOptions,
  FieldValidation,
  validationValidator,
}

export default TextField
