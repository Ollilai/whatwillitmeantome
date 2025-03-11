// Filepath: app/(marketing)/layout.tsx

/**
 * @description
 * This server layout is specific to the (marketing) route segment.
 *
 * It is responsible for:
 * - Rendering the shared Header and Footer for marketing pages
 * - Providing any route-level wrappers or containers
 *
 * Key features:
 * - Wraps children in a consistent container with spacing
 * - Uses the main shared <Header> and <Footer> from components
 *
 * @dependencies
 * - Header for top navigation
 * - Footer for bottom navigation
 *
 * @notes
 * - We slightly updated the container usage
 * - We did not add placeholders, focusing on a production-ready look
 */

"use server"

import Footer from "@/components/landing/footer"
import Header from "@/components/landing/header"

/**
 * A server layout for all marketing routes under (marketing).
 * In production, it ensures the same header/footer are consistent across these pages.
 */
export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* We add a simple container-like wrapper for spacing */}
      <div className="flex-1 px-4 py-8 md:px-8 md:py-12">{children}</div>

      <Footer />
    </div>
  )
}
