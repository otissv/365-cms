"use client"

import type * as React from "react"

import { cn } from "../../lib/utils"
import { Box } from "../box"
import type { TypographyBlockquoteProps } from "../typography/types.typography"
import { variants } from "../typography/variants.typography"

export const TypographyBlockquote = ({
  children,
  className,
  muted,
  variant = "default",
  ...props
}: TypographyBlockquoteProps): React.JSX.Element => {
  return (
    <Box
      {...props}
      as='blockquote'
      className={cn(
        "inline-flex mt-6 border-l-2 pl-6 text-balance align-top",
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
TypographyBlockquote.displayName = "TypographyBlockquote"
