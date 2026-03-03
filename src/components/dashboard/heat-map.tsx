"use client"

import { useState } from "react"
import type { HeatmapCell } from "@/types/dashboard"

interface HeatMapProps {
  data: HeatmapCell[]
  chapters: string[]
  dates: string[]
}

function getColor(accuracy: number | null): string {
  if (accuracy === null) return "bg-muted"
  if (accuracy >= 80) return "bg-green-500 dark:bg-green-600"
  if (accuracy >= 60) return "bg-yellow-500 dark:bg-yellow-600"
  if (accuracy >= 40) return "bg-orange-500 dark:bg-orange-600"
  return "bg-red-500 dark:bg-red-600"
}

function getLabel(accuracy: number | null): string {
  if (accuracy === null) return "Fara activitate"
  if (accuracy >= 80) return "Excelent"
  if (accuracy >= 60) return "Bun"
  if (accuracy >= 40) return "Mediu"
  return "Slab"
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

export function HeatMap({ data, chapters, dates }: HeatMapProps) {
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    content: string
  } | null>(null)

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        Nicio activitate in perioada selectata
      </div>
    )
  }

  // Build lookup map: chapterName-date -> cell
  const cellMap = new Map<string, HeatmapCell>()
  for (const cell of data) {
    cellMap.set(`${cell.chapterName}-${cell.date}`, cell)
  }

  return (
    <div className="relative overflow-x-auto">
      {/* Legend */}
      <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span>Legenda:</span>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-sm bg-muted" />
          <span>Fara activitate</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-sm bg-red-500" />
          <span>Slab</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-sm bg-orange-500" />
          <span>Mediu</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-sm bg-yellow-500" />
          <span>Bun</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-sm bg-green-500" />
          <span>Excelent</span>
        </div>
      </div>

      {/* Grid */}
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `160px repeat(${dates.length}, 1fr)`,
        }}
      >
        {/* Header row: empty corner + dates */}
        <div />
        {dates.map((date, i) =>
          i % 7 === 0 ? (
            <div
              key={date}
              className="text-center text-[10px] text-muted-foreground"
            >
              {formatDateShort(date)}
            </div>
          ) : (
            <div key={date} />
          )
        )}

        {/* Data rows */}
        {chapters.map((chapter) => (
          <>
            <div
              key={`label-${chapter}`}
              className="truncate pr-2 text-xs text-muted-foreground leading-4"
              title={chapter}
            >
              {chapter}
            </div>
            {dates.map((date) => {
              const cell = cellMap.get(`${chapter}-${date}`)
              const accuracy = cell?.accuracyPct ?? null
              const questionCount = cell?.questionCount ?? 0

              return (
                <div
                  key={`${chapter}-${date}`}
                  className={`h-4 w-full min-w-[16px] rounded-sm ${getColor(accuracy)} cursor-pointer transition-transform hover:scale-110`}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setTooltip({
                      x: rect.left + rect.width / 2,
                      y: rect.top - 8,
                      content: `${chapter}\n${formatDateShort(date)}\n${getLabel(accuracy)}${accuracy !== null ? ` (${accuracy}%)` : ""}\n${questionCount} intrebari`,
                    })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              )
            })}
          </>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 rounded-lg border bg-card px-3 py-2 text-xs shadow-md"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.content.split("\n").map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  )
}
