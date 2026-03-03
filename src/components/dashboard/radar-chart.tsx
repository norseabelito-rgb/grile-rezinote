"use client"

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import type { ChapterStats } from "@/types/dashboard"

interface ChapterRadarProps {
  data: ChapterStats[]
}

function truncateName(name: string, maxLength: number = 15): string {
  if (name.length <= maxLength) return name
  return name.slice(0, maxLength - 3) + "..."
}

export function ChapterRadar({ data }: ChapterRadarProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        Completeaza teste pentru a vedea punctele tale forte
      </div>
    )
  }

  const chartData = data.map((d) => ({
    chapter: truncateName(d.chapterName),
    fullName: d.chapterName,
    accuracy: d.accuracyPct,
    fullMark: 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsRadarChart data={chartData}>
        <PolarGrid className="stroke-muted" />
        <PolarAngleAxis
          dataKey="chapter"
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
        />
        <Radar
          name="Acuratete"
          dataKey="accuracy"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.3}
          animationDuration={1000}
        />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Acuratete"]}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}
