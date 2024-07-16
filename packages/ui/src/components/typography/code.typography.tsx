"use client"

import type * as React from "react"

import { cn } from "../../lib/utils"
import { Box } from "../box"
import type { TypographyElementProps } from "../typography/types.typography"
import { variants } from "../typography/variants.typography"

export const TypographyCode = ({
  children,
  className,
  muted,
  variant = "default",
  ...props
}: TypographyElementProps): React.JSX.Element => {
  return (
    <Box
      {...props}
      as='code'
      className={cn(
        "inline-flex relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold align-top",
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
TypographyCode.displayName = "TypographyCode"
