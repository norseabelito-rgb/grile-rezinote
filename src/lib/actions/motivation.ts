"use server"

import { getCurrentUser } from "@/lib/auth/get-user"
import {
  getOverallStats,
  getChapterStats,
  getStreakCount,
} from "@/lib/db/queries/dashboard"
import { db } from "@/lib/db"
import { attempts } from "@/lib/db/schema"
import { eq, and, sql, desc } from "drizzle-orm"
import { getDailyMessage, getPostTestMessage } from "@/lib/motivation/engine"
import type { MessageContext, MotivationMessage } from "@/lib/motivation/types"

/**
 * Build message context from real dashboard data.
 */
async function buildMessageContext(
  userId: string,
  latestTest?: {
    accuracy: number
    correct: number
    total: number
  }
): Promise<MessageContext> {
  const [stats, chapters, streak] = await Promise.all([
    getOverallStats(userId),
    getChapterStats(userId),
    getStreakCount(userId),
  ])

  // Sort chapters by accuracy to find weakest/strongest
  const sortedChapters = [...chapters]
    .filter((c) => c.totalAnswers > 0)
    .sort((a, b) => a.accuracyPct - b.accuracyPct)

  const weakestChapter =
    sortedChapters.length > 0
      ? {
          name: sortedChapters[0].chapterName,
          accuracyPct: sortedChapters[0].accuracyPct,
        }
      : null

  const strongestChapter =
    sortedChapters.length > 0
      ? {
          name: sortedChapters[sortedChapters.length - 1].chapterName,
          accuracyPct:
            sortedChapters[sortedChapters.length - 1].accuracyPct,
        }
      : null

  // Get simulation-specific data
  const simCountResult = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, userId),
        sql`${attempts.type} = 'simulation'`,
        sql`${attempts.status} = 'completed'`
      )
    )

  const lastSimResult = await db
    .select({
      score: attempts.score,
      maxScore: attempts.maxScore,
    })
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, userId),
        sql`${attempts.type} = 'simulation'`,
        sql`${attempts.status} = 'completed'`
      )
    )
    .orderBy(desc(attempts.completedAt))
    .limit(1)

  const simCount = simCountResult[0]?.count ?? 0
  const lastSim = lastSimResult[0]

  return {
    totalTests: stats.totalTests,
    totalQuestions: stats.totalQuestions,
    accuracyPct: stats.accuracyPct,
    streak,
    weakestChapter,
    strongestChapter,
    lastSimScore: lastSim?.score ?? null,
    lastSimMaxScore: lastSim?.maxScore ?? null,
    totalSimulations: simCount,
    latestTestAccuracy: latestTest?.accuracy ?? null,
    latestTestCorrect: latestTest?.correct ?? null,
    latestTestTotal: latestTest?.total ?? null,
  }
}

/**
 * Fetch daily motivational message for the dashboard.
 * Returns null if no relevant message is available.
 */
export async function fetchDailyMotivation(): Promise<MotivationMessage | null> {
  const user = await getCurrentUser()
  const ctx = await buildMessageContext(user.id)
  return getDailyMessage(ctx, user.id)
}

/**
 * Fetch contextual motivational message for post-test display.
 */
export async function fetchPostTestMotivation(
  testAccuracy: number,
  testCorrect: number,
  testTotal: number
): Promise<MotivationMessage | null> {
  const user = await getCurrentUser()
  const ctx = await buildMessageContext(user.id, {
    accuracy: testAccuracy,
    correct: testCorrect,
    total: testTotal,
  })
  return getPostTestMessage(ctx)
}
