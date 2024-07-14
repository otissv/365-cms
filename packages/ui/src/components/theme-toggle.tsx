"use client"

import { useTheme } from "next-themes"

import { Button } from "@ui/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/ui/dropdown-menu"

export function ThemeToggle(): JSX.Element {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          {/* {resolvedTheme === 'dark' ? (
            <Sun suppressHydrationWarning className='h-5 w-5 text-white' />
          ) : (
            <Moon suppressHydrationWarning className='h-5 w-5' />
          )} */}

          {resolvedTheme === "dark" ? "dark" : "light"}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
