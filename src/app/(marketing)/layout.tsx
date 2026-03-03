import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Marketing navigation */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span>
              <span className="text-foreground">Rezi</span>
              <span className="bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent">NOTE</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="rounded-full" asChild>
              <Link href="/login">Autentificare</Link>
            </Button>
            <Button size="sm" className="rounded-full gradient-primary border-0 text-white shadow-md hover:shadow-lg transition-shadow" asChild>
              <Link href="/signup">Incepe gratuit</Link>
            </Button>
          </div>
        </nav>
      </header>

      {children}
    </>
  )
}
