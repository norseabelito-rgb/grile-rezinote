"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { chapters, questions, options } from "@/lib/db/schema"
import { eq, isNull, ilike, and, asc, desc, count, sql } from "drizzle-orm"
import { questionSchema, type QuestionInput } from "@/lib/validations/question"
import { getCurrentAdmin, logAudit } from "@/lib/db/queries/admin"

interface QuestionFilters {
  chapterId?: string
  type?: "CS" | "CM"
  search?: string
  page?: number
  pageSize?: number
}

export async function getQuestions(filters: QuestionFilters = {}) {
  await getCurrentAdmin()

  const { chapterId, type, search, page = 1, pageSize = 20 } = filters
  const offset = (page - 1) * pageSize

  const conditions = [isNull(questions.archivedAt)]
  if (chapterId) conditions.push(eq(questions.chapterId, chapterId))
  if (type) conditions.push(eq(questions.type, type))
  if (search) conditions.push(ilike(questions.text, `%${search}%`))

  const whereClause = and(...conditions)

  const questionList = await db
    .select({
      id: questions.id,
      text: questions.text,
      type: questions.type,
      chapterId: questions.chapterId,
      chapterName: chapters.name,
      sourceBook: questions.sourceBook,
      sourcePage: questions.sourcePage,
      createdAt: questions.createdAt,
    })
    .from(questions)
    .leftJoin(chapters, eq(questions.chapterId, chapters.id))
    .where(whereClause)
    .orderBy(desc(questions.createdAt))
    .limit(pageSize)
    .offset(offset)

  const [totalResult] = await db
    .select({ value: count() })
    .from(questions)
    .where(whereClause)

  return {
    questions: questionList,
    total: totalResult?.value ?? 0,
    page,
    pageSize,
  }
}

export async function getQuestionById(id: string) {
  await getCurrentAdmin()

  const [question] = await db
    .select({
      id: questions.id,
      chapterId: questions.chapterId,
      text: questions.text,
      type: questions.type,
      sourceBook: questions.sourceBook,
      sourcePage: questions.sourcePage,
      archivedAt: questions.archivedAt,
    })
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1)

  if (!question || question.archivedAt) return null

  const questionOptions = await db
    .select({
      id: options.id,
      label: options.label,
      text: options.text,
      isCorrect: options.isCorrect,
    })
    .from(options)
    .where(eq(options.questionId, id))
    .orderBy(asc(options.label))

  return { ...question, options: questionOptions }
}

export async function createQuestion(data: QuestionInput) {
  const admin = await getCurrentAdmin()

  const parsed = questionSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const result = await db.transaction(async (tx) => {
    const [question] = await tx
      .insert(questions)
      .values({
        chapterId: parsed.data.chapterId,
        text: parsed.data.text,
        type: parsed.data.type,
        sourceBook: parsed.data.sourceBook || null,
        sourcePage: parsed.data.sourcePage || null,
      })
      .returning({ id: questions.id })

    await tx.insert(options).values(
      parsed.data.options.map((opt, i) => ({
        questionId: question.id,
        label: String.fromCharCode(65 + i), // A, B, C, D, E
        text: opt.text,
        isCorrect: opt.isCorrect,
      }))
    )

    return question
  })

  await logAudit(admin.id, "create", "question", result.id, {
    chapterId: parsed.data.chapterId,
    type: parsed.data.type,
    text: parsed.data.text.substring(0, 100),
  })

  revalidatePath("/admin/questions")
  revalidatePath("/admin")
  return { success: true, id: result.id }
}

export async function updateQuestion(id: string, data: QuestionInput) {
  const admin = await getCurrentAdmin()

  const parsed = questionSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  // Fetch old for audit
  const [old] = await db
    .select({ text: questions.text, type: questions.type })
    .from(questions)
    .where(eq(questions.id, id))

  await db.transaction(async (tx) => {
    await tx
      .update(questions)
      .set({
        chapterId: parsed.data.chapterId,
        text: parsed.data.text,
        type: parsed.data.type,
        sourceBook: parsed.data.sourceBook || null,
        sourcePage: parsed.data.sourcePage || null,
        updatedAt: new Date(),
      })
      .where(eq(questions.id, id))

    // Delete old options and re-insert (simpler than diffing individual option updates)
    await tx.delete(options).where(eq(options.questionId, id))

    await tx.insert(options).values(
      parsed.data.options.map((opt, i) => ({
        questionId: id,
        label: String.fromCharCode(65 + i),
        text: opt.text,
        isCorrect: opt.isCorrect,
      }))
    )
  })

  await logAudit(admin.id, "update", "question", id, {
    text: { old: old?.text?.substring(0, 100), new: parsed.data.text.substring(0, 100) },
    type: { old: old?.type, new: parsed.data.type },
  })

  revalidatePath("/admin/questions")
  revalidatePath("/admin")
  return { success: true }
}

export async function archiveQuestion(id: string) {
  const admin = await getCurrentAdmin()

  await db
    .update(questions)
    .set({ archivedAt: new Date() })
    .where(eq(questions.id, id))

  await logAudit(admin.id, "delete", "question", id)

  revalidatePath("/admin/questions")
  revalidatePath("/admin")
  return { success: true }
}

export async function restoreQuestion(id: string) {
  const admin = await getCurrentAdmin()

  await db
    .update(questions)
    .set({ archivedAt: null })
    .where(eq(questions.id, id))

  await logAudit(admin.id, "restore", "question", id)

  revalidatePath("/admin/questions")
  revalidatePath("/admin")
  return { success: true }
}

export async function getChaptersForSelect() {
  await getCurrentAdmin()

  return db
    .select({ id: chapters.id, name: chapters.name })
    .from(chapters)
    .where(isNull(chapters.archivedAt))
    .orderBy(asc(chapters.sortOrder))
}
