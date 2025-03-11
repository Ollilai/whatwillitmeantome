/**
 * @description
 * Contains middleware for protecting routes, checking user authentication, and redirecting as needed.
 *
 * It is responsible for:
 *  - Defining public vs. protected routes
 *  - Redirecting unauthenticated users to the sign-in page when hitting protected routes
 *  - Allowing free access to public routes
 *
 * Key features:
 *  - Uses Clerk's clerkMiddleware for session-based route protection
 *  - White-lists certain routes as "public" (like '/', '/about', '/features', '/contact', etc.)
 *  - Example: isProtectedRoute uses createRouteMatcher to define paths that need user auth
 *
 * @dependencies
 *  - clerkMiddleware: from '@clerk/nextjs/server'
 *  - createRouteMatcher: from '@clerk/nextjs/server'
 *  - NextResponse: from 'next/server' to handle response/redirect
 *
 * @notes
 *  - We have removed references to '/pricing', as that page no longer exists.
 *  - If user attempts to visit a protected route without authentication, they get redirected to '/login'.
 *  - Public routes remain fully accessible.
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/todo(.*)"
])

// Define public routes that don't require authentication
// Note: Removed "/pricing" since the pricing page was deleted.
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/contact",
  "/features",
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
      const signInUrl = new URL("/login", req.url)
      signInUrl.searchParams.set("redirect_url", req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Default: allow the request to proceed
  return NextResponse.next()
})

// The matcher ensures the middleware runs for all pages except certain special directories
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}
