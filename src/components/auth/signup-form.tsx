"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { signup, type AuthState } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Se creeaza contul..." : "Creeaza cont"}
    </Button>
  )
}

export function SignupForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(signup, null)

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Inregistrare</CardTitle>
        <CardDescription>
          Creeaza-ti contul pentru a incepe pregatirea
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nume complet</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Ion Popescu"
              required
            />
            {state?.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="exemplu@email.com"
              required
            />
            {state?.errors?.email && (
              <p className="text-sm text-destructive">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Parola</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
            />
            <p className="text-xs text-muted-foreground">
              Minim 8 caractere, cel putin o litera si o cifra
            </p>
            {state?.errors?.password && (
              <p className="text-sm text-destructive">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearOfStudy">Anul de studiu</Label>
            <select
              id="yearOfStudy"
              name="yearOfStudy"
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Selecteaza anul</option>
              <option value="1">Anul 1</option>
              <option value="2">Anul 2</option>
              <option value="3">Anul 3</option>
              <option value="4">Anul 4</option>
              <option value="5">Anul 5</option>
              <option value="6">Anul 6</option>
            </select>
            {state?.errors?.yearOfStudy && (
              <p className="text-sm text-destructive">
                {state.errors.yearOfStudy[0]}
              </p>
            )}
          </div>

          <SubmitButton />
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        Ai deja cont?{" "}
        <Link
          href="/login"
          className="ml-1 font-medium text-primary hover:underline"
        >
          Autentifica-te
        </Link>
      </CardFooter>
    </Card>
  )
}
