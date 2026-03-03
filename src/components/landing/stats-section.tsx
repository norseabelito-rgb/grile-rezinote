"use client"

import { FadeIn } from "@/components/motion/fade-in"
import { AnimatedCounter } from "@/components/motion/animated-counter"
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children"

const stats = [
  {
    value: 200,
    suffix: "",
    label: "intrebari per simulare",
    description: "Identic cu examenul real",
  },
  {
    value: 950,
    suffix: "",
    label: "punctaj maxim posibil",
    description: "50 CS x 4 + 150 CM x 5",
  },
  {
    value: 5,
    suffix: "+",
    label: "ani de date istorice",
    description: "Praguri reale de admitere",
  },
  {
    value: 100,
    suffix: "%",
    label: "formula oficiala",
    description: "Scoring romanesc autentic",
  },
]

export function StatsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 gradient-surface" />
      <div className="mx-auto max-w-5xl px-4">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pregatire bazata pe date reale
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Folosim date autentice din examenele de rezidentiat din Romania
          </p>
        </FadeIn>

        <StaggerChildren
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
          staggerDelay={0.12}
        >
          {stats.map((stat) => (
            <StaggerItem key={stat.label} className="text-center">
              <div className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                <AnimatedCounter
                  value={stat.value}
                  className="gradient-text-animated"
                />
                <span className="gradient-text-animated">{stat.suffix}</span>
              </div>
              <div className="mt-2 text-sm font-bold uppercase tracking-wider text-foreground">
                {stat.label}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.description}
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
