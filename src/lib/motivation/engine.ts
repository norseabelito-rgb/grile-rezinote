import type { MessageContext, MotivationMessage, MessageType } from "./types"
import {
  encouragementTemplates,
  guidanceTemplates,
  didYouKnowTemplates,
  milestoneTemplates,
} from "./templates"

/**
 * Simple deterministic hash from string seed.
 * Used for daily rotation consistency per user.
 */
function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Select a message of a specific type that matches the context.
 */
function selectMessage(
  ctx: MessageContext,
  type: MessageType,
  seed: number
): MotivationMessage | null {
  const templateMap = {
    encouragement: encouragementTemplates,
    guidance: guidanceTemplates,
    didYouKnow: didYouKnowTemplates,
    milestone: milestoneTemplates,
  }

  const templates = templateMap[type]
  const matching = templates.filter((t) => t.condition(ctx))

  if (matching.length === 0) return null

  const selected = matching[seed % matching.length]
  return {
    type,
    text: selected.message(ctx),
    icon: selected.icon,
  }
}

/**
 * Get a daily rotating message for the dashboard.
 * Uses date + userId as seed for deterministic daily rotation.
 * Each user sees the same message throughout the day.
 */
export function getDailyMessage(
  ctx: MessageContext,
  userId: string
): MotivationMessage | null {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const seed = hashSeed(`${today}-${userId}`)

  // Cycle through message types based on day
  const typeOrder: MessageType[] = [
    "encouragement",
    "didYouKnow",
    "milestone",
    "guidance",
  ]
  const typeIndex = seed % typeOrder.length
  const selectedType = typeOrder[typeIndex]

  // Try selected type first, then fallback to others
  const msg = selectMessage(ctx, selectedType, seed)
  if (msg) return msg

  // Fallback: try other types
  for (const fallbackType of typeOrder) {
    if (fallbackType === selectedType) continue
    const fallbackMsg = selectMessage(ctx, fallbackType, seed)
    if (fallbackMsg) return fallbackMsg
  }

  return null
}

/**
 * Get a contextual message for post-test display.
 * Selects based on latest test performance.
 */
export function getPostTestMessage(
  ctx: MessageContext
): MotivationMessage | null {
  const seed = Date.now()

  // Check for milestones first (most exciting)
  const milestone = selectMessage(ctx, "milestone", seed)
  if (milestone) return milestone

  // High performance: encouragement
  if (ctx.latestTestAccuracy !== null && ctx.latestTestAccuracy >= 70) {
    const msg = selectMessage(ctx, "encouragement", seed)
    if (msg) return msg
  }

  // Low performance: guidance
  if (ctx.latestTestAccuracy !== null && ctx.latestTestAccuracy < 50) {
    const guidance = selectMessage(ctx, "guidance", seed)
    if (guidance) return guidance
  }

  // Medium performance or fallback: encouragement then didYouKnow
  const encouragement = selectMessage(ctx, "encouragement", seed)
  if (encouragement) return encouragement

  return selectMessage(ctx, "didYouKnow", seed)
}
