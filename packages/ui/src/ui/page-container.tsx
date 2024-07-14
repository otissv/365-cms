import { cn } from "../lib/utils"
import React from "react"

export interface PageContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const PageContainer = React.forwardRef<
  HTMLDivElement,
  PageContainerProps
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("m-8 bg-background", className)} ref={ref} {...props} />
  )
})
PageContainer.displayName = "PageContainer"
