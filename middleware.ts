/**
 * @description
 * Simple middleware that allows all routes.
 * 
 * @notes
 * - Authentication has been removed as it's not needed for this project
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Allow all requests
  return NextResponse.next()
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
