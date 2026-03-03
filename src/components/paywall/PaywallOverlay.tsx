"use client"

import Link from "next/link"
import { Lock } from "lucide-react"

interface PaywallOverlayProps {
  isVisible: boolean
}

export function PaywallOverlay({ isVisible }: PaywallOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal card */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>

        <h2 className="mb-2 text-2xl font-bold tracking-tight">
          Aboneaza-te pentru acces complet
        </h2>

        <p className="mb-6 text-muted-foreground">
          Perioada ta de trial a expirat. Aboneaza-te pentru a continua sa
          practici si sa te pregatesti pentru examenul de rezidentiat.
        </p>

        <Link
          href="/pricing"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Vezi planurile
        </Link>

        <p className="mt-4 text-xs text-muted-foreground">
          Ai deja abonament?{" "}
          <button
            onClick={() => window.location.reload()}
            className="underline hover:text-foreground"
          >
            Reincarca pagina
          </button>
        </p>
      </div>
    </div>
  )
}
