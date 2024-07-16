"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

type PageToolbarButtonDefaultTypes = {
  back:
    | string
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  edit: React.ReactNode
  new: React.ReactNode
  save: React.ReactNode
}

type PageToolbarButton = keyof PageToolbarButtonDefaultTypes | React.ReactNode

export interface PageToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const PageToolbar = React.forwardRef<HTMLDivElement, PageToolbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("flex w-full items-center mb-6", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
PageToolbar.displayName = "PageToolbar"

interface PageToolbarStartProps extends React.HTMLAttributes<HTMLDivElement> {
  buttons?: PageToolbarButton[]
  onSave?: (event: React.MouseEvent) => void
}

export const PageToolbarStart = React.forwardRef<
  HTMLDivElement,
  PageToolbarStartProps
>((props, ref) => {
  return <div ref={ref} {...props} />
})
PageToolbarStart.displayName = "PageToolbarStart"

export const PageToolbarCenter = React.forwardRef<
  HTMLDivElement,
  PageToolbarStartProps
>(({ className, ...props }, ref) => {
  return <div className={cn("mx-auto", className)} ref={ref} {...props} />
})
PageToolbarCenter.displayName = "PageToolbarCenter"

export const PageToolbarEnd = React.forwardRef<
  HTMLDivElement,
  PageToolbarStartProps
>(({ className, ...props }, ref) => {
  return <div className={cn("ml-auto", className)} ref={ref} {...props} />
})
PageToolbarEnd.displayName = "PageToolbarEnd"
