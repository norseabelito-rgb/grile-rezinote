"use server"

import { cache } from "react"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"

/**
 * Get the NextAuth session user (cached per request).
 * Returns { id, email, name } or null.
 */
export const getAuthUser = cache(async () => {
  const session = await auth()
  if (!session?.user) return null
  return {
    id: session.user.id!,
    email: session.user.email!,
  }
})

/**
 * Get the current authenticated user from DB.
 * Uses `cache()` to deduplicate within a single request —
 * layout + page + server actions all share the same result.
 * Redirects to /login if not authenticated.
 */
export const getCurrentUser = cache(async () => {
  const authUser = await getAuthUser()

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
})
