"use client"

import React from "react"
import { z } from "zod"
import { TriangleAlert, TextCursorInput } from "lucide-react"

import { cn } from "@repo/ui/cn"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"
import type { CmsConfigField, CmsField } from "@repo/cms/types.cms"
import { Label } from "@repo/ui/label"
import { deepCompareObjects } from "@repo/lib/compareCollections"

import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group"
import { Input } from "@repo/ui/input"
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
import { useDocument } from "../document-provider"
import { Maybe } from "@repo/ui/maybe"
import { isEmpty } from "@repo/lib/isEmpty"
import { ToggleSwitch } from "@repo/ui/toggle-switch"
import { hasDisallowCharacters } from "@repo/lib/hasDisallowCharacters"
import { isFieldMaxLength } from "@repo/lib/isFieldMaxLength"
import { isFieldMinLength } from "@repo/lib/isFieldMinLength"
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
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    disallowCharacters: z.string().optional(),
  })
  .optional()
export type SelectFieldValidation = z.infer<typeof validationValidator>

//TODO: not correct validation
const FieldValidation = RequiredValidation

const fieldConfig: CmsConfigField<SelectItem[], SelectFieldValidation, Option> =
  {
    initialState: {},
    title: "Select",
    Icon: ({ className, ...props }: Record<string, any>) => (
      <TextCursorInput
        {...props}
        className={cn("h-3 text-muted-foreground", className)}
      />
    ),
    type: "select",
    description: "Select item(s) from a list",
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
  const { fieldOptions } = columns.get<"fieldOptions">(fieldId as any) || {}

  const [{ items, selectedItems }, setState] =
    React.useState<TagSelectSelected>({
      selectedItems: value || [],
      items: fieldOptions?.items || [],
    })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(fieldOptions?.url as RequestInfo)
      if (!response.ok) throw new Error("Network response was not ok")

      const { data } = await response.json()

      setState({
        selectedItems,
        items: data,
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (fieldOptions?.cache && !isEmpty(items)) {
      return
    }

    if (isOpen && fieldOptions?.url && fieldOptions?.itemType === "url") {
      fetchData()
    }
  }, [
    isOpen,
    JSON.stringify(items),
    fieldOptions?.url,
    fieldOptions?.itemType,
    fieldOptions?.cache,
  ])

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

    // if (isOpen) setIsOpen(!isOpen)
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

  const tagItems = items.map(({ id, value }) => {
    return (
      <TagItem
        key={id}
        id={id}
        value={value}
        onRemoveItem={(id: string) =>
          setItems(items.filter((item) => item.id !== id))
        }
      />
    )
  })

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

  const handleOnInputUpdate =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      handleOnUpdate(key)(e.target.value)

  const handleOnItemsUpdate = (newValue: SelectItem[]) => {
    setItems(newValue)
    handleOnUpdate("items")(newValue)
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

      <Maybe check={!isEdit}>
        <RadioGroup
          defaultValue={selectType}
          onValueChange={handleOnUpdate("selectType")}
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='single' id='single' />
            <Label htmlFor='single'>Single item</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='multiple' id='multiple' />
            <Label htmlFor='multiple'>Multiple items</Label>
          </div>
        </RadioGroup>

        <RadioGroup
          defaultValue={itemType}
          onValueChange={handleOnUpdate("itemType")}
        >
          <div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='items' id='items' />
              <Label htmlFor={`${fieldId}-items`}>Items</Label>
            </div>

            <TagsInput>
              <TagInput
                id={`${fieldId}-items`}
                placeholder='Items...'
                selectedItems={items}
                onUpdate={handleOnItemsUpdate}
                disabled={itemType !== "items"}
                inputProps={{
                  className: "rounded-l-md",
                }}
                buttonProps={{
                  className: "rounded-r-md",
                }}
              />
              <TagList>{tagItems}</TagList>
            </TagsInput>
          </div>

          <div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='url' id={`${fieldId}-url`} />
              <Label htmlFor='items'>URL</Label>
            </div>

            <Input
              id={`${fieldId}-url`}
              value={url}
              onChange={handleOnInputUpdate("url")}
              disabled={itemType !== "url"}
            />
          </div>
        </RadioGroup>
      </Maybe>

      <Maybe check={isEdit && itemType == "items"}>
        <div>
          <Label htmlFor={`${fieldId}-items`}>Items</Label>
          <TagsInput>
            <TagInput
              id={`${fieldId}-items`}
              placeholder='Items...'
              selectedItems={items}
              onUpdate={handleOnItemsUpdate}
              inputProps={{
                className: "rounded-l-md",
              }}
              buttonProps={{
                className: "rounded-r-md",
              }}
            />
            <TagList>{tagItems}</TagList>
          </TagsInput>
        </div>
      </Maybe>

      <Maybe check={isEdit && itemType == "url"}>
        <div>
          <Label htmlFor={`${fieldId}-url`}>URL</Label>
          <Input
            id={`${fieldId}-url`}
            value={url}
            onChange={handleOnInputUpdate("url")}
          />
        </div>
        <div>
          <Label htmlFor={`${fieldId}-cache`} className='mb-2'>
            Cache response
          </Label>
          <ToggleSwitch
            title='Cache response'
            className='w-[160px]'
            checked={cache}
            id={`${fieldId}-cache`}
            onOff={"Yes,No"}
            onCheckedChange={handleOnUpdate("cache")}
          />
        </div>
      </Maybe>
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
