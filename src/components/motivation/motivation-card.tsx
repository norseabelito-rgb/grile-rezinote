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
    "border-emerald-500/20 bg-emerald-950/40 text-emerald-100",
  guidance:
    "border-amber-500/20 bg-amber-950/40 text-amber-100",
  didYouKnow:
    "border-teal-500/20 bg-teal-950/40 text-teal-100",
  milestone:
    "border-violet-500/20 bg-violet-950/40 text-violet-100",
}

const typeLabelStyles: Record<MessageType, string> = {
  encouragement: "bg-emerald-500/20 text-emerald-300",
  guidance: "bg-amber-500/20 text-amber-300",
  didYouKnow: "bg-teal-500/20 text-teal-300",
  milestone: "bg-violet-500/20 text-violet-300",
}

const typeIconStyles: Record<MessageType, string> = {
  encouragement: "bg-emerald-500/20 text-emerald-400",
  guidance: "bg-amber-500/20 text-amber-400",
  didYouKnow: "bg-teal-500/20 text-teal-400",
  milestone: "bg-violet-500/20 text-violet-400",
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
