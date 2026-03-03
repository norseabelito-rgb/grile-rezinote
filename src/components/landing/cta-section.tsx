"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { FadeIn } from "@/components/motion/fade-in"

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl gradient-hero p-12 text-center text-white shadow-2xl shadow-primary-500/25 sm:p-16">
            {/* Animated radial overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_70%)]" />
            {/* Shimmer sweep */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer-slide 4s ease-in-out infinite",
                }}
              />
            </div>
            <div className="relative">
              <motion.h2
                className="text-3xl font-bold tracking-tight sm:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Incepe pregatirea acum
              </motion.h2>

              <motion.p
                className="mx-auto mt-4 max-w-xl text-lg text-white/80"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Nu lasa examenul de rezidentiat la voia intamplarii. Pregateste-te cu
                grile reale, scoring oficial si date istorice de admitere.
              </motion.p>

              <motion.div
                className="mt-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <Button
                  size="lg"
                  asChild
                  className="min-h-[52px] min-w-[260px] rounded-full bg-white text-base font-semibold text-primary-700 shadow-xl hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <Link href="/signup">
                    Creeaza cont gratuit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.p
                className="mt-4 text-sm text-white/60"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Fara card de credit. Acces instant.
              </motion.p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
