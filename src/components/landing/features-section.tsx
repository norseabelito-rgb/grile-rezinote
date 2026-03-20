"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Target,
  Clock,
  BarChart3,
  Award,
  Brain,
} from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Grile CS & CM",
    description:
      "Intrebari cu complement simplu si complement multiplu, exact ca la examenul real de rezidentiat.",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
    borderColor: "hover:border-emerald-500/20",
  },
  {
    icon: Target,
    title: "Punctaj oficial",
    description:
      "Calculare automata a scorului cu formula oficiala romaneasca, inclusiv reguli de anulare CM.",
    gradient: "from-teal-500/20 to-teal-500/5",
    iconColor: "text-teal-400",
    borderColor: "hover:border-teal-500/20",
  },
  {
    icon: Clock,
    title: "Simulare examen",
    description:
      "200 de intrebari cu cronometru in conditii identice cu examenul real. Pregatire autentica.",
    gradient: "from-cyan-500/20 to-cyan-500/5",
    iconColor: "text-cyan-400",
    borderColor: "hover:border-cyan-500/20",
  },
  {
    icon: BarChart3,
    title: "Statistici detaliate",
    description:
      "Urmareste-ti progresul pe capitole, identifica punctele slabe si vezi evolutia in timp.",
    gradient: "from-sky-500/20 to-sky-500/5",
    iconColor: "text-sky-400",
    borderColor: "hover:border-sky-500/20",
  },
  {
    icon: Award,
    title: "Comparatie admitere",
    description:
      "Afla daca ai fi fost admis pe baza datelor istorice reale de admitere pe ultimii 5 ani.",
    gradient: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
    borderColor: "hover:border-violet-500/20",
  },
  {
    icon: Brain,
    title: "Exersare pe capitole",
    description:
      "Practica intrebari dintr-un singur capitol sau amestecate din toate, fara limita de timp.",
    gradient: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
    borderColor: "hover:border-amber-500/20",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 sm:py-36">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-emerald-500/[0.03] blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6">
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
            Tot ce ai nevoie pentru{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              pregatire
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/40">
            Instrumente complete pentru a-ti maximiza sansele la admitere
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div
                className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-all duration-300 hover:bg-white/[0.04] ${feature.borderColor}`}
              >
                {/* Icon */}
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-white/40">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
