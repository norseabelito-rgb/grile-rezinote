"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QuestionPreviewProps {
  questionText: string
  options: Array<{ label: string; text: string; isCorrect: boolean }>
  type: "CS" | "CM"
  sourceBook?: string
  sourcePage?: string
}

export function QuestionPreview({
  questionText,
  options,
  type,
  sourceBook,
  sourcePage,
}: QuestionPreviewProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Previzualizare Student
          </CardTitle>
          <Badge variant={type === "CS" ? "default" : "secondary"}>
            {type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">
          {questionText || (
            <span className="italic text-muted-foreground">
              Scrie textul intrebarii...
            </span>
          )}
        </p>

        <div className="space-y-2">
          {options.map((opt) => (
            <div
              key={opt.label}
              className={`flex items-start gap-3 rounded-md border p-3 text-sm ${
                opt.isCorrect
                  ? "border-green-500/50 bg-green-50 dark:bg-green-950/20"
                  : ""
              }`}
            >
              <span className="font-medium text-muted-foreground">
                {opt.label})
              </span>
              <span className="flex-1">
                {opt.text || (
                  <span className="italic text-muted-foreground">
                    Optiune goala
                  </span>
                )}
              </span>
              {opt.isCorrect && (
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-600 text-xs"
                >
                  Corect
                </Badge>
              )}
            </div>
          ))}
        </div>

        {(sourceBook || sourcePage) && (
          <p className="text-xs text-muted-foreground border-t pt-3">
            Sursa: {sourceBook}
            {sourcePage ? `, p. ${sourcePage}` : ""}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
