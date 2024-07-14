import { cn } from "@ui/lib/utils"
import type React from "react"

export interface LoadingProps
  extends Omit<React.HTMLAttributes<SVGElement>, "title"> {
  color?: string
  title?: string
}

export const Loading = ({
  className,
  color = "#000000",
  title = "Loading",
  ...props
}: LoadingProps) => {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 100 100'
      preserveAspectRatio='xMidYMid'
      className={cn("animate-spin", className)}
    >
      <title>{title}</title>
      <g data-idx='1'>
        <circle
          cx='50'
          cy='50'
          fill='none'
          stroke={color}
          strokeWidth='10'
          r='35'
          strokeDasharray='164.93361431346415 56.97787143782138'
          transform='matrix(0.4257737010524831,-0.9048296831404631,0.9048296831404631,0.4257737010524831,-16.530169209647312,73.95279910439899)'
        />
      </g>
    </svg>
  )
}
