"use client"

import { useState } from "react"
import { Download, Loader2, FileText, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  exportQuestionsCSV,
  exportQuestionsExcel,
} from "@/lib/actions/import-export"
import Papa from "papaparse"

interface Chapter {
  id: string
  name: string
}

interface Props {
  chapters: Chapter[]
}

export function ExportControls({ chapters }: Props) {
  const [selectedChapter, setSelectedChapter] = useState<string>("all")
  const [isExportingCSV, setIsExportingCSV] = useState(false)
  const [isExportingExcel, setIsExportingExcel] = useState(false)

  const chapterId =
    selectedChapter === "all" ? undefined : selectedChapter

  const selectedChapterName =
    selectedChapter === "all"
      ? "toate"
      : chapters.find((c) => c.id === selectedChapter)?.name ?? "export"

  const getFileName = (ext: string) => {
    const date = new Date().toISOString().split("T")[0]
    const sanitizedName = selectedChapterName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
    return `intrebari_${sanitizedName}_${date}.${ext}`
  }

  const handleExportCSV = async () => {
    setIsExportingCSV(true)
    try {
      const data = await exportQuestionsCSV(chapterId)

      if (data.length === 0) {
        alert("Nu exista intrebari de exportat.")
        return
      }

      const csv = Papa.unparse(data)
      // Add UTF-8 BOM for Romanian diacritics support in Excel
      const bom = "\uFEFF"
      const blob = new Blob([bom + csv], {
        type: "text/csv;charset=utf-8",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = getFileName("csv")
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert("Eroare la exportul CSV. Incearca din nou.")
    } finally {
      setIsExportingCSV(false)
    }
  }

  const handleExportExcel = async () => {
    setIsExportingExcel(true)
    try {
      const base64 = await exportQuestionsExcel(chapterId)

      if (!base64) {
        alert("Nu exista intrebari de exportat.")
        return
      }

      // Decode base64 to binary
      const binaryString = atob(base64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = getFileName("xlsx")
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert("Eroare la exportul Excel. Incearca din nou.")
    } finally {
      setIsExportingExcel(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Chapter filter */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Filtreaza dupa capitol</label>
        <Select value={selectedChapter} onValueChange={setSelectedChapter}>
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="Toate capitolele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate capitolele</SelectItem>
            {chapters.map((chapter) => (
              <SelectItem key={chapter.id} value={chapter.id}>
                {chapter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={handleExportCSV}
          disabled={isExportingCSV || isExportingExcel}
        >
          {isExportingCSV ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          Exporta CSV
        </Button>

        <Button
          variant="outline"
          onClick={handleExportExcel}
          disabled={isExportingCSV || isExportingExcel}
        >
          {isExportingExcel ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          Exporta Excel
        </Button>
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        <Download className="mr-1 inline-block h-3 w-3" />
        Fisierele CSV includ BOM UTF-8 pentru afisarea corecta a diacriticelor
        in Excel. Fisierele Excel (.xlsx) pastreaza diacriticele nativ.
      </p>
    </div>
  )
}
