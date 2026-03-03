"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: { value: number; isPositive: boolean }
  className?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("transition-opacity duration-500 animate-in fade-in", className)}>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <Badge
                variant={trend.isPositive ? "default" : "destructive"}
                className="text-xs"
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
