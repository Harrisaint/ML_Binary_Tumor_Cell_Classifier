// components/ui/button.tsx
"use client"
import React from "react"

export function Button({
  children,
  onClick,
  variant,
  size,
  className = "",
  disabled = false,
}: React.PropsWithChildren<{
  onClick?: () => void
  variant?: "outline" | "solid"
  size?: "sm" | "md"
  className?: string
  disabled?: boolean
}>) {
  let base = "px-4 py-2 rounded"
  if (variant === "outline") base += " border"
  if (size === "sm") base += " text-sm"
  const disabledClass = disabled ? " opacity-50 cursor-not-allowed" : ""
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${base}${disabledClass} ${className}`}
    >
      {children}
    </button>
  )
}
