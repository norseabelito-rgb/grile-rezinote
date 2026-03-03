"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateExamDuration } from "@/lib/actions/admin-settings"

interface ExamSettingsFormProps {
  currentDurationSeconds: number
}

export function ExamSettingsForm({
  currentDurationSeconds,
}: ExamSettingsFormProps) {
  const [durationHours, setDurationHours] = useState(
    currentDurationSeconds / 3600
  )
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setMessage(null)

    try {
      const result = await updateExamDuration(formData)

      if (result && "error" in result) {
        setMessage({ type: "error", text: result.error ?? "Date invalide" })
      } else if (result && "success" in result) {
        setMessage({
          type: "success",
          text: `Durata actualizata: ${result.durationSeconds / 3600} ore (${result.durationSeconds} secunde)`,
        })
      }
    } catch {
      setMessage({ type: "error", text: "Eroare la salvare" })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="durationHours">Durata examen (ore)</Label>
        <Input
          id="durationHours"
          name="durationHours"
          type="number"
          step="0.5"
          min="0.5"
          max="12"
          value={durationHours}
          onChange={(e) => setDurationHours(parseFloat(e.target.value) || 0)}
          className="max-w-xs"
        />
        <p className="text-sm text-muted-foreground">
          Implicit: 4 ore (14400 secunde). Minim 30 min, maxim 12 ore.
        </p>
      </div>

      <div className="text-sm text-muted-foreground">
        Valoare curenta:{" "}
        <strong>
          {currentDurationSeconds / 3600} ore ({currentDurationSeconds} secunde)
        </strong>
      </div>

      {message && (
        <div
          className={
            message.type === "success"
              ? "rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300"
              : "rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
          }
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Se salveaza..." : "Salveaza"}
      </Button>
    </form>
  )
}
