import { z } from "zod"

export const chapterSchema = z.object({
  name: z
    .string()
    .min(1, "Numele capitolului este obligatoriu")
    .max(200, "Numele capitolului poate avea maxim 200 de caractere"),
  description: z
    .string()
    .max(1000, "Descrierea poate avea maxim 1000 de caractere")
    .optional()
    .or(z.literal("")),
})

export type ChapterInput = z.infer<typeof chapterSchema>
