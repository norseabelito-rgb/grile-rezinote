"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-teal-500/[0.05] blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.04] blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 pt-32 pb-20 text-center">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-5 py-2 text-sm text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Platforma de pregatire pentru rezidentiat stomatologie
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="text-white">Pregateste-te</span>
          <br />
          <span className="text-white">pentru </span>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Rezidentiat
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/50 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          Simuleaza examene reale cu grile CS si CM, punctaj oficial si
          comparatie cu pragurile istorice de admitere. Tot ce ai nevoie
          intr-un singur loc.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            size="lg"
            asChild
            className="group min-h-[56px] w-full min-w-[240px] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-base font-semibold text-white shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:brightness-110 active:scale-[0.98] transition-all duration-300 sm:w-auto"
          >
            <Link href="/signup">
              Incepe gratuit
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="min-h-[56px] w-full min-w-[240px] rounded-full border-white/10 bg-white/[0.03] text-base text-white/80 backdrop-blur-sm hover:bg-white/[0.06] hover:text-white hover:border-white/20 transition-all duration-300 sm:w-auto"
          >
            <Link href="#features">Afla mai multe</Link>
          </Button>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-6 text-sm text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Fara card de credit &middot; Acces instant &middot; 7 zile gratuit
        </motion.p>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent" />
    </section>
  )
}
