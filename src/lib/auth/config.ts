import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)

        if (!user) return null

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string
      }
      return session
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const pathname = request.nextUrl.pathname

      const publicAuthRoutes = [
        "/login",
        "/signup",
        "/forgot-password",
        "/verify-email",
        "/update-password",
      ]

      // Redirect authenticated users away from auth pages
      if (isLoggedIn && publicAuthRoutes.some((r) => pathname.startsWith(r))) {
        return Response.redirect(new URL("/dashboard", request.nextUrl))
      }

      // Protect app routes
      const protectedPrefixes = [
        "/dashboard",
        "/practice",
        "/exam",
        "/admission",
        "/subscription",
        "/admin",
      ]

      if (!isLoggedIn && protectedPrefixes.some((p) => pathname.startsWith(p))) {
        return Response.redirect(new URL("/login", request.nextUrl))
      }

      return true
    },
  },
  trustHost: true,
}
