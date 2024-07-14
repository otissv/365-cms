"use client"

import type React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@ui/lib/utils"
import { Button } from "@ui/ui/button"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@ui/ui/popover"

export type ComboboxOption = {
  label: string
  value: string
}

export interface ComboboxProps extends React.HTMLAttributes<HTMLElement> {
  value: string
  options: ComboboxOption[]
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  placeholder?: string
}

export const ComboboxInput = CommandInput
export const ComboboxEmpty = CommandEmpty
export const ComboboxGroup = CommandGroup
export const ComboboxList = CommandList

export function Combobox({
  children,
  value = "",
  options = [],
  isOpen,
  setIsOpen,
  placeholder,
  className,
  ...props
}: ComboboxProps) {
  return (
    <Popover {...props} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={isOpen}
          className={cn("w-[200px] justify-between", className)}
          onClick={() => setIsOpen?.(!isOpen)}
        >
          {value
            ? (options || []).find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      {children}
    </Popover>
  )
}

export interface ComboboxContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  empty?: string
  placeholder?: string
}

export function ComboboxContent({
  className,
  children,
  placeholder,
  empty = "Not Found.",
  ...props
}: ComboboxContentProps) {
  return (
    <PopoverContent className={cn("w-[200px] p-0", className)} {...props}>
      <Command>{children}</Command>
    </PopoverContent>
  )
}

export interface ComboboxItemListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value?: string
  options: ComboboxOption[]
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  onSelect?: (value: string) => void
}

export function ComboboxItemList({
  value = "",
  options = [],
  onSelect,
  setIsOpen,
}: ComboboxItemListProps) {
  return (
    <ComboboxList>
      {options.map((item) => (
        <CommandItem
          key={item.value}
          value={item.value}
          onSelect={(currentValue) => {
            onSelect?.(currentValue === value ? "" : currentValue)
            setIsOpen?.(false)
          }}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              value === item.value ? "opacity-100" : "opacity-0"
            )}
          />
          {item.label}
        </CommandItem>
      ))}
    </ComboboxList>
  )
}
