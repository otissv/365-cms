"use client"

import React from "react"

import { Button, type ButtonProps } from "@repo/ui/button"
import { cn } from "@repo/ui/cn"

export interface CmsButtonProps extends ButtonProps {
  Icon?: (props: any) => React.ReactNode
  children: string
}

export const CmsButton = React.forwardRef<HTMLButtonElement, CmsButtonProps>(
  ({ className, Icon, children, ...props }, ref) => {
    let icon = null

    if (Icon) {
      icon = <Icon className='h-4 p-0' />
    }

    return (
      <Button
        variant='outline'
        className={cn(" inline-flex gap-1 rounded-md", className)}
        ref={ref}
        {...props}
      >
        {icon}
        <span className='whitespace-nowrap'>{children}</span>
      </Button>
    )
  }
)

export interface CmsToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CmsToolbar({
  className,
  children,
  ...props
}: CmsToolbarProps): React.JSX.Element {
  return (
    <div
      className={cn("flex flex-wrap gap-x-4 gap-y-2 max-w-[1440px]", className)}
      {...props}
    >
      {children}
    </div>
  )
}
