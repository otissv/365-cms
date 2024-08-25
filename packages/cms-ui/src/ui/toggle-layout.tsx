"use client"

import { Grid3X3, Rows3 } from "lucide-react"
import { useRouter } from "next/navigation"
import type * as React from "react"

import { createQueryString } from "@repo/lib/querystring"
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/toggle-group"
import type { ToggleLayoutTypes } from "@repo/cms/types.cms"

export interface ToggleLayoutProps {
  className?: string
  layout: ToggleLayoutTypes
  searchParams: Record<string, any>
  path: string
  size?: "default" | "sm" | "lg" | "icon"
  onChange?: (layout: ToggleLayoutTypes) => void
}

export function ToggleLayout({
  className,
  layout,
  searchParams,
  path,
  size,
  onChange,
}: ToggleLayoutProps): React.JSX.Element {
  const router = useRouter()

  const defaultValue = layout || "list"

  const handleOnLayoutClick = (layout: ToggleLayoutTypes) => (): void => {
    const querystring = createQueryString({
      ...searchParams,
      layout,
    })

    onChange?.(layout)
    router.push(`${path}?${querystring}`)
  }
  return (
    <ToggleGroup
      type='single'
      defaultValue={defaultValue}
      label='Collection layout'
      className={className}
    >
      <ToggleGroupItem
        label='Grid layout'
        value='grid'
        size={size}
        onClick={handleOnLayoutClick("grid")}
      >
        <Grid3X3 />
      </ToggleGroupItem>

      <ToggleGroupItem
        label='List layout'
        value='list'
        size={size}
        onClick={handleOnLayoutClick("list")}
      >
        <Rows3 />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
