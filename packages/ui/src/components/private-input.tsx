import React from "react"
import { Input, type InputProps } from "../ui/input"
import { Button } from "../ui/button"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { isNumber } from "@repo/lib/isNumber"

export type PrivateHTMLProps = InputProps & {
  value: string
  type?: "text" | "number"
}

export function PrivateInput({
  value = "",
  className,
  type = "text",
  hasPreview = true,
  onBlur,
  onChange,
  onKeyDown,
  ...props
}: PrivateHTMLProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsVisible(false)
    onBlur?.(e)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumber(e.target.value)) {
      onChange?.(e)
    } else {
      onChange?.(e)
    }
  }

  return (
    <div className='relative'>
      <Input
        {...props}
        type={isVisible ? type : "password"}
        aria-describedby='helper-text-explanation'
        className={cn(
          "rounded-mb bg-background border focus:ring-blue-500 focus:border-blue-500 block p-2 cursor-text pr-10",
          className
        )}
        value={value}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        onKeyDown={onKeyDown}
      />
      {hasPreview ? (
        <Button
          variant='ghost'
          className='absolute top-0 right-0  h-10 w-10 p-0'
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <Eye className='h-4 w-4' />
          ) : (
            <EyeOff className='h-4 w-4' />
          )}
        </Button>
      ) : null}
    </div>
  )
}
