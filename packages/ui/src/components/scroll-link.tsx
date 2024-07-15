"use client"

import { cn } from "@/lib/utils"
import React from "react"
import { Link, type LinkProps } from "react-scroll"

export interface ScrollLinkProps extends Omit<LinkProps, "href" | "ref"> {}

export const ScrollLink = ({
  className,
  children,
  to: hostTo = "",
  duration = 500,
  smooth = false,
  ...props
}: ScrollLinkProps) => {
  const to = hostTo.replace("#", "")
  return (
    <Link
      {...props}
      to={to}
      smooth={smooth}
      duration={duration}
      className={cn("inline-flex cursor-pointer items-center", className)}
      href={`#${to}`}
    >
      {children}
    </Link>
  )
}
