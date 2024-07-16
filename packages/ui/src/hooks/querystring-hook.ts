"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type * as React from "react"

import { createQueryString, decodeSearchParams } from "@repo/lib/querystring"

export function useGetSearchParams(): Record<string, any> {
  const searchParams = useSearchParams()

  const params: Record<string, any> = {}
  const entries = searchParams.entries()
  for (let entry = entries.next(); !entry.done; entry = entries.next()) {
    params[entry.value[0]] = entry.value[1]
  }

  return decodeSearchParams(params)
}

export function useCreateQueryString(): (
  params: Record<string, any>
) => string {
  return (params: Record<string, any>) => createQueryString(params)
}

export function usePushQueryString(
  startTransition: React.TransitionStartFunction
): (params: Record<string, any>) => void {
  const pathname = usePathname()
  const createQueryString = useCreateQueryString()
  const router = useRouter()

  return (params: Record<string, any>): void => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(params)}`)
    })
  }
}
