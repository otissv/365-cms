"use client"

import type * as React from "react"
import { Checkbox } from "@ui/ui/checkbox"
import { Input } from "@ui/ui/input"
import { cn } from "@ui/lib/utils"
import { Label } from "@ui/ui/label"

export interface AutocompleteCheckboxOption {
  id: string
  value: string
}

export function handleAutocompleteCheckboxOnSelect({
  options,
  selectedValues,
  onSelect,
}: {
  options: AutocompleteCheckboxOption[]
  selectedValues: AutocompleteCheckboxOption[]
  onSelect: (selectedValues: AutocompleteCheckboxOption[]) => void
}) {
  return (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedValue = selectedValues.find((item) => item.id === id)

    const newSelectedValues = selectedValue
      ? selectedValues.filter((item) => item.id !== id)
      : [...selectedValues, options.find((item) => item.id === id)]

    onSelect?.(newSelectedValues as AutocompleteCheckboxOption[])
  }
}

export interface AutocompleteCheckboxProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AutocompleteCheckbox(props: AutocompleteCheckboxProps) {
  return (
    <div
      role='group'
      aria-labelledby='checkbox-group'
      className='border rounded-md p-4'
      {...props}
    />
  )
}
AutocompleteCheckbox.displayName = "AutocompleteCheckbox"

export interface AutocompleteCheckboxInputProps
  extends React.HTMLAttributes<HTMLInputElement> {
  filter: string
  setFilter: React.Dispatch<React.SetStateAction<string>>
}

export function AutocompleteCheckboxInput({
  className,
  filter,
  setFilter,
  ...props
}: AutocompleteCheckboxInputProps) {
  return (
    <Input
      aria-label='Filter options'
      {...props}
      value={filter}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setFilter(e.target.value)
      }
      className={cn("mb-4 p-1", className)}
    />
  )
}
AutocompleteCheckboxInput.displayName = "AutocompleteCheckboxInput"

export interface AutocompleteCheckboxContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AutocompleteCheckboxContent({
  className,
  ...props
}: AutocompleteCheckboxContentProps) {
  return (
    <div
      role='list'
      {...props}
      className={cn("flex flex-col gap-1", className)}
    />
  )
}

export function AutocompleteCheckboxList({
  filter = "",
  options,
  selectedValues,
  onSelect,
}: {
  filter?: string
  options: AutocompleteCheckboxOption[]
  selectedValues: AutocompleteCheckboxOption[]
  onSelect: (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  const filteredOptions = options.filter((option) =>
    option.value.toLowerCase().includes(filter.toLowerCase())
  )
  const findSelectedValue = (id: string) =>
    selectedValues.find((item) => item.id === id)

  return filteredOptions.length > 0 ? (
    filteredOptions.map(({ id, value }) => (
      <AutocompleteCheckboxListItem
        key={id}
        id={id}
        value={value}
        isSelected={Boolean(findSelectedValue(id))}
        onSelect={onSelect}
        checked={Boolean(findSelectedValue(id))}
      />
    ))
  ) : (
    <div role='alert' className='p-2 text-muted-foreground'>
      No results found.
    </div>
  )
}
AutocompleteCheckboxList.displayName = "AutocompleteCheckboxList"

export interface AutocompleteCheckboxListItemProps {
  id: string
  value: string
  checked: boolean
  isSelected?: boolean
  onSelect: (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function AutocompleteCheckboxListItem({
  id,
  value,
  isSelected = false,
  onSelect,
  checked = false,
}: AutocompleteCheckboxListItemProps) {
  return (
    <Label
      htmlFor={id}
      aria-checked={checked}
      role='checkbox'
      className={cn(
        "flex items-center gap-2 cursor-pointer p-2 rounded-md h-10",
        isSelected && "bg-accent"
      )}
    >
      <Checkbox id={id} checked={checked} onClick={onSelect(id)} />
      <span className='whitespace-nowrap'>{value}</span>
    </Label>
  )
}
AutocompleteCheckboxListItem.displayName = "AutocompleteCheckboxListItem"
