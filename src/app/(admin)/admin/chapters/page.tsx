import { getChaptersWithStats } from "@/lib/actions/chapters"
import { ChapterList } from "@/components/admin/chapter-list"

export default async function ChaptersPage() {
  const chapters = await getChaptersWithStats()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Capitole</h1>
        <p className="mt-1 text-muted-foreground">
          Gestioneaza capitolele de intrebari. Trage pentru a reordona.
        </p>
      </div>

      <ChapterList chapters={chapters} />
    </div>
  )
}
