"use client"

import { useTheme } from "next-themes"
import { type ExternalToast, Toaster as Sonner, toast as sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className='toaster group'
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast:
            "group toast border-none rounded-md group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "bg-success text-success-foreground",
          info: "bg-info text-info-foreground  border-info",
          error: "bg-destructive text-destructive-foreground ",
          warning: "bg-warning text-warning-foreground",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  )
}

type NotifyOptions = {
  type?: "default" | "info" | "error" | "success" | "warning"
  data?: ExternalToast
}

function notify(message: string, options?: NotifyOptions) {
  switch (options?.type) {
    case "success":
      return sonner.success(message, options?.data)
    case "info":
      return sonner.info(message, options?.data)
    case "warning":
      return sonner.warning(message, options?.data)
    case "error":
      return sonner.error(message, options?.data)
    default:
      return sonner(message, options?.data)
  }
}

export { Toaster, notify }
