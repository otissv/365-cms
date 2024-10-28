"use client"

import type React from "react"
import { TriangleAlert } from "lucide-react"

import { cn } from "@repo/ui/cn"

import { Input } from "@repo/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip"
import type { CmsFieldBase } from "@repo/cms/types.cms"

export type FieldProps = {
  children?: React.ReactNode | React.ReactNode[]
  className?: string
  value: unknown
  errorMessage: CmsFieldBase<unknown>["errorMessage"]
  isInline: CmsFieldBase<unknown>["isInline"]
  onOpenChange: (open: boolean) => void
}

export function InlinePopupField({
  children,
  className,
  errorMessage,
  isInline,
  value,
  onOpenChange,
}: FieldProps): JSX.Element {
  return isInline ? (
    <TooltipProvider>
      <Popover onOpenChange={(open) => onOpenChange?.(open)}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex rounded-md border cursor-text",
              isInline && "rounded-none border-t-0",
              errorMessage && "flex items-center",
              className
            )}
          >
            <Input
              className={cn(
                "min-w-48 p-2 border-0 bg-transparent rounded-none focus:bg-accent",
                !isInline && "rounded-md"
              )}
              aria-describedby='helper-text-explanation'
              value={value}
              onChange={() => {}}
            />{" "}
            {errorMessage ? (
              <Tooltip>
                <TooltipTrigger>
                  <TriangleAlert className='mr-2 size-5 text-destructive' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errorMessage}</p>
                </TooltipContent>
              </Tooltip>
            ) : null}
          </div>
        </PopoverTrigger>

        <PopoverContent align='end' className={cn("w-full p-0 min-w-80")}>
          {children}
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  ) : (
    <>{children}</>
  )
}
