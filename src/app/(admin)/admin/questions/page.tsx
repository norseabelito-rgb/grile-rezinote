import { getQuestions, getChaptersForSelect } from "@/lib/actions/questions"
import { QuestionTable } from "@/components/admin/question-table"

interface Props {
  searchParams: Promise<{
    chapterId?: string
    type?: string
    search?: string
    page?: string
  }>
}

export default async function QuestionsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page ?? "1", 10)
  const filters = {
    chapterId: params.chapterId,
    type: params.type as "CS" | "CM" | undefined,
    search: params.search,
    page,
  }

  const [data, chapters] = await Promise.all([
    getQuestions(filters),
    getChaptersForSelect(),
  ])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Intrebari</h1>
        <p className="mt-1 text-muted-foreground">
          Gestioneaza banca de intrebari.
        </p>
      </div>

      <QuestionTable
        questions={data.questions}
        total={data.total}
        page={data.page}
        pageSize={data.pageSize}
        chapters={chapters}
        filters={{
          chapterId: params.chapterId,
          type: params.type,
          search: params.search,
        }}
      />
    </div>
  )
}
