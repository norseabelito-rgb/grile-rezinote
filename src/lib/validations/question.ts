import { z } from "zod"

export const optionSchema = z.object({
  label: z.string(),
  text: z.string().min(1, "Textul optiunii este obligatoriu"),
  isCorrect: z.boolean(),
})

export const questionSchema = z
  .object({
    chapterId: z.string().min(1, "Selecteaza un capitol"),
    text: z
      .string()
      .min(1, "Textul intrebarii este obligatoriu")
      .max(2000, "Textul intrebarii poate avea maxim 2000 de caractere"),
    type: z.enum(["CS", "CM"]),
    options: z
      .array(optionSchema)
      .length(5, "Trebuie exact 5 optiuni (A-E)"),
    sourceBook: z.string().optional().or(z.literal("")),
    sourcePage: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      const correctCount = data.options.filter((o) => o.isCorrect).length
      if (data.type === "CS") return correctCount === 1
      if (data.type === "CM") return correctCount >= 2
      return true
    },
    {
      message:
        "Intrebarile CS trebuie sa aiba exact 1 raspuns corect, iar CM cel putin 2",
      path: ["options"],
    }
  )

export type QuestionInput = z.infer<typeof questionSchema>
export type OptionInput = z.infer<typeof optionSchema>
