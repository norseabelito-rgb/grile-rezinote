"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "Ce tip de intrebari sunt disponibile?",
    answer:
      "Platforma contine intrebari cu complement simplu (CS) si complement multiplu (CM), exact ca la examenul real de rezidentiat stomatologie. Fiecare intrebare are 5 variante de raspuns (A-E).",
  },
  {
    question: "Cum se calculeaza scorul?",
    answer:
      "Folosim formula oficiala romaneasca de punctare. Pentru CS: 4 puncte per raspuns corect. Pentru CM: punctaj per optiune (1 punct pentru fiecare optiune corecta selectata SAU optiune gresita neselectata), cu anulare la sub 2 sau peste 4 selectii. Scorul maxim este 950 puncte.",
  },
  {
    question: "Pot vedea daca as fi fost admis?",
    answer:
      "Da! Dupa fiecare simulare completa, platforma compara scorul tau cu pragurile istorice de admitere pe ultimii 5 ani, pe fiecare specialitate. Vei vedea exact la ce specialitati ai fi fost admis.",
  },
  {
    question: "Functioneaza pe telefon?",
    answer:
      "Da, platforma este optimizata complet pentru dispozitive mobile. Poti instala aplicatia direct din browser pe ecranul principal al telefonului pentru acces rapid.",
  },
  {
    question: "Cate intrebari sunt intr-o simulare?",
    answer:
      "O simulare completa contine 200 de intrebari, exact ca la examenul real: primele 50 sunt CS (complement simplu), iar urmatoarele 150 sunt CM (complement multiplu).",
  },
  {
    question: "Pot exersa pe capitole individuale?",
    answer:
      "Da! Pe langa simularea completa a examenului, poti exersa intrebari dintr-un singur capitol sau amestecate din mai multe capitole, fara limita de timp.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative py-28 sm:py-36">
      {/* Separator line */}
      <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Intrebari frecvente
          </h2>
          <p className="mt-5 text-lg text-white/40">
            Raspunsuri la cele mai comune intrebari
          </p>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:bg-white/[0.03]">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="pr-4 text-[15px] font-medium text-white/90">
                    {faq.question}
                  </span>
                  <Plus
                    className={`h-4 w-4 shrink-0 text-white/30 transition-transform duration-300 ${
                      openIndex === index ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/[0.04] px-6 pb-5 pt-4">
                        <p className="text-[15px] leading-relaxed text-white/40">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
