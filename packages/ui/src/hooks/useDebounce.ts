"use client"

import React from "react"

export function useDebounce<T>(fn: (value: T) => void, delay = 1000) {
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  return (value: T): void => {
    clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      fn(value)
    }, delay)
  }
}
