import Link from "next/link"
import * as React from "react"

import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "../lib/utils"

const buttonClasses =
  "h-10 px-4 py-2 inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const appLinkVariants = (variants: any, defaultVariants: any) =>
  cva("inline-flex", {
    variants: {
      variant: {
        default: "hover:underline focus:underline dark:hover-underline",
        button: `${buttonClasses} bg-primary text-primary-foreground hover:bg-primary/90`,
        destructive: `${buttonClasses} bg-destructive text-destructive-foreground hover:bg-destructive/90`,
        outline: `${buttonClasses} border border-input bg-background hover:bg-accent hover:text-accent-foreground`,
        secondary: `${buttonClasses} bg-secondary text-secondary-foreground hover:bg-secondary/80`,
        ghost: `${buttonClasses} hover:bg-accent hover:text-accent-foreground`,
        ...variants?.variant,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      ...defaultVariants,
    },
  })

export interface AppLinkProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof appLinkVariants> {
  asChild?: boolean
  variants?: {
    variant: Record<string, string>
  }
  defaultVariants?: { variant: string; size: string }
  href: string
}

// TODO: add button variants

export const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ className, variant, href, variants, defaultVariants, ...props }, ref) => {
    return (
      <Link
        href={href}
        className={cn(
          appLinkVariants(variants, defaultVariants)({ variant, className })
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
AppLink.displayName = "AppLink"
