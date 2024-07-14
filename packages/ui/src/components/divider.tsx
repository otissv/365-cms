import * as React from "react"

import { cn } from "@ui/lib/utils"

export interface FieldsetProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Divider = React.forwardRef<HTMLDivElement, FieldsetProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        role='separator'
        aria-orientation='horizontal'
        className={cn("-mx-1 my-6 h-px bg-muted", className)}
        ref={ref}
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={0}
        aria-valuenow={0}
        aria-valuetext='Separator'
        {...props}
      />
    )
  }
)
Divider.displayName = "Divider"
