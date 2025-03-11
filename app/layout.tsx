// Filepath: app/layout.tsx

/**
 * @description
 * This server layout is the top-level layout for the entire app.
 *
 * It is responsible for:
 * - Providing the ClerkProvider for auth
 * - Checking user profiles on every request
 * - Setting up HTML metadata for the whole site
 * - Rendering the top-level Providers (tooltip + theme)
 *
 * Key features:
 * - Basic site-wide structure
 * - Minimal branding references changed to unify "WhatWillItMeanToMe"
 *
 * @dependencies
 * - ClerkProvider for user authentication and session
 * - Providers for theme and tooltip
 *
 * @notes
 * - We changed the `metadata.title` to "WhatWillItMeanToMe"
 * - Everything else remains functionally the same
 */

import {
  createProfileAction,
  getProfileByUserIdAction
} from "@/actions/db/profiles-actions"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// Load Inter font from Google
const inter = Inter({ subsets: ["latin"] })

// Updated brand naming and description
export const metadata: Metadata = {
  title: "WhatWillItMeanToMe",
  description: "A career-analysis platform for the AGI era."
}

/**
 * The root layout for the entire Next.js app.
 * Provides the necessary context providers and global styling.
 */
export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Authentication logic:
  // If the user logs in, we ensure a profile is created by checking userId.
  const { userId } = await auth()

  if (userId) {
    const profileRes = await getProfileByUserIdAction(userId)
    if (!profileRes.isSuccess) {
      await createProfileAction({ userId })
    }
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>

        <body
          className={cn(
            "bg-background mx-auto min-h-screen w-full scroll-smooth antialiased",
            inter.className
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}

            {/**
             * Renders Tailwind's viewport size indicator in dev mode
             * and Shadcn <Toaster> for top-level toast messages
             */}
            <TailwindIndicator />
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
