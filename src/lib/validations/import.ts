import { z } from "zod"

/**
 * Import/Export CSV/Excel column structure:
 * id (optional), chapter_name, question_text, type (CS/CM),
 * option_a, option_b, option_c, option_d, option_e,
 * correct_answers (comma-separated: "A,C,E"),
 * source_book (optional), source_page (optional)
 */

const validLabels = ["A", "B", "C", "D", "E"]

export const importRowSchema = z
  .object({
    id: z.string().optional().or(z.literal("")),
    chapter_name: z.string().min(1, "Numele capitolului este obligatoriu"),
    question_text: z.string().min(1, "Textul intrebarii este obligatoriu"),
    type: z.enum(["CS", "CM"], {
      message: 'Tipul trebuie sa fie "CS" sau "CM"',
    }),
    option_a: z.string().min(1, "Optiunea A este obligatorie"),
    option_b: z.string().min(1, "Optiunea B este obligatorie"),
    option_c: z.string().min(1, "Optiunea C este obligatorie"),
    option_d: z.string().min(1, "Optiunea D este obligatorie"),
    option_e: z.string().min(1, "Optiunea E este obligatorie"),
    correct_answers: z
      .string()
      .min(1, "Raspunsurile corecte sunt obligatorii")
      .refine(
        (val) => {
          const answers = val
            .split(",")
            .map((a) => a.trim().toUpperCase())
          return answers.every((a) => validLabels.includes(a))
        },
        {
          message:
            "Raspunsurile corecte trebuie sa fie litere separate prin virgula (ex: A,C,E)",
        }
      ),
    source_book: z.string().optional().or(z.literal("")),
    source_page: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      const answers = data.correct_answers
        .split(",")
        .map((a) => a.trim().toUpperCase())
      if (data.type === "CS") return answers.length === 1
      if (data.type === "CM") return answers.length >= 2
      return true
    },
    {
      message:
        "CS trebuie sa aiba exact 1 raspuns corect, CM cel putin 2",
      path: ["correct_answers"],
    }
  )

export type ImportRow = z.infer<typeof importRowSchema>

export interface ImportError {
  row: number
  message: string
}

export interface ImportResult {
  imported: number
  updated: number
  errors: ImportError[]
}

export const IMPORT_COLUMNS = [
  "id",
  "chapter_name",
  "question_text",
  "type",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "option_e",
  "correct_answers",
  "source_book",
  "source_page",
] as const
