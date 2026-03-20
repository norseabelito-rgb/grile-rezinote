"use client"

import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/motion/animated-counter"

const stats = [
  {
    value: 200,
    suffix: "",
    label: "intrebari per simulare",
    detail: "Identic cu examenul real",
  },
  {
    value: 950,
    suffix: "",
    label: "punctaj maxim posibil",
    detail: "50 CS + 150 CM",
  },
  {
    value: 5,
    suffix: "+",
    label: "ani de date istorice",
    detail: "Praguri reale de admitere",
  },
  {
    value: 100,
    suffix: "%",
    label: "formula oficiala",
    detail: "Scoring romanesc autentic",
  },
]

export function StatsSection() {
  return (
    <section className="relative py-28 sm:py-36">
      {/* Separator line */}
      <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Subtle glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[300px] w-[600px] rounded-full bg-teal-500/[0.03] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pregatire bazata pe{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              date reale
            </span>
          </h2>
          <p className="mt-5 text-lg text-white/40">
            Folosim date autentice din examenele de rezidentiat din Romania
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div
                className="text-4xl font-extrabold tracking-tight sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </span>
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-white/60">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-white/30">
                {stat.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
