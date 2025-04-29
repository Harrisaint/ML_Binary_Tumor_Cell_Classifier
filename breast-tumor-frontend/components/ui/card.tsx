// components/ui/card.tsx
"use client"
import React from "react"

export function Card({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-lg shadow p-4 bg-white ${className}`}>{children}</div>
}

export function CardHeader({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`border-b pb-2 mb-2 ${className}`}>{children}</div>
}

export function CardContent({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={className}>{children}</div>
}

export function CardTitle({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
}
