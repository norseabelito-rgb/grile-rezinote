"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCallback } from "react"

const OPTIONS = [
  { label: "Toate", value: "all" },
  { label: "Practica", value: "practice" },
  { label: "Simulari", value: "simulation" },
] as const

interface DataTypeToggleProps {
  paramName?: string
}

export function DataTypeToggle({
  paramName = "type",
}: DataTypeToggleProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get(paramName) ?? "all"

  const handleSelect = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === "all") {
        params.delete(paramName)
      } else {
        params.set(paramName, value)
      }
      router.push(`?${params.toString()}`)
    },
    [router, searchParams, paramName]
  )

  return (
    <div className="flex gap-1">
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={current === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleSelect(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
