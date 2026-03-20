"use client"

import { motion } from "framer-motion"
import { UserPlus, BookOpen, FileText, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Creeaza cont",
    description:
      "Inregistreaza-te rapid cu email si parola. Configureaza-ti profilul si anul de studiu.",
  },
  {
    icon: BookOpen,
    number: "02",
    title: "Exerseaza",
    description:
      "Rezolva grile pe capitole individuale sau amestecate, fara limita de timp.",
  },
  {
    icon: FileText,
    number: "03",
    title: "Simuleaza",
    description:
      "Sustine un examen complet cu 200 de intrebari si cronometru. Scor oficial.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Compara",
    description:
      "Vezi daca ai fi fost admis comparand scorul tau cu pragurile istorice.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-28 sm:py-36">
      {/* Separator line */}
      <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="mx-auto max-w-5xl px-6">
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
            Cum functioneaza
          </h2>
          <p className="mt-5 text-lg text-white/40">
            Patru pasi simpli catre pregatirea eficienta
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-6 translate-x-3 bg-gradient-to-r from-white/10 to-transparent lg:block" />
              )}

              {/* Step number */}
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <step.icon className="h-8 w-8 text-emerald-400" />
              </div>

              <div
                className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400/70"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Pasul {step.number}
              </div>

              <h3
                className="mb-2 text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.title}
              </h3>

              <p className="text-sm leading-relaxed text-white/40">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
