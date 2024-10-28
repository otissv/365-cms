"use client"

import React from "react"
import { z } from "zod"
import { ChevronDown, Tags, TriangleAlert } from "lucide-react"

import { cn } from "@repo/ui/cn"

import type { CmsConfigField, CmsField } from "@repo/cms/types.cms"
import {
  TagItem,
  TagInput,
  TagsInput,
  TagList,
  TagSelect,
  TagSelectContent,
  TagSelectGroup,
  TagSelectTrigger,
  type TagSelectSelected,
  TagSelectOptions,
} from "@repo/ui/tags"
import { Label } from "@repo/ui/label"
import { hasDisallowCharacters } from "@repo/lib/hasDisallowCharacters"
import { isFieldMaxLength } from "@repo/lib/isFieldMaxLength"
import { isFieldMinLength } from "@repo/lib/isFieldMinLength"
import { isFieldRequired } from "@repo/lib/isFieldRequired"
import { useDocument } from "../document-provider"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"
import { Button } from "@repo/ui/button"

import { TextValidation } from "../validation.cms"

export type SelectItem = {
  id: string
  value: string
}
export type SelectFieldValue = {
  value: SelectItem[]
  items: SelectItem[]
}

type Option = {
  value: { defaultValue?: string }
}

export type FieldOptionsProps = {
  isEdit?: boolean
  fieldId: string
  onUpdate: (newValue: unknown, errorMessage?: "string") => void
} & Option

export type FieldProps = Omit<
  CmsField<HTMLInputElement, SelectItem[]>,
  "type"
> & {
  value: SelectItem[]
  onUpdate: (selectItem: SelectItem) => void
  type?: "single" | "multiple"
}

const validationValidator = z
  .object({
    required: z.boolean().optional(),
    minItems: z.number().optional(),
    maxItems: z.number().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    disallowCharacters: z.string().optional(),
  })
  .optional()
export type TagsFieldValidation = z.infer<typeof validationValidator>

//TODO: not correct validation
const FieldValidation = TextValidation

const fieldConfig: CmsConfigField<SelectItem[], TagsFieldValidation, Option> = {
  initialState: "",
  title: "Tags",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <Tags {...props} className={cn("h-3 text-muted-foreground", className)} />
  ),
  type: "tags",
  description: "",
  validationDefaults: {
    minItems: 0,
    maxItems: 0,
    minLength: 0,
    maxLength: 0,
    disallowCharacters: "",
  },
  validate: ({ value, validation, columnName }) => {
    const { required, minLength, maxLength, disallowCharacters } =
      validation || {}
    // TODO: min/max items

    switch (true) {
      case isFieldRequired(value, required):
        return { value, error: `${columnName} field is required` }

      case hasDisallowCharacters(value, disallowCharacters):
        return {
          value,
          error: `Must not include ${disallowCharacters} characters`,
        }

      case isFieldMinLength(value, minLength):
        return {
          value,
          error: `${columnName} must have a minium length of ${minLength} and a maximum length of ${maxLength}`,
        }

      case isFieldMaxLength(value, maxLength):
        return {
          value,
          error: `${columnName} must have a minium length of ${minLength} and a maximum length of ${maxLength}`,
        }

      case hasDisallowCharacters(value, disallowCharacters):
        return {
          value,
          error: `Must not include ${disallowCharacters} characters`,
        }

      default:
        return { value, error: "" }
    }
  },
}

function Field({
  id,
  value,
  onBlur,
  fieldId,
  onUpdate,
  errorMessage,
  validate,
  validation,
  isInline,
  columnName,
}: FieldProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false)
  const {
    state: { columns },
  } = useDocument()
  const { fieldOptions } = columns.get<"fieldOptions">(fieldId as any) || {}

  const [{ items, selectedItems }, setState] =
    React.useState<TagSelectSelected>({
      selectedItems: value || [],
      items: fieldOptions?.list || [],
    })

  const handleOnUpdate = (
    selectedItems: TagSelectSelected["selectedItems"]
  ) => {
    setState({
      items,
      selectedItems,
    })
  }

  const selected = selectedItems.map(({ id, value }) => {
    return (
      <TagItem
        key={id}
        id={id}
        value={value}
        className='h-[calc(42px-0.50rem)]'
        onRemoveItem={(id: string) =>
          handleOnUpdate(selectedItems.filter((s) => s.id !== id))
        }
      />
    )
  })

  return (
    <TooltipProvider>
      <TagsInput className={cn("flex border", !isInline && "rounded-md")}>
        <TagList>{selected}</TagList>
        <Popover open={isOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              className={cn(
                "flex size-10 p-0 border-0 ml-auto !mt-0",
                errorMessage && "flex items-center"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              <ChevronDown className='h-4 w-4' />
              {errorMessage ? (
                <Tooltip>
                  <TooltipTrigger>
                    <TriangleAlert className='mr-2 size-5 text-destructive' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{errorMessage}</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align='end'
            className='w-full p-0 border-0 rounded-md'
            onInteractOutside={() => setIsOpen(false)}
          >
            <TagInput
              id={`${fieldId}-items`}
              placeholder='Items...'
              selectedItems={selectedItems}
              onUpdate={handleOnUpdate}
              inputProps={{
                className: "rounded-l-md",
              }}
              buttonProps={{
                className: "rounded-r-md",
              }}
            />
          </PopoverContent>
        </Popover>
      </TagsInput>
    </TooltipProvider>
  )
}

function FieldOptions({
  value = {},
  onUpdate,
  fieldId,
}: FieldOptionsProps): JSX.Element {
  const defaultValue = value.defaultValue || ""

  const handleOnUpdate = (defaultValue: SelectItem[]) => {
    onUpdate?.({
      defaultValue,
    })
  }

  return (
    <div className='mb-6'>
      <Label htmlFor={`${fieldId}-defaultValue`} className='flex mb-2'>
        Default Value
      </Label>

      <Field
        id={`${fieldId}-defaultValue`}
        fieldId={fieldId}
        value={defaultValue}
        onUpdate={handleOnUpdate}
      />
    </div>
  )
}

export const TagsField = {
  fieldConfig,
  Field,
  FieldOptions,
  FieldValidation,
  validationValidator,
}

export default TagsField
