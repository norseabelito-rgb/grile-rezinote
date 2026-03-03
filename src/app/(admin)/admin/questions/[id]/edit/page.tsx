import { notFound } from "next/navigation"
import {
  getQuestionById,
  getChaptersForSelect,
} from "@/lib/actions/questions"
import { QuestionForm } from "@/components/admin/question-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditQuestionPage({ params }: Props) {
  const { id } = await params
  const [question, chapters] = await Promise.all([
    getQuestionById(id),
    getChaptersForSelect(),
  ])

  if (!question) {
    notFound()
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editeaza intrebare</h1>
        <p className="mt-1 text-muted-foreground">
          Modifica intrebarea existenta.
        </p>
      </div>

      <QuestionForm question={question} chapters={chapters} />
    </div>
  )
}
