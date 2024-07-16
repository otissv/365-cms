"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import type * as React from "react"

import { useToast } from "..//ui/use-toast"
import { cn } from "../lib/utils"

export interface NotifyProps {
  className?: string
  variant?: "default" | "destructive" | "success" | null
  title: React.ReactNode
  description?: React.ReactNode
  action?: {
    alt: string
    children: React.ReactNode
  }
}

export const useNotify = () => {
  const { toast } = useToast()

  return ({
    variant = "default",
    title,
    description,
    action,
    ...props
  }: NotifyProps) => {
    toast({
      //@ts-ignore
      title: <div className='mb-2'>{title}</div>,
      description: description as any,
      ...(variant ? { variant } : {}),
      ...action,
      ...props,
    })
  }
}

export interface SuccessNotifyProps extends Omit<NotifyProps, "variant"> {}
export const useSuccessNotify = () => {
  const notify = useNotify()

  return ({
    action,
    className,
    description,
    title,
    ...props
  }: SuccessNotifyProps) =>
    notify({
      title: (
        <>
          <CheckCircle2 className='inline' /> {title}
        </>
      ),
      description,
      action,
      className: cn("bg-green-900", className),
      ...props,
    })
}

export interface ErrorNotifyProps extends Omit<NotifyProps, "variant"> {}
export const useErrorNotify = () => {
  const notify = useNotify()

  return ({ description, action, title, ...props }: ErrorNotifyProps) =>
    notify({
      variant: "destructive",
      title: (
        <>
          <XCircle className='inline' /> {title}
        </>
      ),
      description,
      action,
      ...props,
    })
}
