"use client"

import { z } from "zod"
import { ToggleLeft, TriangleAlert } from "lucide-react"
import type * as SwitchPrimitives from "@radix-ui/react-switch"

import { Label } from "@repo/ui/label"
import {
  ToggleSwitch,
  type ToggleSwitchOnOffTypes,
} from "@repo/ui/toggle-switch"
import type {
  CmsCollectionColumn,
  CmsConfigField,
  CmsFieldBase,
} from "@repo/cms/types.cms"
import { cn } from "@repo/ui/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"

import { RequiredValidation } from "../validation.cms"
import { isFieldRequired } from "@repo/lib/utils/isFieldRequired"

type Option = {
  value: {
    defaultValue?: boolean
    falseValue?: string
    trueValue?: string
  }
}

export type FieldOptionsProps = {
  fieldId: string
  onUpdate: (
    newValue: NonNullable<CmsCollectionColumn["fieldOptions"]>,
    errorMessage?: "string"
  ) => void
} & Option

export type FieldProps = CmsFieldBase<boolean> &
  Omit<SwitchPrimitives.SwitchProps, "value"> & {
    title: string
    id: string
    onOff?: ToggleSwitchOnOffTypes
    value: boolean
  }

const validationValidator = z
  .object({
    required: z.boolean().optional(),
  })
  .optional()
export type BooleanFieldValidation = z.infer<typeof validationValidator>

const FieldValidation = RequiredValidation

const fieldConfig: CmsConfigField<boolean, BooleanFieldValidation, Option> = {
  initialState: "",
  type: "boolean",
  title: "Boolean",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <ToggleLeft
      className={cn("h-3 text-muted-foreground", className)}
      {...props}
    />
  ),
  description: "Yes or no, true or false",
  validationDefaults: {
    required: false,
  },
  validate: ({ value, validation, columnName }) => {
    const { required } = validation || {}
    console.log({ value, validation, columnName })

    if (isFieldRequired(value, required)) {
      return { value, error: `${columnName} field is required` }
    }
    return { value, error: "" }
  },
}

function Field({
  id,
  value,
  className,
  isInline,
  onUpdate,
  validate,
  validation,
  columnName,
  errorMessage,
}: FieldProps): JSX.Element {
  const handleOnUpdate = (newValue: boolean) => {
    const { error } = validate?.({
      value: newValue,
      validation,
      columnName,
    }) || {
      error: "",
    }

    onUpdate(newValue, error)
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
      <ToggleSwitch
        id={id}
        aria-describedby={id}
        title='toggle button'
        className={"w-full"}
        checked={value}
        onCheckedChange={handleOnUpdate}
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
  const defaultValue = value.defaultValue || false

  const handleOnUpdate = (defaultValue: unknown) => {
    onUpdate?.({ defaultValue })
  }

  return (
    <div className='mb-6'>
      <Label htmlFor='defaultValue' className='flex mb-2'>
        Default Value
      </Label>

      <Field
        title=''
        id='defaultValue'
        fieldId={fieldId}
        value={defaultValue}
        onUpdate={handleOnUpdate}
      />
    </div>
  )
}

export const BooleanField = {
  fieldConfig,
  Field,
  FieldOptions,
  FieldValidation,
  validationValidator,
}

export default BooleanField
