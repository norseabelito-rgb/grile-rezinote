"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCallback } from "react"

const RANGES = [
  { label: "7 zile", value: "7" },
  { label: "30 zile", value: "30" },
  { label: "Tot", value: "all" },
] as const

interface TimeRangeSelectorProps {
  paramName?: string
}

export function TimeRangeSelector({
  paramName = "range",
}: TimeRangeSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get(paramName) ?? "30"

  const handleSelect = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === "30") {
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
      {RANGES.map((range) => (
        <Button
          key={range.value}
          variant={current === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleSelect(range.value)}
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}
