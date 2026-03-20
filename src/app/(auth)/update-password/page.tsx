import type { Metadata } from "next"
import { UpdatePasswordForm } from "@/components/auth/update-password-form"

export const metadata: Metadata = {
  title: "Parola noua — grile-ReziNOTE",
}

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  return <UpdatePasswordForm token={token} />
}
