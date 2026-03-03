import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { ClipboardList } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TestHistoryTable } from "@/components/dashboard/test-history-table"
import { fetchTestHistory } from "@/lib/actions/dashboard"

export const metadata: Metadata = {
  title: "Istoric Teste | Dashboard | grile-ReziNOTE",
}

export default async function TestsHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1
  const typeFilter = typeof params.type === "string" ? params.type : undefined

  const data = await fetchTestHistory(page, 20, typeFilter)

  const hasAnyData = data.total > 0 || typeFilter

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Istoric Teste</h1>
        <p className="text-sm text-muted-foreground">
          Revizuieste testele si simularile tale anterioare
        </p>
      </div>

      {!hasAnyData ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">
              Inca nu ai completat niciun test
            </h2>
            <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
              Incepe un test de practica sau o simulare pentru a-ti construi istoricul!
            </p>
            <Button asChild>
              <Link href="/practice">Incepe un test</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Suspense>
          <TestHistoryTable data={data} />
        </Suspense>
      )}

      {/* Summary footer */}
      {data.total > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Total: {data.total} teste completate
        </p>
      )}
    </div>
  )
}
