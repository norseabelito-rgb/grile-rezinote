import { getChaptersForSelect } from "@/lib/actions/questions"
import { QuestionForm } from "@/components/admin/question-form"

export default async function NewQuestionPage() {
  const chapters = await getChaptersForSelect()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Intrebare noua</h1>
        <p className="mt-1 text-muted-foreground">
          Creeaza o intrebare noua in banca de intrebari.
        </p>
      </div>

      <QuestionForm chapters={chapters} />
    </div>
  )
}
