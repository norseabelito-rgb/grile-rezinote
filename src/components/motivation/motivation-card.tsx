import { Card, CardContent } from "@/components/ui/card"
import { fetchDailyMotivation } from "@/lib/actions/motivation"
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

const typeLabels: Record<MessageType, string> = {
  encouragement: "Incurajare",
  guidance: "Sfat",
  didYouKnow: "Stiai ca?",
  milestone: "Reper",
}

const typeStyles: Record<MessageType, string> = {
  encouragement:
    "border-emerald-600/15 bg-emerald-50 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-100",
  guidance:
    "border-amber-600/15 bg-amber-50 text-amber-900 dark:border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-100",
  didYouKnow:
    "border-teal-600/15 bg-teal-50 text-teal-900 dark:border-teal-500/20 dark:bg-teal-950/40 dark:text-teal-100",
  milestone:
    "border-violet-600/15 bg-violet-50 text-violet-900 dark:border-violet-500/20 dark:bg-violet-950/40 dark:text-violet-100",
}

const typeLabelStyles: Record<MessageType, string> = {
  encouragement: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  guidance: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  didYouKnow: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
  milestone: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
}

const typeIconStyles: Record<MessageType, string> = {
  encouragement: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  guidance: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  didYouKnow: "bg-teal-100 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400",
  milestone: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
}

/**
 * Server Component that fetches and displays a daily motivational message.
 * Renders on the dashboard overview page.
 */
export async function MotivationCard() {
  const message = await fetchDailyMotivation()

  if (!message) return null

  const Icon = iconMap[message.icon] ?? Sparkles

  return (
    <Card className={`overflow-hidden ${typeStyles[message.type]}`}>
      <CardContent className="flex items-center gap-4 py-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${typeIconStyles[message.type]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${typeLabelStyles[message.type]}`}>
          {typeLabels[message.type]}
        </span>
      </CardContent>
    </Card>
  )
}
