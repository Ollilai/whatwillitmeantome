// Filepath: app/layout.tsx

/**
 * @description
 * This server layout is the top-level layout for the entire app.
 *
 * It is responsible for:
 * - Setting up HTML metadata for the whole site
 * - Rendering the top-level Providers (tooltip + theme)
 *
 * Key features:
 * - Basic site-wide structure
 * - Minimal branding references for "WhatWillItMeanToMe"
 *
 * @dependencies
 * - Providers for theme and tooltip
 *
 * @notes
 * - Authentication has been removed as it's not needed for this project
 */

import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
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
  return (
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
  )
}
