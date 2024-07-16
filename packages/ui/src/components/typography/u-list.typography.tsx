"use client"

import type * as React from "react"

import { cn } from "../../lib/utils"
import { Box } from "../box"
import type { TypographyUListProps } from "../typography/types.typography"
import { variants } from "../typography/variants.typography"

export const TypographyUList = ({
  children,
  className,
  muted,
  variant = "default",
  ...props
}: TypographyUListProps): React.JSX.Element => {
  return (
    <Box
      {...props}
      as='ul'
      className={cn(
        "my-6 ml-6 list-disc [&>li]:mt-2 text-pretty align-top",
        variant && variants.variant[variant],
        muted && "text-muted-foreground",
        className
      )}
    >
      {children}
    </Box>
  )
}
TypographyUList.displayName = "TypographyUList"
