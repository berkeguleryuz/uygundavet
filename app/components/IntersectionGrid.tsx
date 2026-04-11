import * as React from "react"
import { cn } from "@/lib/utils"

export interface IntersectionGridProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number
  height?: number
  strokeWidth?: number
}

export function IntersectionGrid({
  className,
  width = 60,
  height = 60,
  strokeWidth = 1,
  ...props
}: IntersectionGridProps) {
  const patternId = React.useId()

  return (
    <div className={cn("absolute inset-0 z-0 pointer-events-none", className)} {...props}>
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${width} 0 L ${width} ${height} M 0 ${height} L ${width} ${height}`}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth * 0.5}
              strokeOpacity="0.2"
            />
            <path
              d={`M ${width - 4} ${height} L ${width + 4} ${height} M ${width} ${height - 4} L ${width} ${height + 4}`}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth * 2}
              strokeOpacity="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  )
}
