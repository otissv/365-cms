import React from "react"

import { Label } from "@repo/ui/label"
import { ToggleSwitch } from "@repo/ui/toggle-switch"
import { Input } from "@repo/ui/input"
import { TagItem, TagInput, TagsInput, TagList } from "@repo/ui/tags"
import type { AutocompleteCheckboxOption } from "@repo/ui/autocomplete-checkbox"

export type SelectItem = {
  id: string
  value: string
}

function getNumber(value: unknown) {
  const int = Number.parseInt(value as string, 10)
  return Number.isNaN(int) ? undefined : int
}

export function Required({
  checked,
  onChange,
}: {
  checked?: boolean
  onChange: (required: boolean) => void
}) {
  const handleOnCheckChange = (required: boolean) => {
    onChange?.(required)
  }

  return (
    <div className='grid items-center gap-2'>
      <Label htmlFor='requiredField'>Make this a require field?</Label>

      <ToggleSwitch
        title=' Make Column required'
        className='w-[160px]'
        checked={Boolean(checked)}
        id='requiredField'
        onOff={"Yes,No"}
        onCheckedChange={handleOnCheckChange}
      />
    </div>
  )
}

export type RequiredValidationValue = {
  required?: boolean
}

export function RequiredValidation({
  value,
  onUpdate,
}: {
  value: RequiredValidationValue
  onUpdate: (value: RequiredValidationValue) => void
}) {
  const handleOnRequiredChange = (required: boolean) => {
    onUpdate?.({
      required,
    })
  }

  return (
    <div className='mt-6'>
      <Required onChange={handleOnRequiredChange} checked={value.required} />
    </div>
  )
}

// export type FileValidationValue = { required?: boolean; size?: number }
// export function FileValidation({
//   value,
//   onChange,
// }: {
//   value: FileValidationValue
//   onChange: (value: FileValidationValue) => void
// }) {
//   const { required, size } = value || {}

//   const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onChange && onChange({ size: getNumber(e.target.value) })
//   }

//   const handleOnRequiredChange = (required: boolean) => {
//     onChange &&
//       onChange({
//         ...value,
//         required,
//       })
//   }

//   return (
//     <>
//       <Required checked={required} onChange={handleOnRequiredChange} />

//       <div className="mb-4">
//         <Label htmlFor="fieldId" className="text-sm">
//           Size in kb
//         </Label>
//         <Input
//           type="number"
//           id="fieldId"
//           value={size}
//           className="w-16"
//           onChange={handleOnChange}
//         />
//       </div>
//     </>
//   )
// }

export type FileValidationValue = {
  minItems?: number
  maxItems?: number
  required?: boolean
  size?: number
  accept?: string[]
}
export function FileValidation({
  value,
  onUpdate,
}: {
  value: FileValidationValue
  onUpdate: (value: FileValidationValue) => void
}) {
  const minItems = value.minItems || 1
  const maxItems = value.maxItems || 1
  const size = value.size || 300
  const required = value.required || false
  const accept = value.accept || []

  const handleOnUpdate =
    (key: "minItems" | "maxItems" | "size" | "accept" | "required") =>
    (value: unknown) => {
      onUpdate?.({
        minItems,
        maxItems,
        size,
        accept,
        required,
        [key]: value,
      })
    }

  const handleOnChange =
    (key: "minItems" | "maxItems" | "size") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleOnUpdate(key)(getNumber(e.target.value))
    }

  const handleOnRequiredChange = (required: boolean) => {
    handleOnUpdate("required")(required)
  }

  const handleOnAcceptUpdate = (items: AutocompleteCheckboxOption[]) => {
    const accept = items.map(({ value }) =>
      /^\.[a-z]+$/.test(value) ? value : `.${value}`
    )
    handleOnUpdate("accept")(accept)
  }

  return (
    <div className='grid gap-4 mt-6'>
      <Required checked={required} onChange={handleOnRequiredChange} />

      <div>
        <Label htmlFor='fieldId' className='text-sm'>
          File Size in kb
        </Label>
        <Input
          type='number'
          id='fieldId'
          value={size}
          className='w-32'
          onChange={handleOnChange("size")}
        />
      </div>

      <div className='grid grid-cols-2 gap-4 w-80'>
        <div>
          <Label htmlFor='fieldName' className='text-sm'>
            Min Number of Items
          </Label>
          <Input
            type='number'
            value={minItems}
            className='w-20'
            onChange={handleOnChange("minItems")}
          />
        </div>
        <div>
          <Label htmlFor='fieldId' className='text-sm'>
            Max Number of Items
          </Label>
          <Input
            type='number'
            value={maxItems}
            className='w-20'
            onChange={handleOnChange("maxItems")}
          />
        </div>
      </div>

      <div className='mb-6 grid gap-6'>
        <Label htmlFor='extensions' className='flex'>
          Accept Extensions
        </Label>

        <TagsInput>
          <TagList>
            {accept.map((value) => {
              return (
                <TagItem
                  key={value}
                  id={value}
                  value={value}
                  onRemoveItem={(id: string) => {
                    handleOnUpdate("accept")(
                      accept?.filter((ext) => ext !== id)
                    )
                  }}
                />
              )
            })}
          </TagList>

          <TagInput
            id='extensions'
            placeholder='Items...'
            selectedItems={(accept || []).map((value) => ({
              id: value,
              value,
            }))}
            onUpdate={handleOnAcceptUpdate}
            inputProps={{ className: "rounded-l-md" }}
            buttonProps={{ className: "rounded-r-md" }}
          />
        </TagsInput>
      </div>
    </div>
  )
}

