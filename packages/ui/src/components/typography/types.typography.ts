import type { ComponentProps } from "../component.types"

export interface TypographyBaseProps {
  muted?: boolean
  variant?: "default" | "uppercase" | "lowercase" | "capitalize"
}

// @ts-ignore override size
export interface TypographyHeadingProps
  extends ComponentProps<HTMLHeadingElement>,
    TypographyBaseProps {}

// @ts-ignore override size
export interface TypographyParagraphProps
  extends ComponentProps<HTMLParagraphElement>,
    TypographyBaseProps {}

// @ts-ignore override size
export interface TypographyBlockquoteProps
  extends ComponentProps<HTMLQuoteElement>,
    TypographyBaseProps {}

// @ts-ignore override size
export interface TypographyOListProps
  extends ComponentProps<HTMLOListElement>,
    TypographyBaseProps {}

// @ts-ignore override size
export interface TypographyUListProps
  extends ComponentProps<HTMLUListElement>,
    TypographyBaseProps {}

// @ts-ignore override size
export interface TypographyElementProps
  extends ComponentProps<HTMLElement>,
    TypographyBaseProps {}

// @ts-ignore override size
export interface TypographyDivProps
  extends ComponentProps<HTMLDivElement>,
    TypographyBaseProps {}
