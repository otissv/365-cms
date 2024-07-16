"use client"

import type * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, Plus, X } from "lucide-react"
import React from "react"

import { isEmpty } from "@repo/lib/isEmpty"

import { cn } from "../lib/utils"
import { Badge, type BadgeProps } from "../ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

import { Button, type ButtonProps } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

export type TagInputItem = {
  id: string
  value: string
}

export type TagSelectSelected = {
  selectedItems: TagInputItem[]
  items: TagInputItem[]
}

export type TagsType = "single" | "multiple"

export const TagsContext = React.createContext<TagsType>("single")

export function useTags() {
  return React.useContext(TagsContext)
}

export interface TagsInputProps
  extends React.InputHTMLAttributes<HTMLDivElement> {
  type?: TagsType
}
export function TagsInput({
  children,
  type = "single",
  className,
  ...props
}: TagsInputProps) {
  return (
    <TagsContext.Provider value={type}>
      <div {...props} className={cn("space-y-2 here", className)}>
        {children}
      </div>
    </TagsContext.Provider>
  )
}
TagsInput.displayName = "TagsInput"

export interface TagItemProps extends BadgeProps {
  id: string
  value: string
  onRemoveItem: (id: string) => void
}
export function TagItem({
  className,
  id,
  value,
  onRemoveItem,
  ...props
}: TagItemProps) {
  const handleOnRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    onRemoveItem?.(e.currentTarget.id)
  }

  return (
    <Badge
      {...props}
      aria-labelledby={`tag-input-item=${id}`}
      aria-current='false'
      className={cn(
        "bg-accent text-foreground text-base rounded-md px-2 py-1 h-10 self-center",
        className
      )}
      variant='outline'
    >
      <span className='whitespace-nowrap'>{value}</span>
      <button type='button' id={id} onClick={handleOnRemove}>
        <X className='h-4 w-4 ml-2' />
      </button>
    </Badge>
  )
}
TagItem.displayName = "TagItem"

export type TagListProps = React.HTMLAttributes<HTMLDivElement>
export function TagList({ children, className }: TagListProps) {
  return (
    <div
      className={cn(
        "relative flex flex-wrap gap-2 min-h-10  rounded-md px-1",
        className
      )}
    >
      {children}
    </div>
  )
}
TagList.displayName = "TagList"

export interface TagInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value"> {
  value?: string
  onUpdate: (items: TagInputItem[]) => void
  selectedItems?: TagInputItem[]
  inputProps?: React.HTMLAttributes<HTMLInputElement>
  buttonProps?: Omit<React.HTMLAttributes<HTMLButtonElement>, "onClick">
  placeholder?: string
}
export const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      className,
      value: initialValue = "",
      onUpdate,
      placeholder,
      selectedItems = [],
      id,
      inputProps,
      buttonProps,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState(initialValue)

    const updateValue = () => {
      const exitingItem = selectedItems?.find((f) => f.id === value)

      if (onUpdate && !exitingItem && value.trim() !== "") {
        onUpdate([...selectedItems, { id: value, value }])
      }
      setValue("")
    }

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        updateValue()
      }
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    }

    return (
      <div
        className={cn("flex items-center ml-auto", className)}
        ref={ref}
        {...props}
      >
        <input
          id={id}
          aria-labelledby={id}
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          onChange={handleOnChange}
          {...inputProps}
          className={cn(
            "min-w-16 max-w-48 h-10 px-2 border border-r-0 bg-transparent focus:outline-none focus:bg-accent",
            inputProps?.className
          )}
          value={value}
          onKeyDown={handleOnKeyDown}
          type='text'
          placeholder={placeholder}
        />

        <Button
          {...buttonProps}
          className={cn("border border-l-0 ", buttonProps?.className)}
          title={buttonProps?.title || "Add item"}
          onClick={() => updateValue()}
        >
          <Plus className='h-4 w-4 mr-1' /> Add
        </Button>
      </div>
    )
  }
)
TagInput.displayName = "TagInput"

export const TagSelectGroup = SelectGroup
export const TagSelectLabel = SelectLabel
export const TagSelectValue = SelectValue

export interface TagSelectProps extends SelectPrimitive.SelectProps {
  className?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  type?: TagsType
}
export function TagSelect({
  className,
  children,
  open,
  type = "single",
  onOpenChange,
  ...props
}: TagSelectProps) {
  return (
    <TagsContext.Provider value={type}>
      <div className={cn("relative flex ml-auto", className)} {...props}>
        <Select open={open} onOpenChange={onOpenChange}>
          {children}
        </Select>
      </div>
    </TagsContext.Provider>
  )
}
TagSelect.displayName = "TagSelect"