export type NumberValidationValue = {
  required?: boolean
  min?: number
  max?: number
}
export function NumberValidation({
  value,
  onUpdate,
}: {
  value: NumberValidationValue
  onUpdate: (value: NumberValidationValue) => void
}) {
  const { min, max, required } = value

  const handleOnChange =
    (field: "min" | "max") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const update = value || {}

      if (field === "min") {
        update.min = getNumber(e.target.value)
      } else if (field === "max") {
        update.max = getNumber(e.target.value)
      }

      onUpdate?.(update)
    }

  const handleOnRequiredChange = (required: boolean) => {
    onUpdate?.({
      ...value,
      required,
    })
  }

  return (
    <div className='space-y-6  mt-6'>
      <Required checked={required} onChange={handleOnRequiredChange} />

      <div className='grid grid-cols-2 gap-4 w-40'>
        <div>
          <Label htmlFor='fieldName' className='text-sm'>
            Min Number
          </Label>
          <Input
            type='number'
            id='fieldName'
            value={min}
            className='w-16'
            onChange={handleOnChange("min")}
          />
        </div>
        <div>
          <Label htmlFor='fieldId' className='text-sm'>
            Max Number
          </Label>
          <Input
            type='number'
            id='fieldId'
            value={max}
            className='w-16'
            onChange={handleOnChange("max")}
          />
        </div>
      </div>
    </div>
  )
}

export type TextValidationValue = {
  required?: boolean
  disallowCharacters?: string
  minLength?: number
  maxLength?: number
}
export function TextValidation({
  value = {},
  onUpdate,
}: {
  value: TextValidationValue
  onUpdate: (value: TextValidationValue) => void
}) {
  const handleOnChange =
    (field: "minLength" | "maxLength" | "disallowCharacters") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const update = { ...value } || {}

      if (field === "disallowCharacters") {
        update.disallowCharacters = e.target.value
      } else if (field === "minLength") {
        update.minLength = getNumber(e.target.value)
      } else if (field === "maxLength") {
        update.maxLength = getNumber(e.target.value)
      }
      onUpdate?.(update)
    }

  const handleOnRequiredChange = (required: boolean) => {
    onUpdate?.({
      ...value,
      required,
    })
  }

  return (
    <div className='space-y-6  mt-6'>
      <Required checked={value.required} onChange={handleOnRequiredChange} />

      <div className='space-y-6'>
        <div className='space-y-2'>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <Label htmlFor='minLength' className='text-sm'>
                <span className='whitespace-nowrap'>Min Length</span>
              </Label>
              <Input
                type='number'
                id='minLength'
                value={value.minLength || 0}
                onChange={handleOnChange("minLength")}
                min={0}
              />
            </div>
            <div>
              <Label htmlFor='maxLength' className='text-sm'>
                <span className='whitespace-nowrap'>Max Length</span>
              </Label>
              <Input
                type='number'
                id='maxLength'
                value={value.maxLength || 0}
                onChange={handleOnChange("maxLength")}
                min={0}
              />
            </div>
          </div>

          <p className='text-sm text-muted-foreground'>
            Number of characters. Set max length to 0 for any length.
          </p>
        </div>
        <div>
          <Label htmlFor='disallowCharacters' className='text-sm'>
            <span className='whitespace-nowrap'>Disallow characters</span>
          </Label>
          <Input
            id='disallowCharacters'
            value={value.disallowCharacters || ""}
            onChange={handleOnChange("disallowCharacters")}
          />
          <p className='text-sm text-muted-foreground'>E.g. %?&*</p>
        </div>
      </div>
    </div>
  )
}

export type InternetValidationValue = {
  required?: boolean
  disallowCharacters: string
  blacklist: string[]
}
export function InternetValidation({
  value,
  onUpdate,
}: {
  value: InternetValidationValue
  onUpdate: (value: InternetValidationValue) => void
}) {
  const [blacklist, setBlacklist] = React.useState<SelectItem[]>(
    (value.blacklist || []).map((url) => ({
      id: url,
      value: url,
    })) || []
  )

  const handleOnUpdate =
    (key: "disallowCharacters") => (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate?.({
        ...value,
        [key]: e.target.value,
      })
    }

  const handleOnRequiredChange = (required: boolean) => {
    onUpdate?.({
      ...value,
      required,
    })
  }

  const handleOnItemsUpdate = (blacklist: SelectItem[]) => {
    setBlacklist(blacklist)
    onUpdate?.({
      ...value,
      blacklist: blacklist.map(({ value }) => value),
    })
  }

  const tagItems = blacklist.map(({ id, value }) => {
    return (
      <TagItem
        key={id}
        id={id}
        value={value}
        onRemoveItem={(id: string) =>
          setBlacklist(blacklist.filter((item) => item.id !== id))
        }
      />
    )
  })

  return (
    <div className='space-y-6  mt-6'>
      <Required
        checked={Boolean(value?.required)}
        onChange={handleOnRequiredChange}
      />

      <div>
        <Label htmlFor='disallowCharacters' className='text-sm'>
          <span className='whitespace-nowrap'>Disallow characters</span>
        </Label>
        <Input
          id='disallowCharacters'
          value={value?.disallowCharacters || ""}
          onChange={handleOnUpdate("disallowCharacters")}
        />
        <p className='text-sm text-muted-foreground'>E.g. %?&*</p>
      </div>

      <div>
        <Label htmlFor='blacklist' className='text-sm'>
          <span className='whitespace-nowrap'>Blacklist</span>
        </Label>
        <TagsInput>
          <TagInput
            id='blacklist'
            // placeholder="Items..."
            selectedItems={blacklist}
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
    </div>
  )
}
