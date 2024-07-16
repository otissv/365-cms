"use client"

import type * as React from "react"

import { cn } from "../../lib/utils"
import { Box } from "../box"
import type { TypographyOListProps } from "../typography/types.typography"
import { variants } from "../typography/variants.typography"

export const TypographyOList = ({
  children,
  className,
  muted,
  variant = "default",
  ...props
}: TypographyOListProps): React.JSX.Element => {
  return (
    <Box
      {...props}
      as='ol'
      className={cn(
        "inline-flex my-6 ml-6 list-disc [&>li]:mt-2 text-balance align-top",
        variant && variants.variant[variant],
        muted && "text-muted-foreground",
        className
      )}
    >
      {children}
    </Box>
  )
}

TypographyOList.displayName = "TypographyOList"
