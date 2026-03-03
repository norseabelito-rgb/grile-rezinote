"use server"

import { getCurrentUser } from "@/lib/auth/get-user"
import {
  getUnmasteredWrongAnswers,
  getWrongAnswerStats,
} from "@/lib/db/queries/wrong-answers"

/**
 * Get the current user's unmastered wrong answers.
 * Optionally filter by chapter IDs.
 */
export async function getMyMistakes(chapterFilter?: string[]) {
  const user = await getCurrentUser()
  return getUnmasteredWrongAnswers(user.id, chapterFilter)
}

/**
 * Get wrong answer statistics for the current user.
 */
export async function getMyMistakesStats() {
  const user = await getCurrentUser()
  return getWrongAnswerStats(user.id)
}
