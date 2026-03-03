"use server"

import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentAdmin } from "@/lib/db/queries/admin"
import { examDurationSchema } from "@/lib/validations/admin-settings"
import { revalidatePath } from "next/cache"

const DEFAULT_EXAM_DURATION_SECONDS = 14400 // 4 hours

/**
 * Get current exam settings.
 */
export async function getExamSettings() {
  const [setting] = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, "exam_duration_seconds"))
    .limit(1)

  return {
    durationSeconds: setting
      ? parseInt(setting.value, 10) || DEFAULT_EXAM_DURATION_SECONDS
      : DEFAULT_EXAM_DURATION_SECONDS,
  }
}

/**
 * Update exam duration setting.
 * Admin-only action.
 */
export async function updateExamDuration(formData: FormData) {
  await getCurrentAdmin()

  const durationHours = parseFloat(formData.get("durationHours") as string)

  const parsed = examDurationSchema.safeParse({ durationHours })
  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors.durationHours?.[0] ?? "Date invalide",
    }
  }

  const durationSeconds = Math.round(parsed.data.durationHours * 3600)

  // Upsert: insert or update
  const [existing] = await db
    .select({ key: siteSettings.key })
    .from(siteSettings)
    .where(eq(siteSettings.key, "exam_duration_seconds"))
    .limit(1)

  if (existing) {
    await db
      .update(siteSettings)
      .set({
        value: String(durationSeconds),
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.key, "exam_duration_seconds"))
  } else {
    await db.insert(siteSettings).values({
      key: "exam_duration_seconds",
      value: String(durationSeconds),
    })
  }

  revalidatePath("/admin/settings")

  return { success: true as const, durationSeconds }
}
