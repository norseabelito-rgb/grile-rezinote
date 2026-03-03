import type { MessageContext } from "./types"

interface Template {
  condition: (ctx: MessageContext) => boolean
  message: (ctx: MessageContext) => string
  icon: string
}

// === ENCOURAGEMENT: shown when user performs well ===
export const encouragementTemplates: Template[] = [
  {
    condition: (ctx) => ctx.accuracyPct >= 80,
    message: (ctx) =>
      `Excelent! Ai o acuratete de ${ctx.accuracyPct}% \u2014 esti pe drumul cel bun spre rezidentiat!`,
    icon: "Trophy",
  },
  {
    condition: (ctx) => ctx.streak >= 7,
    message: (ctx) =>
      `${ctx.streak} zile consecutive de invatare! O saptamana intreaga \u2014 disciplina ta este admirabila.`,
    icon: "Flame",
  },
  {
    condition: (ctx) => ctx.streak >= 3,
    message: (ctx) =>
      `${ctx.streak} zile consecutive de invatare! Consistenta bate talentul.`,
    icon: "Flame",
  },
  {
    condition: (ctx) =>
      ctx.latestTestAccuracy !== null && ctx.latestTestAccuracy >= 80,
    message: (ctx) =>
      `Felicitari! Ai raspuns corect la ${ctx.latestTestCorrect} din ${ctx.latestTestTotal} intrebari la ultimul test. Performanta excelenta!`,
    icon: "Star",
  },
  {
    condition: (ctx) =>
      ctx.latestTestAccuracy !== null && ctx.latestTestAccuracy >= 60,
    message: (ctx) =>
      `Bine lucrat! ${ctx.latestTestCorrect} raspunsuri corecte din ${ctx.latestTestTotal} la ultimul test. Continua asa!`,
    icon: "ThumbsUp",
  },
  {
    condition: (ctx) => ctx.totalQuestions >= 500,
    message: (ctx) =>
      `Ai raspuns la peste ${Math.floor(ctx.totalQuestions / 100) * 100} intrebari! Fiecare intrebare te aduce mai aproape de reusita.`,
    icon: "TrendingUp",
  },
  {
    condition: (ctx) => ctx.totalQuestions >= 100,
    message: (ctx) =>
      `Ai trecut de ${Math.floor(ctx.totalQuestions / 100) * 100} intrebari rezolvate. Efortul tau se va vedea la examen!`,
    icon: "TrendingUp",
  },
  {
    condition: (ctx) =>
      ctx.strongestChapter !== null &&
      ctx.strongestChapter.accuracyPct >= 85,
    message: (ctx) =>
      `Ai ${ctx.strongestChapter!.accuracyPct}% acuratete la ${ctx.strongestChapter!.name} \u2014 un capitol pe care il stapanesti!`,
    icon: "Award",
  },
  {
    condition: (ctx) =>
      ctx.totalSimulations > 0 &&
      ctx.lastSimScore !== null &&
      ctx.lastSimMaxScore !== null &&
      ctx.lastSimScore / ctx.lastSimMaxScore >= 0.7,
    message: () =>
      `Rezultat excelent la ultima simulare! Pregatirea ta arata bine pentru examenul real.`,
    icon: "GraduationCap",
  },
]

// === GUIDANCE: shown when user has areas needing improvement ===
export const guidanceTemplates: Template[] = [
  {
    condition: (ctx) =>
      ctx.weakestChapter !== null && ctx.weakestChapter.accuracyPct < 40,
    message: (ctx) =>
      `Capitolul "${ctx.weakestChapter!.name}" are nevoie de atentie \u2014 ai ${ctx.weakestChapter!.accuracyPct}% acuratete. Un test focusat poate ajuta!`,
    icon: "BookOpen",
  },
  {
    condition: (ctx) =>
      ctx.weakestChapter !== null && ctx.weakestChapter.accuracyPct < 60,
    message: (ctx) =>
      `Concentreaza-te pe "${ctx.weakestChapter!.name}" \u2014 e capitolul cu cel mai mult potential de crestere!`,
    icon: "Lightbulb",
  },
  {
    condition: (ctx) => ctx.accuracyPct < 50 && ctx.totalTests >= 3,
    message: (ctx) =>
      `Acuratetea ta generala e ${ctx.accuracyPct}%. Incearca teste pe capitole individuale pentru a identifica zonele slabe.`,
    icon: "Target",
  },
  {
    condition: (ctx) => ctx.accuracyPct < 60 && ctx.totalTests >= 5,
    message: () =>
      `Revizuieste intrebarile gresite din testele anterioare \u2014 e cel mai eficient mod de a invata din greseli.`,
    icon: "RotateCcw",
  },
  {
    condition: (ctx) =>
      ctx.totalSimulations > 0 &&
      ctx.lastSimScore !== null &&
      ctx.lastSimMaxScore !== null &&
      ctx.lastSimScore / ctx.lastSimMaxScore < 0.5,
    message: () =>
      `Ultima simulare a fost o provocare. Revizuieste intrebarile gresite si incearca din nou \u2014 progresul vine cu practica!`,
    icon: "RefreshCw",
  },
  {
    condition: (ctx) => ctx.streak === 0 && ctx.totalTests > 0,
    message: () =>
      `Ai pierdut seria de invatare. Un singur test astazi o reporneste!`,
    icon: "Zap",
  },
  {
    condition: (ctx) =>
      ctx.weakestChapter !== null &&
      ctx.strongestChapter !== null &&
      ctx.strongestChapter.accuracyPct - ctx.weakestChapter.accuracyPct > 30,
    message: (ctx) =>
      `Diferenta intre cel mai bun capitol (${ctx.strongestChapter!.accuracyPct}%) si cel mai slab (${ctx.weakestChapter!.accuracyPct}%) e mare. Echilibreaza pregatirea!`,
    icon: "Scale",
  },
]

