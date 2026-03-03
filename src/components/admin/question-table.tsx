"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Archive, Plus, Search } from "lucide-react"
import { archiveQuestion } from "@/lib/actions/questions"

interface QuestionRow {
  id: string
  text: string
  type: "CS" | "CM"
  chapterId: string
  chapterName: string | null
  sourceBook: string | null
  sourcePage: string | null
  createdAt: Date
}

interface QuestionTableProps {
  questions: QuestionRow[]
  total: number
  page: number
  pageSize: number
  chapters: Array<{ id: string; name: string }>
  filters: {
    chapterId?: string
    type?: string
    search?: string
  }
}

export function QuestionTable({
  questions,
  total,
  page,
  pageSize,
  chapters,
  filters,
}: QuestionTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(filters.search ?? "")
  const totalPages = Math.ceil(total / pageSize)

  function applyFilters(newFilters: Record<string, string>) {
    const params = new URLSearchParams()
    const merged = { ...filters, ...newFilters }
    if (merged.chapterId && merged.chapterId !== "all")
      params.set("chapterId", merged.chapterId)
    if (merged.type && merged.type !== "all")
      params.set("type", merged.type)
    if (merged.search) params.set("search", merged.search)
    if (newFilters.page) params.set("page", newFilters.page)

    startTransition(() => {
      router.push(`/admin/questions?${params.toString()}`)
    })
  }

  async function handleArchive(id: string) {
    if (!confirm("Esti sigur ca vrei sa arhivezi aceasta intrebare?")) return
    await archiveQuestion(id)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cauta intrebare..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters({ search, page: "1" })
            }}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.chapterId ?? "all"}
          onValueChange={(v) => applyFilters({ chapterId: v, page: "1" })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Toate capitolele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate capitolele</SelectItem>
            {chapters.map((ch) => (
              <SelectItem key={ch.id} value={ch.id}>
                {ch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.type ?? "all"}
          onValueChange={(v) => applyFilters({ type: v, page: "1" })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Toate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate</SelectItem>
            <SelectItem value="CS">CS</SelectItem>
            <SelectItem value="CM">CM</SelectItem>
          </SelectContent>
        </Select>

        <Button asChild>
          <Link href="/admin/questions/new">
            <Plus className="mr-2 h-4 w-4" />
            Adauga Intrebare
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Intrebare</TableHead>
              <TableHead className="w-[80px]">Tip</TableHead>
              <TableHead>Capitol</TableHead>
              <TableHead>Sursa</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nicio intrebare gasita.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              questions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="max-w-0">
                    <p className="truncate text-sm">{q.text}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={q.type === "CS" ? "default" : "secondary"}
                    >
                      {q.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {q.chapterName ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {q.sourceBook
                      ? `${q.sourceBook}${q.sourcePage ? `, p.${q.sourcePage}` : ""}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/questions/${q.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editeaza
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleArchive(q.id)}
                          className="text-destructive"
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Arhiveaza
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {total} intrebari total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => applyFilters({ page: String(page - 1) })}
            >
              Anterior
            </Button>
            <span className="flex items-center px-2 text-sm">
              Pagina {page} din {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => applyFilters({ page: String(page + 1) })}
            >
              Urmator
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
