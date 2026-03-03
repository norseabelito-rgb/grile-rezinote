import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Target, FileQuestion, ClipboardCheck, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/dashboard/stat-card"
import { TrendChart } from "@/components/dashboard/trend-chart"
import { ChapterRadar } from "@/components/dashboard/radar-chart"
import { TimeRangeSelector } from "@/components/dashboard/time-range-selector"
import { DataTypeToggle } from "@/components/dashboard/data-type-toggle"
import { MotivationCard } from "@/components/motivation/motivation-card"
import {
  fetchDashboardOverview,
  fetchTrends,
  fetchChapterStats,
} from "@/lib/actions/dashboard"

export const metadata: Metadata = {
  title: "Dashboard | grile-ReziNOTE",
}

function mapTypeFilter(type?: string): string | undefined {
  if (!type || type === "all") return undefined
  if (type === "practice") return "practice_chapter"
  return type
}

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const rangeParam = typeof params.range === "string" ? params.range : "30"
  const typeParam = typeof params.type === "string" ? params.type : undefined
  const typeFilter = mapTypeFilter(typeParam)

  const days = rangeParam === "all" ? 365 : rangeParam === "7" ? 7 : 30

  const [overview, trends, chapterStats] = await Promise.all([
    fetchDashboardOverview(undefined, undefined, typeFilter),
    fetchTrends(days, typeFilter),
    fetchChapterStats(undefined, undefined, typeFilter),
  ])

  const hasData = overview.stats.totalQuestions > 0

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Progresul tau in pregatirea pentru rezidentiat
          </p>
        </div>
        <div className="flex gap-2">
          <Suspense>
            <TimeRangeSelector />
          </Suspense>
          <Suspense>
            <DataTypeToggle />
          </Suspense>
        </div>
      </div>

      {!hasData ? (
        /* Empty state */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileQuestion className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">
              Inca nu ai completat niciun test
            </h2>
            <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
              Incepe un test de practica pentru a vedea statisticile tale!
            </p>
            <Button asChild>
              <Link href="/practice">Incepe un test</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Acuratete"
              value={`${overview.stats.accuracyPct}%`}
              icon={Target}
            />
            <StatCard
              label="Intrebari"
              value={overview.stats.totalQuestions}
              icon={FileQuestion}
            />
            <StatCard
              label="Teste"
              value={overview.stats.totalTests}
              icon={ClipboardCheck}
            />
            <StatCard
              label="Serie"
              value={`${overview.streak} zile`}
              icon={Flame}
            />
          </div>

          {/* Daily Motivation */}
          <Suspense fallback={null}>
            <MotivationCard />
          </Suspense>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolutia Acuratetii</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={trends} height={300} />
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Puncte Forte per Capitol</CardTitle>
            </CardHeader>
            <CardContent>
              <ChapterRadar data={chapterStats} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