export interface TagSelectTriggerProps
  extends Omit<React.RefAttributes<HTMLButtonElement>, "ref" | "type">,
    Omit<SelectPrimitive.SelectTriggerProps, "ref" | "type"> {
  selectedItems?: TagInputItem[]
  type?: TagsType
  placeholder?: string
}
export function TagSelectTrigger({
  className,
  children,
  placeholder,
  selectedItems = [],
  type,
  ...props
}: TagSelectTriggerProps) {
  return (
    <SelectTrigger asChild>
      <Button
        {...props}
        aria-multiselectable={type === "multiple"}
        variant='ghost'
        className={cn(
          "flex gap-2 h-10 py-0 border-0 text-base",
          !isEmpty(selectedItems) && "w-10 ml-auto",
          className
        )}
      >
        {children ? (
          <>children</>
        ) : (
          <>
            {isEmpty(selectedItems) ? <>{placeholder}</> : null}
            <ChevronDown className='h-4 w-4 ml-auto' />
          </>
        )}
      </Button>
    </SelectTrigger>
  )
}
TagSelectTrigger.displayName = "TagSelectTrigger"

export interface TagSelectContentProps
  extends Omit<
    SelectPrimitive.SelectContentProps & React.RefAttributes<HTMLDivElement>,
    "ref"
  > {}
export function TagSelectContent({
  className,
  children,
  ...props
}: TagSelectContentProps) {
  return (
    <SelectContent className={cn("relative p-0", className)} {...props}>
      {children}
    </SelectContent>
  )
}
TagSelectContent.displayName = "TagSelectContent"

export interface TagSelectItemProps extends Omit<ButtonProps, "ref" | "type"> {
  type?: TagsType
  isSelected?: boolean
}
export function TagSelectItem({
  type = "single",
  id,
  onSelect,
  value,
  isSelected,
  onClick,
  checkProps,
  ...props
}: TagSelectItemProps) {
  const contextType = useTags()

  return (
    <Button
      {...props}
      aria-checked={Boolean(value)}
      role='checkbox'
      variant='ghost'
      className='flex items-center gap-4 w-full justify-start pr-12'
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onSelect({ id, value })
        onClick?.(e)
      }}
    >
      <Check
        {...checkProps}
        className={cn(
          "h-6 w-6 inline-fle",

          (type === "multiple" || contextType === "multiple") &&
            "border rounded-md p-1 border-white hover:border-accent-foreground",
          !isSelected && "text-transparent",
          checkProps?.className
        )}
      />
      <span className='whitespace-nowrap'>{value}</span>
    </Button>
  )
}
TagSelectItem.displayName = "TagSelectItem"

export interface TagSelectOptionsProps
  extends Omit<React.HtmlHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  items?: TagInputItem[]
  selectedItems?: TagInputItem[]
  type?: TagsType
  value?: string[]
  onSelect: (
    nextSelectedItems: TagInputItem[],
    previousSelectedItems: TagInputItem[]
  ) => void
}
export function TagSelectOptions({
  items = [],
  selectedItems = [],
  type = "multiple",
  onSelect,
}: TagSelectOptionsProps) {
  const contextType = useTags()

  const isMultiSelect = type === "multiple" || contextType === "multiple"

  const handleOnSelect = (item: TagInputItem) => {
    const exitingItem = selectedItems?.find((f) => f.id === item.id)
    const hasItem = Boolean(exitingItem && onSelect)

    switch (true) {
      case isMultiSelect && hasItem:
        return onSelect?.(
          selectedItems.filter((f) => f.id !== exitingItem?.id),
          selectedItems
        )
      case isMultiSelect: {
        return onSelect([...selectedItems, item], selectedItems)
      }
      case !isMultiSelect && hasItem: {
        return onSelect?.([], selectedItems)
      }
      case !isMultiSelect: {
        return onSelect?.([item], selectedItems)
      }
    }
  }

  return items.length > 0 ? (
    <div>
      {items.map(({ id, value }) => {
        const isSelected = !!selectedItems?.find((item) => {
          return item?.id === id
        })

        return (
          <TagSelectItem
            type={type}
            key={id}
            id={id}
            value={value}
            isSelected={isSelected}
            onSelect={handleOnSelect}
          />
        )
      })}
    </div>
  ) : (
    <div className='grid gap-1'>
      <Skeleton className='h-8' />
      <Skeleton className='h-8' />
      <Skeleton className='h-8' />
    </div>
  )
}
TagSelectOptions.displayName = "TagSelectOptions"
