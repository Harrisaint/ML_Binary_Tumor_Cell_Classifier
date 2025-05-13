// components/ui/tabs.tsx
"use client"
import React from "react"

interface TabsProps {
  value: string
  onValueChange: (val: string) => void
  children: React.ReactNode
  className?: string
}
export function Tabs({ value, onValueChange, children, className = "" }: TabsProps) {
  return <div className={className}>{children}</div>
}

export function TabsList({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`flex space-x-2 ${className}`}>{children}</div>
}

interface TabsTriggerProps {
  value: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}
export function TabsTrigger({
  value,
  disabled = false,
  className = "",
  children,
}: TabsTriggerProps) {
  return (
    <button
      data-value={value}
      disabled={disabled}
      className={className}
      onClick={() => {
        /* Placeholder: parent onValueChange should be wired in real implementation */
      }}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}
export function TabsContent({ value, className = "", children }: TabsContentProps) {
  return <div className={className}>{children}</div>
}
