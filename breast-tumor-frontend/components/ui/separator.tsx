// components/ui/separator.tsx
"use client"
import React from "react"

export function Separator({
  className = "",
}: {
  className?: string
}) {
  return <hr className={`my-4 border-gray-300 ${className}`} />
}
