export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    /*
     * Match all paths except static files and images.
     * This keeps middleware fast for asset requests.
     */
    "/((?!_next/static|_next/image|favicon.ico|icons/|manifest.json|sw.js|api/auth|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
}
