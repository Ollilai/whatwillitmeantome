/*
Contains middleware for protecting routes, checking user authentication, and redirecting as needed.
*/

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher(["/todo(.*)"])

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/contact",
  "/features",
  "/pricing",
  "/whatwillitmeantome(.*)",
  "/login(.*)",
  "/signup(.*)",
  "/api/webhook(.*)"
])

export default clerkMiddleware(async (auth, req) => {
  // Always allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // For protected routes, check authentication
  if (isProtectedRoute(req)) {
    const { userId } = await auth()
    
    // If not authenticated, redirect to sign in
    if (!userId) {
      const signInUrl = new URL('/login', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Default: allow the request to proceed
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}
