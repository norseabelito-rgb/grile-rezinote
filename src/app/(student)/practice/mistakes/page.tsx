import { getCurrentUser } from "@/lib/auth/get-user"
import { getMyMistakes, getMyMistakesStats } from "@/lib/actions/wrong-answers"
import { MistakesList } from "@/components/practice/MistakesList"

export default async function MistakesPage() {
  const user = await getCurrentUser()

  const [mistakes, stats] = await Promise.all([
    getMyMistakes(),
    getMyMistakesStats(),
  ])

  // Build chapter list with counts
  const chapters = stats.byChapter.map((ch) => ({
    id: ch.chapterId,
    name: ch.chapterName,
    count: ch.count,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Greselile mele</h1>
        <p className="mt-1 text-muted-foreground">
          Revizuieste intrebarile la care ai gresit si exerseaza-le din nou
        </p>
        {stats.totalMastered > 0 && (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">
            {stats.totalMastered} intrebari stapanite (eliminate din lista)
          </p>
        )}
      </div>

      <MistakesList mistakes={mistakes} chapters={chapters} />
    </div>
  )
}
