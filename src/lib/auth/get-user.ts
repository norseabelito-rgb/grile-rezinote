"use server"

import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createClient } from "@/lib/supabase/server"

/**
 * Get the current authenticated user.
 * Creates Supabase client, gets auth user, fetches DB record.
 * Redirects to /login if not authenticated.
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/login")
  }

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1)

  if (!dbUser) {
    redirect("/login")
  }

  return dbUser
}
