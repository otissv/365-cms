"use client"

import React from "react"
import { z } from "zod"
import { AlignLeft } from "lucide-react"

import { cn } from "@repo/ui/cn"
import type {
  CmsCollectionColumn,
  CmsConfigField,
  CmsField,
} from "@repo/cms/types.cms"
import { Label } from "@repo/ui/label"
import { Textarea } from "@repo/ui/textarea"
import { hasDisallowCharacters } from "@repo/lib/hasDisallowCharacters"
import { isFieldMaxLength } from "@repo/lib/isFieldMaxLength"
import { isFieldMinLength } from "@repo/lib/isFieldMinLength"
import { isFieldRequired } from "@repo/lib/isFieldRequired"

import { TextValidation } from "../validation.cms"
import { InlinePopupField } from "./inline-popup-field"

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

export type FieldProps = CmsField<HTMLTextAreaElement, string> & {
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
export type ParagraphFieldValidation = z.infer<typeof validationValidator>

const FieldValidation = TextValidation

const fieldConfig: CmsConfigField<string, ParagraphFieldValidation, Option> = {
  initialState: "",
  title: "Paragraph",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <AlignLeft
      className={cn("h-3 text-muted-foreground", className)}
      {...props}
    />
  ),
  type: "paragraph",
  description: "Paragraphs",
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
        console.log("isFieldRequired: ", value, required)
        return { value, error: `${columnName} field is required` }

      case hasDisallowCharacters(value, disallowCharacters):
        console.log("hasDisallowCharacters: ", value, hasDisallowCharacters)
        return {
          value,
          error: `Must not include ${disallowCharacters} characters`,
        }

      case isFieldMinLength(value, minLength):
        console.log("isFieldMinLength: ", value, minLength)
        return minLength === 0
          ? { value, error: "" }
          : {
              value,
              error: `${columnName} must have a minium length of ${minLength} and a maximum length of ${maxLength}`,
            }

      case isFieldMaxLength(value, maxLength):
        console.log("isFieldMaxLength: ", value, maxLength)
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
  onUpdate,
  errorMessage,
  validate,
  validation,
  isInline,
  columnName,
}: FieldProps): JSX.Element {
  const [state, setState] = React.useState(value || "")
  const [inputState, setInputState] = React.useState(value || "")

  const handleOnUpdate = () => {
    const { error } = validate?.({
      value: state.trim(),
      validation,
      columnName,
    }) || {
      error: "",
    }

    if (state !== value) {
      setInputState(state)
    }

    if ((state !== value && onUpdate) || error) {
      setInputState(state)
      onUpdate(state, error)
    }
  }

  const handleOnBlur = (_e: React.FocusEvent<HTMLTextAreaElement>): void => {
    handleOnUpdate()
  }

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter") {
      handleOnUpdate()
    }
  }

  return (
    <InlinePopupField
      isInline={isInline}
      errorMessage={errorMessage}
      value={inputState}
      onOpenChange={(open) => !open && handleOnUpdate()}
    >
      <Textarea
        id={id}
        className={cn(
          "min-w-48 p-2 border-0 bg-transparent rounded-none focus:bg-accent",
          !isInline && "rounded-md"
        )}
        aria-describedby={id}
        value={state}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setState(e.target.value)
        }
        onKeyDown={handleOnKeyDown}
        onBlur={handleOnBlur}
      />
    </InlinePopupField>
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

export const ParagraphField = {
  fieldConfig,
  Field,
  FieldOptions,
  FieldValidation,
  validationValidator,
}

export default ParagraphField
