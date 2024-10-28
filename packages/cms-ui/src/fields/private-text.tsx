"use client"

import React from "react"
import { z } from "zod"
import { RectangleEllipsis, TriangleAlert } from "lucide-react"

import { cn } from "@repo/ui/cn"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"
import type {
  CmsCollectionColumn,
  CmsConfigField,
  CmsField,
} from "@repo/cms/types.cms"
import { Label } from "@repo/ui/label"
import { PrivateInput } from "@repo/ui/private-input"
import { hasDisallowCharacters } from "@repo/lib/hasDisallowCharacters"
import { isFieldMaxLength } from "@repo/lib/isFieldMaxLength"
import { isFieldMinLength } from "@repo/lib/isFieldMinLength"
import { isFieldRequired } from "@repo/lib/isFieldRequired"

import { TextValidation } from "../validation.cms"

type Option = {
  value: {
    defaultValue?: string
    toggleVisibility?: boolean
  }
}

export type FieldOptionsProps = {
  fieldId: string
  onUpdate: (
    newValue: NonNullable<CmsCollectionColumn["fieldOptions"]>,
    errorMessage?: "string"
  ) => void
} & Option

export type FieldProps = CmsField<HTMLInputElement, string> & {
  value: string
  onUpdate: (newValue: string) => void
}

const validationValidator = z
  .object({
    required: z.boolean().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    disallowCharacters: z.string().optional(),
  })
  .optional()
export type PrivateTextFieldValidation = z.infer<typeof validationValidator>

const FieldValidation = TextValidation

const fieldConfig: CmsConfigField<string, PrivateTextFieldValidation, Option> =
  {
    initialState: "",
    title: "Private Text",
    Icon: ({ className, ...props }: Record<string, any>) => (
      <RectangleEllipsis
        className={cn("h-3 text-muted-foreground", className)}
        {...props}
      />
    ),
    type: "privateText",
    description: "Hidden text",
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
        "block rounded-md border cursor-text",
        isInline && "rounded-none border-t-0",

        errorMessage && "flex items-center",
        className
      )}
    >
      <PrivateInput
        type='text'
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
        onBlur={handleOnBlur}
        onKeyDown={handleOnKeyDown}
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

const TextField = {
  fieldConfig,
  Field,
  FieldOptions,
  FieldValidation,
  validationValidator,
}

export default TextField
