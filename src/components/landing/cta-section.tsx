"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="relative py-28 sm:py-36">
      {/* Separator line */}
      <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/[0.06]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.08] via-transparent to-teal-500/[0.06]" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-emerald-500/[0.08] blur-[100px]" />

          {/* Grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative p-12 text-center sm:p-20">
            <h2
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Incepe pregatirea{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                acum
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lg text-white/40">
              Nu lasa examenul de rezidentiat la voia intamplarii. Pregateste-te
              cu grile reale, scoring oficial si date istorice de admitere.
            </p>

            <div className="mt-10">
              <Button
                size="lg"
                asChild
                className="group min-h-[56px] min-w-[280px] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-base font-semibold text-white shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:brightness-110 active:scale-[0.98] transition-all duration-300"
              >
                <Link href="/signup">
                  Creeaza cont gratuit
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <p className="mt-5 text-sm text-white/25">
              Fara card de credit &middot; Acces instant
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
