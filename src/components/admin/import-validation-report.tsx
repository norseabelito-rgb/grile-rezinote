"use client"

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Props {
  imported: number
  updated: number
  errors: { row: number; message: string }[]
  onClose: () => void
}

export function ImportValidationReport({
  imported,
  updated,
  errors,
  onClose,
}: Props) {
  const hasErrors = errors.length > 0
  const hasSuccess = imported > 0 || updated > 0

  return (
    <div className="space-y-4">
      {/* Success summary */}
      {hasSuccess && (
        <Alert>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Import finalizat</AlertTitle>
          <AlertDescription>
            {imported > 0 && (
              <span>
                {imported} {imported === 1 ? "intrebare importata" : "intrebari importate"}
              </span>
            )}
            {imported > 0 && updated > 0 && <span>, </span>}
            {updated > 0 && (
              <span>
                {updated} {updated === 1 ? "intrebare actualizata" : "intrebari actualizate"}
              </span>
            )}
            .
          </AlertDescription>
        </Alert>
      )}

      {/* No success, all errors */}
      {!hasSuccess && hasErrors && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Import esuat</AlertTitle>
          <AlertDescription>
            Nicio intrebare nu a fost importata. Verifica erorile de mai jos.
          </AlertDescription>
        </Alert>
      )}

      {/* Error details */}
      {hasErrors && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-medium">
              {errors.length} {errors.length === 1 ? "eroare" : "erori"} gasite
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Rand</TableHead>
                  <TableHead>Eroare</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errors.map((error, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-sm">
                      {error.row > 0 ? `#${error.row}` : "General"}
                    </TableCell>
                    <TableCell className="text-sm text-destructive">
                      {error.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Button variant="outline" onClick={onClose}>
        Inchide
      </Button>
    </div>
  )
}
