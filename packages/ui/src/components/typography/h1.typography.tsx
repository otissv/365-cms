"use client"

import type * as React from "react"

import { cn } from "../../lib/utils"
import { Box } from "../box"
import type { TypographyHeadingProps } from "../typography/types.typography"
import { variants } from "../typography/variants.typography"

export const TypographyH1 = ({
  children,
  className,
  muted,
  variant = "default",
  ...props
}: TypographyHeadingProps): React.JSX.Element => {
  return (
    <Box
      as='h1'
      className={cn(
        "inline-flex scroll-m-20 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl text-balance align-top transition-all",
        variant && variants.variant[variant],
        muted && "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Box>
  )
}
TypographyH1.displayName = "TypographyH1"
