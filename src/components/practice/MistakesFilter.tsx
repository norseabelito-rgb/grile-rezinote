"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ChapterWithCount {
  id: string
  name: string
  count: number
}

interface MistakesFilterProps {
  chapters: ChapterWithCount[]
  selectedChapterIds: string[]
  onChange: (ids: string[]) => void
}

export function MistakesFilter({
  chapters,
  selectedChapterIds,
  onChange,
}: MistakesFilterProps) {
  const isAllSelected = selectedChapterIds.length === 0

  function toggleChapter(id: string) {
    if (selectedChapterIds.includes(id)) {
      onChange(selectedChapterIds.filter((sid) => sid !== id))
    } else {
      onChange([...selectedChapterIds, id])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange([])}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
          isAllSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted hover:bg-accent"
        )}
      >
        Toate capitolele
      </button>
      {chapters.map((ch) => (
        <button
          key={ch.id}
          onClick={() => toggleChapter(ch.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            selectedChapterIds.includes(ch.id)
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted hover:bg-accent"
          )}
        >
          {ch.name}
          <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5">
            {ch.count}
          </Badge>
        </button>
      ))}
    </div>
  )
}
