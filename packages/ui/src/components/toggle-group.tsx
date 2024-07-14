"use client"

import React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@ui/lib/utils"
import { buttonVariants } from "@ui/ui/button"

export type ToggleGroupProps = {
  label: string
} & React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>

/**
* @example
* <ToggleGroup type='single' defaultValue={mode} label='Text Alignment'>
    <ToggleGroupItem
      className='w-10 p-0'
      label='Move'
      value='move'
      disabled={!selectedPage}
      onClick={handleOnLayoutModeClick('move')}
    >
      <Move />
    </ToggleGroupItem>
    <ToggleGroupItem
      className='w-10 p-0'
      label='Zoom'
      value='zoom'
      disabled={!selectedPage}
      onClick={handleOnLayoutModeClick('zoom')}
    >
      <LucideZoomIn />
    </ToggleGroupItem>
    <ToggleGroupItem
      className='w-10 p-0'
      label='Edit'
      value='edit'
      disabled={!selectedPage}
      onClick={handleOnLayoutModeClick('edit')}
    >
      <EditIcon />
    </ToggleGroupItem>
  </ToggleGroup>

  
**/
export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(
  (
    {
      className,
      children,
      label,
      type,
      orientation,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [currentValue, setCurrentValue] = React.useState(value)

    React.useEffect(() => {
      setCurrentValue(value)
    }, [value])

    return (
      //@ts-expect-error value and defaultValue for undefined
      <ToggleGroupPrimitive.Root
        ref={ref}
        aria-label={label}
        type={type as "single"}
        value={currentValue}
        className={cn(
          "inline-flex p-[1px] bg-muted text-muted rounded-md justify-center items-center",
          className
        )}
        orientation={orientation}
        onValueChange={(value: string) => setCurrentValue(value)}
        defaultValue={defaultValue}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Root>
    )
  }
)
ToggleGroup.displayName = "ToggleGroup"

export type ToggleGroupItemProps = {
  label: string
  variant?: string
  size?: "default" | "sm" | "lg" | "icon"
} & React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.ToggleGroupItem>

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.ToggleGroupItem>,
  ToggleGroupItemProps
>(({ label, className, variant, children, ...props }, ref) => {
  return (
    <ToggleGroupPrimitive.ToggleGroupItem
      className={cn(
        buttonVariants({ variant: variant || "ghost" }, {}),
        "flex h-10 min-w-10 text-muted-foreground items-center justify-center",
        "data-[state=on]:shadow-sm data-[state=on]:text-foreground data-[state=on]:bg-background rounded-sm",
        "hover:text-accent-foreground hover:bg-accent transition-colors",
        className
      )}
      aria-label={label}
      title={label}
      ref={ref}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.ToggleGroupItem>
  )
})
ToggleGroupItem.displayName = "ToggleGroupItem"
