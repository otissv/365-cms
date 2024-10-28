"use client"

import React from "react"
import { z } from "zod"
import { FileText, TriangleAlert } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"
import { Popover } from "@repo/ui/popover"
import { Input } from "@repo/ui/input"
import { PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { cn } from "@repo/ui/cn"
import { Label } from "@repo/ui/label"
import type { CmsField, CmsConfigField } from "@repo/cms/types.cms"
import type { AutocompleteCheckboxOption } from "@repo/ui/autocomplete-checkbox"
import {
  TagInput,
  type TagInputItem,
  TagItem,
  TagList,
  TagsInput,
} from "@repo/ui/tags"
import { ToggleSwitch } from "@repo/ui/toggle-switch"
import { isFieldRequired } from "@repo/lib/isFieldRequired"
import {
  UploadProvider,
  UploadDropzone,
  type Upload,
  UploadError,
  UploadAccepts,
  UploadPreview,
} from "./upload"
import { FileValidation } from "../validation.cms"

export type UploadFile = File & {
  alt: string
  preview: string
}

type Option = {
  value: {
    items?: AutocompleteCheckboxOption[]
    defaultValue?: AutocompleteCheckboxOption[]
    isMultiple?: Upload["isMultiple"]
    type: Upload["type"]
    accept?: Record<string, string[]>
  }
}

export type FieldOptionsProps = {
  fieldId: string
  onUpdate: (props: Omit<Option, "type">) => void
} & Option

export type FieldProps = Omit<
  CmsField<HTMLInputElement, UploadFile[]>,
  "accept"
> & {
  type?: Upload["type"]
  isMultiple?: Upload["isMultiple"]
  value: UploadFile[]
  onUpdate: (newValue: UploadFile[]) => void
  accept: Upload["accept"]
}

const validationValidator = z
  .object({
    required: z.boolean().optional(),
    minItems: z.number().optional(),
    maxItems: z.number().optional(),
    size: z.number().optional(),
    // isMultiple
    // accept
  })
  .optional()
export type UploadFileFieldValidation = z.infer<typeof validationValidator>

const FieldValidation = FileValidation

const fieldConfig: CmsConfigField<
  UploadFile[],
  UploadFileFieldValidation,
  Option
> = {
  initialState: "",
  title: "File",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <FileText
      className={cn("h-3 text-muted-foreground", className)}
      {...props}
    />
  ),
  type: "file",
  description: "Add a file to a collection",
  validationDefaults: {
    required: false,
    size: 300,
  },
  validate: ({ value, validation, columnName }) => {
    const { required, size, minItems, maxItems } = validation || {}

    switch (true) {
      case isFieldRequired(value, required):
        return { value, error: `${columnName} field is required` }

      default:
        return { value, error: "" }
    }
  },
}

function Field({
  id,
  className,
  accept,
  fieldId,
  isInline,
  isMultiple = false,
  value = [],
  validate,
  errorMessage,
  onUpdate,
  type = "file",
}: FieldProps) {
  const [files, setFiles] = React.useState(value)
  const [isOpen, setIsOpen] = React.useState(false)

  return isInline ? (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex rounded-md border cursor-text",
              isInline && "rounded-none border-t-0",
              errorMessage && "flex items-center",
              className
            )}
          >
            <Input
              id={id}
              className={cn(
                "min-w-48 p-2 border-0 bg-transparent rounded-none focus:bg-accent",
                !isInline && "rounded-md"
              )}
              aria-describedby={id}
              defaultValue={files.map((f) => f.name)}
            />{" "}
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
          </div>
        </PopoverTrigger>

        <PopoverContent className={cn("w-full min-w-80")}>
          <UploadProvider
            type={type}
            isMultiple={isMultiple}
            files={files}
            accept={accept}
            setFiles={setFiles}
          >
            <UploadError />
            <UploadDropzone />
            <UploadAccepts />
            <UploadPreview id={id} />
          </UploadProvider>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  ) : (
    <UploadProvider
      type={type}
      isMultiple={isMultiple}
      files={files}
      accept={accept}
      setFiles={setFiles}
    >
      <UploadError />
      <UploadDropzone />
      <UploadAccepts />
      <UploadPreview id={fieldId} />
    </UploadProvider>
  )
}

export function FieldOptions({ value, fieldId, onUpdate }: FieldOptionsProps) {
  const items = value.items || []
  const isMultiple = value.isMultiple ? false : true
  const accept = value.accept || {}

  const handleOnUpdate =
    (key: "isMultiple" | "items" | "accept") =>
    (value: boolean | TagInputItem[]) => {
      onUpdate?.({
        items,
        isMultiple,
        [key]: value,
      })
    }

  return (
    <>
      <div className='flex flex-col'>
        <Label htmlFor={`${fieldId}-selectType`} className='mb-2'>
          Selection Type
        </Label>
        <ToggleSwitch
          title='Selection Type'
          className='w-[160px]'
          checked={isMultiple}
          id={`${fieldId}-selectType`}
          onOff={"Single,Multiple"}
          onCheckedChange={(bool) => handleOnUpdate("isMultiple")(!bool)}
        />
      </div>

      <div className='mb-6 grid gap-6'>
        <Label htmlFor='extensions' className='flex mb-2'>
          Accept Extensions
        </Label>

        <TagsInput>
          <TagList>
            {items.map(({ id, value }) => {
              return (
                <TagItem
                  key={id}
                  id={id}
                  value={value}
                  onRemoveItem={(id: string) =>
                    onUpdate?.({
                      items: items.filter((item) => item.id !== id),
                    })
                  }
                />
              )
            })}
          </TagList>

          <TagInput
            id='extensions'
            placeholder='Items...'
            selectedItems={items}
            onUpdate={handleOnUpdate("items")}
            inputProps={{ className: "rounded-l-md" }}
            buttonProps={{ className: "rounded-r-md" }}
          />
        </TagsInput>
      </div>
    </>
  )
}

export const UploadDocumentField = {
  fieldConfig,
  Field,
  FieldOptions,
  FieldValidation,
  validationValidator,
}

export default UploadDocumentField
