import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { STRIPE_CONFIG } from "@/lib/stripe/config"

/**
 * Starts a free trial for a user by setting their trialStartedAt timestamp.
 * Should be called on first paid feature access.
 * Returns the trial end date.
 */
export async function startTrial(userId: string): Promise<Date> {
  const now = new Date()
  const trialEnd = new Date(
    now.getTime() + STRIPE_CONFIG.trialDays * 24 * 60 * 60 * 1000
  )

  await db
    .update(users)
    .set({ trialStartedAt: now })
    .where(eq(users.id, userId))

  return trialEnd
}

/**
 * Checks whether a trial is still active based on the start date.
 */
export function isTrialActive(trialStartedAt: Date | null): boolean {
  if (!trialStartedAt) return false
  const trialEnd = new Date(
    trialStartedAt.getTime() + STRIPE_CONFIG.trialDays * 24 * 60 * 60 * 1000
  )
  return trialEnd > new Date()
}

/**
 * Returns the number of days remaining in the trial.
 * Returns 0 if trial has expired.
 */
export function getTrialDaysRemaining(trialStartedAt: Date): number {
  const trialEnd = new Date(
    trialStartedAt.getTime() + STRIPE_CONFIG.trialDays * 24 * 60 * 60 * 1000
  )
  const remaining = Math.ceil(
    (trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  return Math.max(0, remaining)
}
