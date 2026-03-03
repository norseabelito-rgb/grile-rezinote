export type MessageType = "encouragement" | "guidance" | "didYouKnow" | "milestone"

export interface MotivationMessage {
  type: MessageType
  text: string
  icon: string // lucide icon name
}

export interface MessageContext {
  // From dashboard stats
  totalTests: number
  totalQuestions: number
  accuracyPct: number
  streak: number
  // Weakest/strongest chapter info
  weakestChapter: { name: string; accuracyPct: number } | null
  strongestChapter: { name: string; accuracyPct: number } | null
  // Simulation-specific
  lastSimScore: number | null
  lastSimMaxScore: number | null
  totalSimulations: number
  // For post-test context
  latestTestAccuracy: number | null
  latestTestCorrect: number | null
  latestTestTotal: number | null
}
