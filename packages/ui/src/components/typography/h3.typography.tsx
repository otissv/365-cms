"use client"

import type * as React from "react"

import { cn } from "../../lib/utils"
import { Box } from "../box"
import type { TypographyHeadingProps } from "../typography/types.typography"
import { variants } from "../typography/variants.typography"

export const TypographyH3 = ({
  children,
  className,
  variant = "default",
  muted,
  ...props
}: TypographyHeadingProps): React.JSX.Element => {
  return (
    <Box
      {...props}
      as='h3'
      className={cn(
        "inline-flex scroll-m-20 text-3xl font-semibold tracking-tight text-balance align-top",
        variant && variants.variant[variant],
        muted && "text-muted-foreground",
        className
      )}
    >
      {children}
    </Box>
  )
}
TypographyH3.displayName = "TypographyH3"
