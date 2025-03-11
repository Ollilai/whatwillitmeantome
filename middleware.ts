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
 *  - We removed references to '/whatwillitmeantome' because that route is now the main page
 *  - Public routes remain fully accessible
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  // Example protected route
  "/todo(.*)"
])

// Define public routes that don't require authentication
// Note that we removed "/whatwillitmeantome(.*)" since it's no longer valid
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/contact",
  "/features",
  "/login(.*)",
  "/signup(.*)",
  "/api/webhook(.*)"
])

export default clerkMiddleware(async (auth, req) => {
  // Always allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Check if route is protected
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

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}
