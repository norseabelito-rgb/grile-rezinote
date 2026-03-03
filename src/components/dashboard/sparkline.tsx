"use client"

import { LineChart, Line, ResponsiveContainer } from "recharts"

interface SparklineProps {
  data: { value: number }[]
  width?: number
  height?: number
  color?: string
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  color = "hsl(var(--primary))",
}: SparklineProps) {
  if (data.length === 0) {
    return <div style={{ width, height }} />
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
