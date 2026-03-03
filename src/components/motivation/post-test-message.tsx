import { fetchPostTestMotivation } from "@/lib/actions/motivation"
import type { MessageType } from "@/lib/motivation/types"
import {
  Trophy,
  Flame,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  Lightbulb,
  RefreshCw,
  Zap,
  Info,
  BarChart3,
  PieChart,
  GraduationCap,
  Sparkles,
  Brain,
  Clock,
  BookMarked,
  PartyPopper,
  Medal,
  Crown,
  Calendar,
  CalendarCheck,
  Rocket,
  Gem,
  ThumbsUp,
  RotateCcw,
  Scale,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Trophy,
  Flame,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  Lightbulb,
  RefreshCw,
  Zap,
  Info,
  BarChart3,
  PieChart,
  GraduationCap,
  Sparkles,
  Brain,
  Clock,
  BookMarked,
  PartyPopper,
  Medal,
  Crown,
  Calendar,
  CalendarCheck,
  Rocket,
  Gem,
  ThumbsUp,
  RotateCcw,
  Scale,
}

const typeBgColors: Record<MessageType, string> = {
  encouragement: "bg-green-50 dark:bg-green-950/30",
  guidance: "bg-amber-50 dark:bg-amber-950/30",
  didYouKnow: "bg-blue-50 dark:bg-blue-950/30",
  milestone: "bg-purple-50 dark:bg-purple-950/30",
}

const typeTextColors: Record<MessageType, string> = {
  encouragement: "text-green-800 dark:text-green-200",
  guidance: "text-amber-800 dark:text-amber-200",
  didYouKnow: "text-blue-800 dark:text-blue-200",
  milestone: "text-purple-800 dark:text-purple-200",
}

interface PostTestMessageProps {
  testAccuracy: number
  testCorrect: number
  testTotal: number
}

/**
 * Server Component that displays a contextual motivational message after a test.
 * Renders as a compact banner at the top of the results page.
 */
export async function PostTestMessage({
  testAccuracy,
  testCorrect,
  testTotal,
}: PostTestMessageProps) {
  const message = await fetchPostTestMotivation(
    testAccuracy,
    testCorrect,
    testTotal
  )

  if (!message) return null

  const Icon = iconMap[message.icon] ?? Sparkles

  return (
    <div
      className={`mb-4 flex items-center gap-3 rounded-lg px-4 py-3 ${typeBgColors[message.type]}`}
    >
      <Icon
        className={`h-5 w-5 shrink-0 ${typeTextColors[message.type]}`}
      />
      <p className={`text-sm ${typeTextColors[message.type]}`}>
        {message.text}
      </p>
    </div>
  )
}
