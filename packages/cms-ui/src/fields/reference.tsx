"use client"

import React from "react"
import { z } from "zod"
import { TriangleAlert, Replace } from "lucide-react"

import { cn } from "@repo/ui/cn"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"
import {
  type TagSelectSelected,
  TagItem,
  TagsInput,
  TagSelect,
  TagList,
  TagSelectTrigger,
  TagSelectContent,
  TagSelectGroup,
  TagSelectOptions,
} from "@repo/ui/tags"
import type { CmsConfigField, CmsField } from "@repo/cms/types.cms"
import { Label } from "@repo/ui/label"
import { deepCompareObjects } from "@repo/lib/compareCollections"
import { useDocument } from "../document-provider"
import { isFieldRequired } from "@repo/lib/isFieldRequired"

import { RequiredValidation } from "../validation.cms"

export type SelectItem = {
  id: string
  value: string
}
export type SelectFieldValue = {
  value: SelectItem[]
  items: SelectItem[]
}

type Option = {
  value: {
    defaultValue?: string
    items?: SelectItem[]
    selectType?: "single" | "multiple"
    itemType?: "items" | "url"
    url?: RequestInfo
    cache?: boolean
  }
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
  })
  .optional()
export type ReferenceFieldValidation = z.infer<typeof validationValidator>

//TODO: not correct validation
const FieldValidation = RequiredValidation

const fieldConfig: CmsConfigField<
  SelectItem[],
  ReferenceFieldValidation,
  Option
> = {
  initialState: {},
  title: "Reference",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <Replace
      {...props}
      className={cn("h-3 text-muted-foreground", className)}
    />
  ),
  type: "reference",
  description: "Link between collections",
  validationDefaults: {
    required: false,
    minItems: 0,
    maxItems: 0,
  },
  validate: ({ value, validation, columnName }) => {
    const { required, minLength, maxLength, disallowCharacters } =
      validation || {}
    // TODO: min/max items

    switch (true) {
      case isFieldRequired(value, required):
        return {
          value: `${columnName} field is required`,
          error: "",
        }

      default:
        return { value, error: "" }
    }
  },
}

function Field({
  id,
  value = [],
  onBlur,
  className,
  fieldId,
  isInline,
  type,
  onUpdate,
  errorMessage,
  validate,
  validation,
  columnName,
}: FieldProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const {
    state: { columns },
  } = useDocument()
  const { fieldOptions } = columns.get(fieldId) || {}

  const [{ items, selectedItems }, setState] =
    React.useState<TagSelectSelected>({
      selectedItems: value || [],
      items: fieldOptions?.items || [],
    })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/cms/collections/api")
      if (!response.ok) throw new Error("Network response was not ok")

      const { data, error } = await response.json()

      setState({
        selectedItems,
        items: data.map(({ id, name }) => ({ id: `${id}`, value: name })),
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    // if (fieldOptions?.cache && !isEmpty(items)) {
    //   return
    // }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen, JSON.stringify(items)])

  const updateState = (selectedItems: TagSelectSelected["selectedItems"]) => {
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
        onRemoveItem={(id: string) => {
          return updateState(selectedItems.filter((s) => s.id !== id))
        }}
      />
    )
  })

  const handleOnUpdate = () => {
    if (isOpen && !deepCompareObjects(selectedItems)(value)) {
      onUpdate?.(selectedItems)
    }

    if (isOpen) setIsOpen(!isOpen)
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
      <TagsInput
        className={cn(
          isInline && "rounded-none border-t-0 w-full",
          fieldOptions?.selectType
        )}
      >
        <TagSelect open={isOpen} onOpenChange={handleOnUpdate} type='multiple'>
          <TagList className='flex-nowrap'>{selected}</TagList>
          <TagSelectTrigger
            placeholder='Select'
            selectedItems={selectedItems}
            type={type}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(isInline && "rounded-none")}
          />
          <TagSelectContent>
            <TagSelectGroup>
              <TagSelectOptions
                type={type}
                items={items}
                selectedItems={selectedItems}
                onSelect={updateState}
              />
            </TagSelectGroup>
          </TagSelectContent>
        </TagSelect>
      </TagsInput>
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
  isEdit,
}: FieldOptionsProps): JSX.Element {
  const [items, setItems] = React.useState(value.items || [])

  const defaultValue = value.defaultValue || ""
  const url = value.url || ""
  const selectType = value.selectType || "single"
  const itemType = value.itemType || "items"
  const cache = value.cache || false

  const handleOnUpdate =
    (key: string) => (value: string | number | boolean | SelectItem[]) => {
      onUpdate?.({
        defaultValue,
        items,
        selectType,
        itemType,
        url,
        cache,
        [key]: value,
      })
    }

  return (
    <div className='space-y-6'>
      <div>
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
