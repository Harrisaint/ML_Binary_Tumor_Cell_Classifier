// components/ui/progress.tsx
"use client"
import React from "react"

export function Progress({
  value,
  className = "",
}: {
  value: number
  className?: string
}) {
  return (
    <div className="w-full bg-gray-200 rounded">
      <div className={`${className} h-2 rounded`} style={{ width: `${value}%` }} />
    </div>
  )
}
