"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles } from "lucide-react"
import { AuroraBackground } from "@/components/motion/aurora-background"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-40">
      <AuroraBackground />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Badge
            variant="secondary"
            className="mb-8 gap-1.5 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary shimmer-border"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Pregatire pentru rezidentiat stomatologie
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          Pregateste-te pentru{" "}
          <span className="gradient-text-animated">
            Rezidentiat
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Simuleaza examene reale de rezidentiat si afla instant daca ai fi fost
          admis. Grile cu complement simplu si multiplu, punctaj oficial si
          comparatie cu pragurile istorice.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            size="lg"
            asChild
            className="min-h-[52px] w-full min-w-[220px] rounded-full gradient-primary border-0 text-white text-base shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 pulse-glow sm:w-auto"
          >
            <Link href="/signup">
              Incepe gratuit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="min-h-[52px] w-full min-w-[220px] rounded-full border-border/60 text-base hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 sm:w-auto"
          >
            <Link href="#features">Afla mai multe</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
