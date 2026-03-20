"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import type { DailyTrend } from "@/types/dashboard"

interface TrendChartProps {
  data: DailyTrend[]
  height?: number
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDate()
  const months = [
    "Ian", "Feb", "Mar", "Apr", "Mai", "Iun",
    "Iul", "Aug", "Sep", "Oct", "Noi", "Dec",
  ]
  return `${day} ${months[d.getMonth()]}`
}

export function TrendChart({ data, height = 300 }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-muted-foreground"
        style={{ height }}
      >
        Nicio activitate inca
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          className="text-xs"
          tick={{ fill: "#94a3b8" }}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          className="text-xs"
          tick={{ fill: "#94a3b8" }}
        />
        <Tooltip
          formatter={(value?: number, name?: string) => {
            const v = value ?? 0
            const n = name ?? ""
            if (n === "accuracyPct") return [`${v}%`, "Acuratete"]
            if (n === "totalQuestions") return [v, "Intrebari"]
            return [v, n]
          }}
          labelFormatter={(label) => formatDate(String(label))}
          contentStyle={{
            backgroundColor: "#1a2e2a",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#e2e8f0",
          }}
        />
        <Area
          type="monotone"
          dataKey="accuracyPct"
          stroke="#10b981"
          fill="url(#accuracyGradient)"
          strokeWidth={2}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
