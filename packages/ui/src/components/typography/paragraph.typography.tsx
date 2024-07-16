"use client"

import type * as React from "react"

import { cn } from "../../lib/utils"
import { Box } from "../box"
import type { TypographyParagraphProps } from "../typography/types.typography"
import { variants } from "../typography/variants.typography"

export const TypographyParagraph = ({
  children,
  className,
  muted,
  variant = "default",
  ...props
}: TypographyParagraphProps): React.JSX.Element => {
  return (
    <Box
      {...props}
      as='p'
      className={cn(
        "inline-flex leading-7 text-pretty align-top transition-all",
        variant && variants.variant[variant],
        muted && "text-muted-foreground",
        className
      )}
    >
      {children}
    </Box>
  )
}
TypographyParagraph.displayName = "TypographyParagraph"
