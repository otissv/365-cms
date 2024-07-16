import * as React from "react"

import { ChevronRight, Home } from "lucide-react"
import { cn } from "../lib/utils"
import { AppLink } from "./app-link"

export interface Breadcrumb {
  label: React.ReactNode
  crumb?: string
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  crumbs: Breadcrumb[]
  separator?: React.ReactNode
}

export const BreadCrumbs = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, crumbs = [], separator, ...props }, ref) => {
    let url = ""

    const breadcrumbs = crumbs.map(({ crumb, label }) => {
      if ((url === "/" || url === "") && crumb) {
        url = url + crumb
      } else if (crumb) {
        url = `${url}/${crumb}`
      }

      return (
        <React.Fragment key={crumb || "current"}>
          {crumb ? (
            <li className='inline-flex items-center'>
              {separator ? (
                separator
              ) : (
                <ChevronRight className='h-4 w-4 text-muted-foreground dark:text-muted-foreground ' />
              )}
              <AppLink
                href={url}
                className='inline-flex items-center text-sm font-medium ml-1 whitespace-nowrap'
                title={`Goto ${url.replace("/", "")}`}
              >
                {label}
              </AppLink>
            </li>
          ) : (
            <li className='inline-flex items-center'>
              {separator ? (
                separator
              ) : (
                <ChevronRight className='h-4 w-4 text-muted-foreground dark:text-muted-foreground ' />
              )}

              <span className='inline-flex text-sm font-medium ml-1 text-muted-foreground dark:text-muted-foreground whitespace-nowrap'>
                {label}
              </span>
            </li>
          )}
        </React.Fragment>
      )
    })

    return (
      <nav
        className={cn(className)}
        aria-label='Breadcrumb'
        ref={ref}
        {...props}
      >
        <ol className='inline-flex items-center space-x-1 md:space-x-3'>
          <li className='inline-flex items-center'>
            <AppLink
              href='/'
              className='inline-flex items-center text-sm font-medium ml-1 whitespace-nowrap'
              title='Go to home'
            >
              <Home className='h-4 w-4' />
            </AppLink>
          </li>
          {breadcrumbs}
        </ol>
      </nav>
    )
  }
)
BreadCrumbs.displayName = "BreadCrumbMenu"
