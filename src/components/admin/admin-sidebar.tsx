"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  FileSpreadsheet,
  Settings,
  GraduationCap,
  BarChart3,
  ArrowLeft,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/chapters", label: "Capitole", icon: BookOpen },
  { href: "/admin/questions", label: "Intrebari", icon: HelpCircle },
  {
    href: "/admin/import-export",
    label: "Import / Export",
    icon: FileSpreadsheet,
  },
  { href: "/admin/specialties", label: "Specialitati", icon: GraduationCap },
  {
    href: "/admin/admission-data",
    label: "Date admitere",
    icon: BarChart3,
  },
  { href: "/admin/settings", label: "Setari", icon: Settings },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 space-y-1 p-3">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            className={cn(
              "w-full justify-start gap-3",
              isActive &&
                "bg-primary/10 text-primary hover:bg-primary/15"
            )}
            onClick={onNavigate}
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile: Sheet-based sidebar with trigger button */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed left-3 top-3 z-50 h-10 w-10 bg-background shadow-sm border"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Meniu admin</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="text-left text-lg">Panou Admin</SheetTitle>
              <p className="text-left text-xs text-muted-foreground">
                Gestionare continut
              </p>
            </SheetHeader>
            <NavLinks onNavigate={() => setOpen(false)} />
            <div className="border-t p-3">
              <Button
                variant="ghost"
                asChild
                className="w-full justify-start gap-3"
                onClick={() => setOpen(false)}
              >
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard Student
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Fixed sidebar */}
      <aside className="hidden md:flex h-full w-64 flex-col border-r bg-card">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Panou Admin</h2>
          <p className="text-xs text-muted-foreground">
            Gestionare continut
          </p>
        </div>

        <NavLinks />

        <div className="border-t p-3">
          <Button variant="ghost" asChild className="w-full justify-start gap-3">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Dashboard Student
            </Link>
          </Button>
        </div>
      </aside>
    </>
  )
}
