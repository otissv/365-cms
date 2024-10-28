"use client"

import React from "react"
import { Hash, TriangleAlert } from "lucide-react"
import { z } from "zod"

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
import { isFieldRequired } from "@repo/lib/isFieldRequired"
import { isFieldMinValue } from "@repo/lib/isFieldMinValue"
import { isFieldMaxValue } from "@repo/lib/isFieldMaxValue"

import { NumberValidation } from "../validation.cms"

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
    min: z.number().optional(),
    max: z.number().optional(),
  })
  .optional()
export type NumberFieldValidation = z.infer<typeof validationValidator>

const FieldValidation = NumberValidation

const fieldConfig: CmsConfigField<number, NumberFieldValidation, Option> = {
  initialState: 0,
  title: "Number",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <Hash className={cn("h-3 text-muted-foreground", className)} {...props} />
  ),
  type: "number",
  description: "ID, rating, order number",
  validationDefaults: { required: false, min: 0, max: 0 },
  validate: ({ value, validation, columnName }) => {
    const { required, min, max } = validation || {}

    switch (true) {
      case isFieldRequired(value, required):
        return {
          value,
          error: `${columnName} field is required`,
        }

      case isFieldMinValue(value, min): {
        return min === 0
          ? { value, error: "" }
          : {
              value,
              error: `${columnName} must be a value between ${min} and ${max}`,
            }
      }

      case isFieldMaxValue(value, max): {
        return max === 0
          ? { value, error: "" }
          : {
              value,
              error: `${columnName} must be a value between ${min} and ${max}`,
            }
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
        type='number'
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

export const NumberField = {
  fieldConfig,
  Field,
  FieldOptions,
  FieldValidation,
  validationValidator,
}

export default NumberField