// === DID YOU KNOW: rotating statistics and fun facts ===
export const didYouKnowTemplates: Template[] = [
  {
    condition: (ctx) => ctx.totalQuestions > 0,
    message: (ctx) =>
      `Stiai ca ai raspuns la ${ctx.totalQuestions} intrebari pana acum? Continua asa!`,
    icon: "Info",
  },
  {
    condition: (ctx) => ctx.totalTests >= 5,
    message: (ctx) =>
      `Stiai ca ai completat ${ctx.totalTests} teste? Fiecare test consolideaza cunostintele tale!`,
    icon: "BarChart3",
  },
  {
    condition: (ctx) => ctx.accuracyPct > 0,
    message: (ctx) =>
      `Stiai ca acuratetea medie la rezidentiat este in jur de 65%? Tu ai ${ctx.accuracyPct}%!`,
    icon: "PieChart",
  },
  {
    condition: (ctx) => ctx.totalSimulations > 0,
    message: (ctx) =>
      `Stiai ca ai completat ${ctx.totalSimulations} ${ctx.totalSimulations === 1 ? "simulare" : "simulari"} de examen? Experienta conteaza!`,
    icon: "GraduationCap",
  },
  {
    condition: () => true,
    message: () =>
      `Stiai ca studentii care practica zilnic au cu 40% mai multe sanse de reusita la examen?`,
    icon: "Sparkles",
  },
  {
    condition: () => true,
    message: () =>
      `Stiai ca repetitia spatiata e cea mai eficienta metoda de memorare? Revizuieste intrebarile gresite periodic!`,
    icon: "Brain",
  },
  {
    condition: (ctx) => ctx.totalTests >= 10,
    message: (ctx) =>
      `Stiai ca ai petrecut cel putin ${ctx.totalTests * 15} minute pregatindu-te? Fiecare minut conteaza!`,
    icon: "Clock",
  },
  {
    condition: () => true,
    message: () =>
      `Stiai ca in medie un student rezolva 2000-3000 de grile inainte de rezidentiat? Fiecare intrebare te pregateste!`,
    icon: "BookMarked",
  },
]

// === MILESTONE: celebrate achievements ===
export const milestoneTemplates: Template[] = [
  {
    condition: (ctx) => ctx.totalTests === 1,
    message: () =>
      `Primul test completat! Ai facut primul pas spre rezidentiat.`,
    icon: "PartyPopper",
  },
  {
    condition: (ctx) => ctx.totalTests === 10,
    message: () => `10 teste completate! Esti pe drumul cel bun.`,
    icon: "Medal",
  },
  {
    condition: (ctx) => ctx.totalTests === 25,
    message: () =>
      `25 de teste finalizate! Dedicarea ta este impresionanta.`,
    icon: "Medal",
  },
  {
    condition: (ctx) => ctx.totalTests === 50,
    message: () =>
      `50 de teste! Jumatate de centenar de teste \u2014 un reper remarcabil!`,
    icon: "Crown",
  },
  {
    condition: (ctx) => ctx.totalQuestions >= 500 && ctx.totalQuestions < 600,
    message: () =>
      `Ai trecut de 500 de intrebari! Un reper impresionant in pregatirea ta.`,
    icon: "Crown",
  },
  {
    condition: (ctx) => ctx.totalQuestions >= 1000 && ctx.totalQuestions < 1100,
    message: () =>
      `1000 de intrebari rezolvate! Esti un adevarat profesionist al pregatirii!`,
    icon: "Crown",
  },
  {
    condition: (ctx) => ctx.streak >= 7 && ctx.streak < 8,
    message: (ctx) =>
      `O saptamana intreaga de invatare consecutiva! ${ctx.streak} zile \u2014 impresionant!`,
    icon: "Calendar",
  },
  {
    condition: (ctx) => ctx.streak >= 14 && ctx.streak < 15,
    message: (ctx) =>
      `Doua saptamani consecutive! ${ctx.streak} zile de studiu neintrerupt \u2014 extraordinar!`,
    icon: "Calendar",
  },
  {
    condition: (ctx) => ctx.streak >= 30 && ctx.streak < 31,
    message: (ctx) =>
      `O luna intreaga de studiu zilnic! ${ctx.streak} zile \u2014 esti un exemplu de dedicare!`,
    icon: "CalendarCheck",
  },
  {
    condition: (ctx) => ctx.totalSimulations === 1,
    message: () =>
      `Prima simulare de examen completata! Acum stii la ce sa te astepti.`,
    icon: "Rocket",
  },
  {
    condition: (ctx) => ctx.totalSimulations === 5,
    message: () =>
      `5 simulari de examen! Cu fiecare simulare, te apropii de succes.`,
    icon: "Rocket",
  },
  {
    condition: (ctx) => ctx.accuracyPct >= 90 && ctx.totalTests >= 5,
    message: (ctx) =>
      `Acuratete de ${ctx.accuracyPct}% dupa ${ctx.totalTests} teste! Pregatirea ta este la nivel de excelenta!`,
    icon: "Gem",
  },
]
