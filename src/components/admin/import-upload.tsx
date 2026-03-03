"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, FileSpreadsheet, X, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { importQuestions } from "@/lib/actions/import-export"
import { IMPORT_COLUMNS, type ImportRow } from "@/lib/validations/import"
import { ImportValidationReport } from "./import-validation-report"
import Papa from "papaparse"
import ExcelJS from "exceljs"

interface ParsedData {
  rows: ImportRow[]
  fileName: string
  rowCount: number
}

type ImportResult = {
  imported: number
  updated: number
  errors: { row: number; message: string }[]
}

export function ImportUpload() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetState = () => {
    setParsedData(null)
    setParseError(null)
    setResult(null)
  }

  const parseCSV = useCallback((file: File): Promise<ImportRow[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        encoding: "UTF-8",
        complete(results) {
          if (results.errors.length > 0) {
            reject(
              new Error(
                `Eroare la parsarea CSV: ${results.errors[0].message}`
              )
            )
            return
          }
          const rows = results.data.map((row) => ({
            id: row.id ?? "",
            chapter_name: row.chapter_name ?? "",
            question_text: row.question_text ?? "",
            type: row.type ?? "",
            option_a: row.option_a ?? "",
            option_b: row.option_b ?? "",
            option_c: row.option_c ?? "",
            option_d: row.option_d ?? "",
            option_e: row.option_e ?? "",
            correct_answers: row.correct_answers ?? "",
            source_book: row.source_book ?? "",
            source_page: row.source_page ?? "",
          })) as ImportRow[]
          resolve(rows)
        },
        error(err: Error) {
          reject(new Error(`Eroare la parsarea CSV: ${err.message}`))
        },
      })
    })
  }, [])

  const parseExcel = useCallback(async (file: File): Promise<ImportRow[]> => {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(arrayBuffer)

    const worksheet = workbook.worksheets[0]
    if (!worksheet) {
      throw new Error("Fisierul Excel nu contine nicio foaie de lucru")
    }

    const rows: ImportRow[] = []
    const headerRow = worksheet.getRow(1)
    const headers: string[] = []

    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber] = String(cell.value ?? "").trim().toLowerCase()
    })

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return // Skip header

      const rowData: Record<string, string> = {}
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber]
        if (header) {
          rowData[header] = String(cell.value ?? "").trim()
        }
      })

      // Only include non-empty rows
      if (rowData.question_text || rowData.chapter_name) {
        rows.push({
          id: rowData.id ?? "",
          chapter_name: rowData.chapter_name ?? "",
          question_text: rowData.question_text ?? "",
          type: rowData.type ?? "",
          option_a: rowData.option_a ?? "",
          option_b: rowData.option_b ?? "",
          option_c: rowData.option_c ?? "",
          option_d: rowData.option_d ?? "",
          option_e: rowData.option_e ?? "",
          correct_answers: rowData.correct_answers ?? "",
          source_book: rowData.source_book ?? "",
          source_page: rowData.source_page ?? "",
        } as ImportRow)
      }
    })

    return rows
  }, [])

  const handleFile = useCallback(
    async (file: File) => {
      resetState()
      setIsParsing(true)

      try {
        const isExcel =
          file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
        const isCSV = file.name.endsWith(".csv")

        if (!isExcel && !isCSV) {
          setParseError(
            "Format de fisier nesuportat. Utilizeaza .csv sau .xlsx."
          )
          return
        }

        const rows = isExcel ? await parseExcel(file) : await parseCSV(file)

        if (rows.length === 0) {
          setParseError("Fisierul nu contine date (doar header-ul).")
          return
        }

        setParsedData({
          rows,
          fileName: file.name,
          rowCount: rows.length,
        })
      } catch (err) {
        setParseError(
          err instanceof Error ? err.message : "Eroare la parsarea fisierului"
        )
      } finally {
        setIsParsing(false)
      }
    },
    [parseCSV, parseExcel]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      // Reset input so same file can be re-selected
      e.target.value = ""
    },
    [handleFile]
  )

  const handleImport = async () => {
    if (!parsedData) return
    setIsImporting(true)

    try {
      const importResult = await importQuestions(parsedData.rows)
      setResult(importResult)
      setParsedData(null)
    } catch {
      setResult({
        imported: 0,
        updated: 0,
        errors: [{ row: 0, message: "Eroare neasteptata la import. Incearca din nou." }],
      })
    } finally {
      setIsImporting(false)
    }
  }

  const downloadTemplate = () => {
    const headers = IMPORT_COLUMNS.join(",")
    const exampleRow = [
      "",
      "Anatomie",
      "Care sunt oasele craniului?",
      "CM",
      "Frontal",
      "Parietal",
      "Temporal",
      "Occipital",
      "Sfenoid",
      "A,B,C,D,E",
      "Atlas Anatomie",
      "42",
    ].join(",")

    const bom = "\uFEFF"
    const csv = bom + headers + "\n" + exampleRow + "\n"
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "template_import_intrebari.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Format instructions */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <h4 className="mb-2 text-sm font-semibold">Format CSV/Excel</h4>
        <p className="text-sm text-muted-foreground">
          Coloane:{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            id
          </code>{" "}
          (optional),{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            chapter_name
          </code>
          ,{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            question_text
          </code>
          ,{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            type
          </code>{" "}
          (CS/CM),{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            option_a
          </code>{" "}
          ...{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            option_e
          </code>
          ,{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            correct_answers
          </code>{" "}
          (ex: A,C,E),{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            source_book
          </code>{" "}
          (optional),{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            source_page
          </code>{" "}
          (optional)
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={downloadTemplate}
        >
          <Download className="mr-2 h-4 w-4" />
          Descarca template CSV
        </Button>
      </div>

      {/* File upload zone */}
      {!parsedData && !result && (
        <div
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          {isParsing ? (
            <>
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Se parseaza fisierul...
              </p>
            </>
          ) : (
            <>
              <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-1 text-sm font-medium">
                Trage fisierul aici sau apasa pentru a selecta
              </p>
              <p className="text-xs text-muted-foreground">
                Formate acceptate: .csv, .xlsx
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}

      {/* Parse error */}
      {parseError && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">{parseError}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={resetState}
            >
              Incearca din nou
            </Button>
          </div>
        </div>
      )}

      {/* Parsed data preview */}
      {parsedData && (
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">{parsedData.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {parsedData.rowCount} randuri gasite
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetState}>
                Anuleaza
              </Button>
              <Button
                size="sm"
                onClick={handleImport}
                disabled={isImporting}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Se importa...
                  </>
                ) : (
                  "Importa"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import result */}
      {result && (
        <ImportValidationReport
          imported={result.imported}
          updated={result.updated}
          errors={result.errors}
          onClose={resetState}
        />
      )}
    </div>
  )
}
