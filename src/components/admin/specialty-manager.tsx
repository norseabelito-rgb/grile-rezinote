"use client"

import { useState } from "react"
import { Plus, Pencil, Archive, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createSpecialty,
  updateSpecialty,
  archiveSpecialty,
  restoreSpecialty,
} from "@/lib/actions/admission"

interface SpecialtyData {
  id: string
  name: string
  description: string | null
  sortOrder: number
  archivedAt: Date | null
  createdAt: Date
}

interface SpecialtyManagerProps {
  specialties: SpecialtyData[]
}

export function SpecialtyManager({
  specialties: initialSpecialties,
}: SpecialtyManagerProps) {
  const [items, setItems] = useState(initialSpecialties)
  const [showArchived, setShowArchived] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editSpecialty, setEditSpecialty] = useState<SpecialtyData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const activeSpecialties = items.filter((s) => !s.archivedAt)
  const archivedSpecialties = items.filter((s) => s.archivedAt)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setErrors({})

    try {
      const result = editSpecialty
        ? await updateSpecialty(editSpecialty.id, formData)
        : await createSpecialty(formData)

      if (result && "error" in result && result.error) {
        setErrors(result.error as Record<string, string[]>)
      } else {
        setFormOpen(false)
        setEditSpecialty(null)
        // Refresh page to get updated data
        window.location.reload()
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleArchive(id: string) {
    if (!confirm("Esti sigur ca vrei sa arhivezi aceasta specialitate?")) return
    await archiveSpecialty(id)
    setItems((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, archivedAt: new Date() } : s
      )
    )
  }

  async function handleRestore(id: string) {
    await restoreSpecialty(id)
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, archivedAt: null } : s))
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => {
            setEditSpecialty(null)
            setFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adauga Specialitate
        </Button>
        {archivedSpecialties.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived
              ? "Ascunde arhivate"
              : `Arhivate (${archivedSpecialties.length})`}
          </Button>
        )}
      </div>

      {activeSpecialties.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Nicio specialitate adaugata. Adauga prima specialitate pentru a
            incepe.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {activeSpecialties.map((specialty) => (
            <div
              key={specialty.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-4 hover:bg-accent/50"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{specialty.name}</h3>
                {specialty.description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {specialty.description}
                  </p>
                )}
              </div>

              <Badge variant="secondary" className="text-xs">
                #{specialty.sortOrder + 1}
              </Badge>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditSpecialty(specialty)
                    setFormOpen(true)
                  }}
                  title="Editeaza"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleArchive(specialty.id)}
                  title="Arhiveaza"
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showArchived && archivedSpecialties.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Specialitati arhivate
          </h3>
          {archivedSpecialties.map((specialty) => (
            <div
              key={specialty.id}
              className="flex items-center gap-3 rounded-lg border border-dashed p-4 opacity-60"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{specialty.name}</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRestore(specialty.id)}
              >
                <RotateCcw className="mr-2 h-3 w-3" />
                Restaureaza
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={formOpen}
        onOpenChange={(o) => {
          if (!o) {
            setFormOpen(false)
            setEditSpecialty(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editSpecialty ? "Editeaza Specialitate" : "Specialitate Noua"}
            </DialogTitle>
          </DialogHeader>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nume</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editSpecialty?.name ?? ""}
                placeholder="ex: Ortodontie"
                required
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descriere (optional)</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editSpecialty?.description ?? ""}
                placeholder="Descriere scurta a specialitatii..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description[0]}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormOpen(false)
                  setEditSpecialty(null)
                }}
              >
                Anuleaza
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Se salveaza..."
                  : editSpecialty
                    ? "Salveaza"
                    : "Creeaza"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
