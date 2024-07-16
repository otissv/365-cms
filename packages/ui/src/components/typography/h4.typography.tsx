"use client"

import type * as React from "react"

import { cn } from "../../lib/utils"
import { Box } from "../box"
import type { TypographyHeadingProps } from "../typography/types.typography"
import { variants } from "../typography/variants.typography"

export const TypographyH4 = ({
  children,
  className,
  muted,
  variant = "default",
  ...props
}: TypographyHeadingProps): React.JSX.Element => {
  return (
    <Box
      {...props}
      as='h4'
      className={cn(
        "inline-flex scroll-m-20 text-xl font-semibold tracking-tight text-balance align-top",
        variant && variants.variant[variant],
        muted && "text-muted-foreground",
        className
      )}
    >
      {children}
    </Box>
  )
}
TypographyH4.displayName = "TypographyH4"
