"use client"

import React from "react"
import { z } from "zod"
import { Image, TriangleAlert } from "lucide-react"

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
import { isFieldRequired } from "@repo/lib/isFieldRequired"
import {
  UploadProvider,
  UploadDropzone,
  UploadError,
  UploadAccepts,
  UploadPreview,
  type UploadFile,
} from "./upload"
import { useDocument } from "../document-provider"
import { formatBytes } from "@repo/lib/formatBytes"

import { FileValidation } from "../validation.cms"

type Option = {
  value: {
    defaultValue?: UploadFile[]
  }
}

export type FieldOptionsProps = {
  fieldId: string
  onUpdate: (newValue: unknown, errorMessage?: "string") => void
} & Option

export type FieldProps = Omit<
  CmsField<HTMLInputElement, UploadFile[]>,
  "accept"
> & {
  type?: "image"
}

const validationValidator = z
  .object({
    required: z.boolean().optional(),
    minItems: z.number().optional(),
    maxItems: z.number().optional(),
    size: z.number().optional(),
    accept: z.array(z.string()).optional(),
  })
  .optional()
export type UploadFileFieldValidation = z.infer<typeof validationValidator>

const FieldValidation = FileValidation

const fieldConfig: CmsConfigField<
  UploadFile[],
  UploadFileFieldValidation,
  Option["value"]
> = {
  initialState: "",
  title: "Image",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <Image className={cn("h-3 text-muted-foreground", className)} {...props} />
  ),
  type: "upload",
  description: "Upload images",
  validationDefaults: {
    size: 1000,
    maxItems: 1,
    accept: [".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp"],
  },
  validate: ({ values, validation, columnName }) => {
    const required = validation?.required || false
    const minItems = validation?.minItems || 1
    const maxItems = validation?.maxItems || 1
    const size = validation?.size || 1000
    const accept = validation?.accept || []

    const files: {
      value: UploadFile[]
      error: string
    } = {
      value: [],
      error: "",
    }

    for (const file of values) {
      if (isFieldRequired(values, required)) {
        files.value.push(file)
        files.error = `${columnName} field is required`
        continue
      }

      if (!(accept || []).includes(file.ext)) {
        files.value.push(file)
        files.error = "Invalid file type"

        continue
      }

      if (file.size > size) {
        files.value.push(file)
        files.error = `File size should not be bigger than ${formatBytes(size as number)}`
        continue
      }

      if (values.length < minItems || values.length > maxItems) {
        files.value.push(file)
        files.error = `Can only upload between ${minItems} and ${maxItems} images`
        continue
      }

      files.value.push(file)
      files.error = ""
    }

    return files
  },
}

function Field({
  id,
  collectionId,
  className,
  fieldId,
  isInline,
  value = [],
  validate,
  errorMessage,
  onUpdate,
  options,
  validation,
  columnName,
}: FieldProps) {
  const [files, setFiles] = React.useState(value)
  const [isOpen, setIsOpen] = React.useState(false)

  const { state } = useDocument()
  const column = state.columns.get<"fieldId">(fieldId as any)

  const { accept, maxItems } = {
    ...fieldConfig.validationDefaults,
    ...column?.validation,
  }

  const isMultiple = maxItems ? maxItems > 1 : false

  const handleOnUpdate = (value: UploadFile[]) => {
    const results = validate?.(value, validation, columnName)

    const formData = new FormData()
    results?.value.forEach((file, index) => {
      formData.append(
        `file:meta:${file.name}:${index}`,
        JSON.stringify({
          ext: file.ext,
          description: file.description,
        })
      )
      formData.append(`file:${file.name}:${index}`, file)
    })

    onUpdate?.(formData)

    // if (error) {
    //   toast(error)
    //   return
    // }
    // setFiles(value)
  }

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
              value={files.map((f) => f.name)}
              onClick={() => setIsOpen(!isOpen)}
              onChange={() => {}}
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
            onChange={handleOnUpdate}
            id={`${collectionId}:${fieldId}`}
            type='image'
            accept={{
              "image/*": accept || [
                ".gif",
                ".jpg",
                ".jpeg",
                ".png",
                ".svg",
                ".webp",
              ],
            }}
            isMultiple={isMultiple}
            files={files}
          >
            <UploadError />
            <UploadDropzone />
            <UploadAccepts />
            <UploadPreview />
          </UploadProvider>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  ) : (
    <UploadProvider
      id={`${collectionId}:${fieldId}`}
      type='image'
      accept={{
        "image/*": accept || [".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp"],
      }}
      isMultiple={isMultiple}
      files={files}
      onChange={handleOnUpdate}
    >
      <UploadError />
      <UploadDropzone />
      <UploadAccepts />
      <UploadPreview />
    </UploadProvider>
  )
}

export function FieldOptions({ value, fieldId, onUpdate }: FieldOptionsProps) {
  const defaultValue: FieldOptionsProps["value"]["defaultValue"] =
    value.defaultValue || []

  const handleOnUpdate = (value: unknown) => {
    onUpdate?.({
      defaultValue: value,
    })
  }

  return (
    <>
      <div className='mb-6'>
        <Label htmlFor='defaultValue' className='flex mb-2'>
          Default Value
        </Label>
        <Field
          id='defaultValue'
          type='image'
          value={defaultValue}
          onUpdate={handleOnUpdate}
          fieldId={fieldId}
        />
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
