import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users, auditLogs } from "@/lib/db/schema"
import { auth } from "@/lib/auth"

/**
 * Verify that the given user ID belongs to a superadmin.
 * Redirects to /dashboard if not.
 */
export async function requireSuperadmin(userId: string) {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      isSuperadmin: users.isSuperadmin,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user || !user.isSuperadmin) {
    redirect("/dashboard")
  }

  return user
}

/**
 * Get the current authenticated admin user.
 * Gets session, verifies superadmin status.
 * Redirects if not authenticated or not superadmin.
 */
export async function getCurrentAdmin() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  return requireSuperadmin(session.user.id)
}

/**
 * Log an admin action to the audit trail.
 */
export async function logAudit(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  changes?: Record<string, unknown>
) {
  await db.insert(auditLogs).values({
    userId,
    action,
    entityType,
    entityId,
    changes: changes ? JSON.stringify(changes) : null,
  })
}
