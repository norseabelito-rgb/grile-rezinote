export type QuestionType = "CS" | "CM"

export interface QuestionScore {
  questionId: string
  type: QuestionType
  score: number
  maxScore: number
  isAnnulled: boolean
}

export interface ExamResult {
  total: number
  maxPossible: number
  percentage: number
  csScore: number
  cmScore: number
  csCount: number
  cmCount: number
}
