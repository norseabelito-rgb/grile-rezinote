"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { updatePassword, type AuthState } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Se salveaza..." : "Schimba parola"}
    </Button>
  )
}

export function UpdatePasswordForm({ token }: { token?: string }) {
  const [state, formAction] = useActionState<AuthState, FormData>(
    updatePassword,
    null
  )

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Parola noua</CardTitle>
        <CardDescription>
          Seteaza o parola noua pentru contul tau
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          {/* Pass reset token as hidden field */}
          {token && <input type="hidden" name="token" value={token} />}

          {state?.error && (
            <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Parola noua</Label>
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
            <Label htmlFor="confirmPassword">Confirma parola</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
            />
            {state?.errors?.confirmPassword && (
              <p className="text-sm text-destructive">
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
