import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as
    | "email"
    | "recovery"
    | "email_change"
    | null

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })

    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(
          new URL("/update-password", request.url)
        )
      }
      // Email confirmation — redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Error or missing params — redirect to login with error
  return NextResponse.redirect(
    new URL("/login?error=auth-code-error", request.url)
  )
}
