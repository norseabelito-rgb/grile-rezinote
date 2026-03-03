import { z } from "zod"

export const examDurationSchema = z.object({
  durationHours: z
    .number()
    .min(0.5, "Minimum 30 minute")
    .max(12, "Maximum 12 ore"),
})

export type ExamDurationInput = z.infer<typeof examDurationSchema>
