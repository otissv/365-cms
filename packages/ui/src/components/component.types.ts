import type { MotionProps as FramerMotionProps } from "framer-motion"

export type OmitHTMLAttributesTypes =
  | "onAnimationStart"
  | "onDragStart"
  | "onDragEnd"
  | "onDrag"
  | "onAbort"
  | "layout"

export interface ComponentProps<Element>
  extends Omit<React.HTMLAttributes<Element>, OmitHTMLAttributesTypes>,
    Omit<FramerMotionProps, "children" | "style"> {
  enter?: string
  exit?: string
  inView?: {
    once?: boolean
  }
  /**
   * distance
   */
  parallax?: number
}
