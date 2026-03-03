"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  createAdmissionEntry,
  updateAdmissionEntry,
  deleteAdmissionEntry,
} from "@/lib/actions/admission"

interface AdmissionEntry {
  id: string
  specialtyId: string
  specialtyName: string
  year: number
  thresholdScore: number
  availableSpots: number
}

interface SpecialtyOption {
  id: string
  name: string
}

interface AdmissionDataTableProps {
  entries: AdmissionEntry[]
  specialties: SpecialtyOption[]
}

export function AdmissionDataTable({
  entries: initialEntries,
  specialties,
}: AdmissionDataTableProps) {
  const [entries, setEntries] = useState(initialEntries)
  const [formOpen, setFormOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<AdmissionEntry | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  // Filter state
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all")
  const [filterYear, setFilterYear] = useState<string>("all")

  const years = [...new Set(entries.map((e) => e.year))].sort((a, b) => b - a)

  const filteredEntries = entries.filter((e) => {
    if (filterSpecialty !== "all" && e.specialtyId !== filterSpecialty)
      return false
    if (filterYear !== "all" && e.year !== parseInt(filterYear)) return false
    return true
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      specialtyId: formData.get("specialtyId") as string,
      year: parseInt(formData.get("year") as string),
      thresholdScore: parseInt(formData.get("thresholdScore") as string),
      availableSpots: parseInt(formData.get("availableSpots") as string),
    }

    try {
      const result = editEntry
        ? await updateAdmissionEntry(editEntry.id, data)
        : await createAdmissionEntry(data)

      if (result && "error" in result && result.error) {
        setErrors(result.error as Record<string, string[]>)
      } else {
        setFormOpen(false)
        setEditEntry(null)
        window.location.reload()
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Esti sigur ca vrei sa stergi aceasta intrare?")) return
    await deleteAdmissionEntry(id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Actions row */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => {
            setEditEntry(null)
            setFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adauga Intrare
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="w-64">
          <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="Toate specialitatile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate specialitatile</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-40">
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger>
              <SelectValue placeholder="Toti anii" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toti anii</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {filteredEntries.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {entries.length === 0
              ? "Nicio intrare de admitere. Adaugati date sau importati din CSV/Excel."
              : "Niciun rezultat pentru filtrele selectate."}
          </p>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Specialitate</TableHead>
                <TableHead className="w-24">An</TableHead>
                <TableHead className="w-32">Prag admitere</TableHead>
                <TableHead className="w-32">Locuri disponibile</TableHead>
                <TableHead className="w-24">Actiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.specialtyName}
                  </TableCell>
                  <TableCell>{entry.year}</TableCell>
                  <TableCell>{entry.thresholdScore}</TableCell>
                  <TableCell>{entry.availableSpots}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditEntry(entry)
                          setFormOpen(true)
                        }}
                        title="Editeaza"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                        title="Sterge"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={formOpen}
        onOpenChange={(o) => {
          if (!o) {
            setFormOpen(false)
            setEditEntry(null)
            setErrors({})
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editEntry ? "Editeaza Intrare" : "Intrare Noua"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialtyId">Specialitate</Label>
              <Select
                name="specialtyId"
                defaultValue={editEntry?.specialtyId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteaza specialitatea" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialtyId && (
                <p className="text-sm text-destructive">
                  {errors.specialtyId[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">An</Label>
              <Input
                id="year"
                name="year"
                type="number"
                min={2000}
                max={2100}
                defaultValue={editEntry?.year ?? new Date().getFullYear()}
                required
              />
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thresholdScore">Prag admitere (0-950)</Label>
              <Input
                id="thresholdScore"
                name="thresholdScore"
                type="number"
                min={0}
                max={950}
                defaultValue={editEntry?.thresholdScore ?? ""}
                placeholder="ex: 750"
                required
              />
              {errors.thresholdScore && (
                <p className="text-sm text-destructive">
                  {errors.thresholdScore[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableSpots">Locuri disponibile</Label>
              <Input
                id="availableSpots"
                name="availableSpots"
                type="number"
                min={1}
                defaultValue={editEntry?.availableSpots ?? ""}
                placeholder="ex: 25"
                required
              />
              {errors.availableSpots && (
                <p className="text-sm text-destructive">
                  {errors.availableSpots[0]}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormOpen(false)
                  setEditEntry(null)
                  setErrors({})
                }}
              >
                Anuleaza
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Se salveaza..."
                  : editEntry
                    ? "Salveaza"
                    : "Adauga"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
