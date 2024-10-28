"use client"

import React from "react"
import { FileType, TriangleAlert } from "lucide-react"
import {
  Plate,
  type PlateEditor,
  type PlateProps,
  type Value,
} from "@udecode/plate-common"
import { useDebouncedCallback } from "use-debounce"
import { z } from "zod"

import { cn } from "@repo/ui/cn"
import { Input } from "@repo/ui/input"
import type { CmsConfigField, CmsField } from "@repo/cms/types.cms"
import { Label } from "@repo/ui/label"
import { plugins } from "@repo/plate-ui/plugins"
import { Editor } from "@repo/plate-ui/editor"
import { FixedToolbar } from "@repo/plate-ui/fixed-toolbar"
import { FixedToolbarButtons } from "@repo/plate-ui/fixed-toolbar-buttons"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"
import { isFieldRequired } from "@repo/lib/isFieldRequired"

import { RequiredValidation } from "../validation.cms"

type Option = {
  value: { defaultValue?: Record<string, any>[] }
}

export type FieldOptionsProps = {
  fieldId: string
  onUpdate: (newValue: unknown, errorMessage?: "string") => void
} & Option

export type FieldProps = CmsField<HTMLInputElement, Value> & {
  id: string
  value: Value
}

const validationValidator = z
  .object({
    required: z.boolean().optional(),
  })
  .optional()
export type RichTextFieldValidation = z.infer<typeof validationValidator>

const FieldValidation = RequiredValidation

const fieldConfig: CmsConfigField<Value, RichTextFieldValidation, Option> = {
  initialState: [
    {
      type: "p",
      children: [
        {
          text: "This is editable plain text with react and history plugins, just like a <textarea>!",
        },
      ],
    },
  ],
  title: "Richtext",
  Icon: ({ className, ...props }: Record<string, any>) => (
    <FileType
      className={cn("h-4 text-muted-foreground", className)}
      {...props}
    />
  ),
  type: "richtext",
  description: "Text with formatting",
  validationDefaults: {
    required: false,
  },
  validate: ({ value, validation, columnName }) => {
    const { required } = validation || {}

    switch (true) {
      case isFieldRequired(value, required):
        return {
          value,
          error: `${columnName} field is required`,
        }

      default:
        return {
          value,
          error: "",
        }
    }
  },
}

function EditorField({
  initialValue,
  onChange,
}: {
  initialValue: Value
  onChange: PlateProps<Value, PlateEditor<Value>>["onChange"]
}) {
  return (
    <div>
      <Plate plugins={plugins} initialValue={initialValue} onChange={onChange}>
        <FixedToolbar className='rounded-b-none  py-1'>
          <FixedToolbarButtons hasInsert hasEdit />
        </FixedToolbar>
        <Editor
          className='rounded-t-none'
          placeholder='Type...'
          onBlur={console.log}
        />
      </Plate>
    </div>
  )
}

function Field({
  id,
  value,
  onBlur,
  className,
  fieldId,
  isInline,
  type,
  onUpdate,
  validate,
  validation,
  columnName,
  errorMessage,
}: FieldProps): JSX.Element {
  const [state, setState] = React.useState<Value>(value)
  const [isOpened, setIsOpened] = React.useState(false)
  const [isDirty, setIsDirty] = React.useState(false)

  const debounced = useDebouncedCallback((value) => setState(value), 1000)

  const handleOnChange = (newValue: Value) => {
    debounced(() => newValue)
    setIsDirty(true)
  }

  React.useEffect(() => {
    if (isDirty && !isOpened) {
      onUpdate(state, "")
      setIsDirty(false)
    }
  }, [isOpened])

  return isInline ? (
    <TooltipProvider>
      <Popover onOpenChange={setIsOpened}>
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
              defaultValue={state?.[0].children?.[0]?.text}
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

        <style>{`.richContent { left: calc(50vw - (1080px/2)); }`}</style>

        <PopoverContent className={cn("w-full p-0 min-w-80")}>
          <EditorField initialValue={state} onChange={handleOnChange} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  ) : (
    <EditorField initialValue={state} onChange={handleOnChange} />
  )
}

function FieldOptions({
  value = {},
  onUpdate,
  fieldId,
}: FieldOptionsProps): JSX.Element {
  const defaultValue = value.defaultValue || [
    {
      type: "p",
      children: [
        {
          text: "",
        },
      ],
    },
  ]

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
      Toolbar
    </div>
  )
}

const RichtextField = {
  fieldConfig,
  Field,
  FieldOptions,
  FieldValidation,
}

export default RichtextField
