import { useInView } from "framer-motion"
import React from "react"

type CheckPosition = () => boolean

export const useElementScrollPosition = (
  elementRef: React.RefObject<HTMLElement>,
  onTopPosition?: (isInView: boolean, elementTop: number) => void
): CheckPosition => {
  const isInView = useInView(elementRef)

  const checkPosition = React.useCallback(() => {
    if (!elementRef.current) return false

    const elementTop = elementRef.current.getBoundingClientRect().top

    const elTop = Math.round(elementTop / 2)
    const scroll = window.scrollY - window.innerHeight

    // When the top of the element is reached
    if (elTop <= scroll) {
      onTopPosition?.(isInView, elTop)
    }

    return elTop <= scroll
  }, [elementRef, isInView, onTopPosition])

  React.useEffect(() => {
    window.addEventListener("scroll", checkPosition, { passive: true })
    return (): void => window.removeEventListener("scroll", checkPosition)
  }, [checkPosition])

  return checkPosition
}
