"use client"

import { cn } from "@/lib/utils"

interface AuroraBackgroundProps {
  className?: string
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      {/* Primary blob */}
      <div className="aurora-blob aurora-blob-1" />
      {/* Secondary blob */}
      <div className="aurora-blob aurora-blob-2" />
      {/* Tertiary blob */}
      <div className="aurora-blob aurora-blob-3" />
      {/* Noise texture overlay for depth */}
      <div className="absolute inset-0 bg-background/60 dark:bg-background/70" />
    </div>
  )
}
