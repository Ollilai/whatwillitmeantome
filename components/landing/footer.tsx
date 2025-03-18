// Filepath: components/landing/footer.tsx

/**
 * @description
 * This client component provides the footer for the marketing site.
 *
 * It is responsible for:
 * - Displaying essential site links (About, Documentation, Terms & Privacy)
 * - Displaying a copyright notice
 *
 * Key features:
 * - Clean, minimalistic design
 * - Simplified navigation structure
 * - Consistent with header navigation
 *
 * @dependencies
 * - React for the component
 * - Link for next navigation
 *
 * @notes
 * - Streamlined to only include essential links
 * - About link matches the header navigation
 */

"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
        {/* Footer links - simplified to a single row */}
        <div className="flex flex-col items-center justify-center space-y-6 md:flex-row md:space-x-12 md:space-y-0">
          <Link
            href="/about"
            className="text-foreground/70 hover:text-foreground transition"
          >
            About
          </Link>

          <Link
            href="https://github.com/Ollilai/whatwillitmeantome"
            className="text-foreground/70 hover:text-foreground transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </Link>
        </div>

        {/* Bottom row */}
        <div className="text-foreground/60 mt-8 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} What Will It Mean To Me. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
