/**
 * @description
 * This client component provides a visually extraordinary card ("placard")
 * that displays a short one-sentence summary (the "Placard") from the AI analysis.
 *
 * Responsibilities:
 * - Receives the short summary as a prop
 * - Renders it in a distinctive, production-grade design with animations
 * - Provides a fallback text if the summary is missing
 * - Includes social sharing functionality
 *
 * Key features:
 * - Uses 3D perspective effects and animations
 * - Interactive hover states with parallax effects
 * - Animated quote marks and decorative elements
 * - Integrated social sharing buttons
 *
 * @dependencies
 * - React: for rendering
 * - Framer Motion: for animations and effects
 * - Shadcn's card components for consistent UI styling
 * - TypeScript for type safety
 * - SocialSharing component for sharing functionality
 *
 * @notes
 * - This is intended to be a visually impressive component that draws attention
 */

"use client"

import React, { useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import SocialSharing from "@/app/(marketing)/_components/social-sharing"
import { motion } from "framer-motion"

/**
 * @interface PlacardProps
 * Represents the props for the Placard component.
 */
interface PlacardProps {
  /**
   * The short, one-sentence summary returned by the AI analysis.
   */
  summary: string
}

/**
 * Helper function to strip HTML tags from text for sharing
 */
function stripHtml(html: string): string {
  return html.replace(/<\/?[^>]+(>|$)/g, "")
}

/**
 * @function Placard
 * A client component that renders a visually appealing card with a gradient header
 * that displays a key insight. Includes social sharing functionality.
 *
 * @param summary - The key insight text to display
 */
export default function Placard({ summary }: PlacardProps) {
  // This ref is for the content that will be captured in the image download
  const downloadableContentRef = useRef<HTMLDivElement>(null)

  // Fallback text if summary is missing
  const displayText = summary || "Your AI-generated insight will appear here."

  // Clean text for sharing (no HTML tags)
  const cleanText = stripHtml(displayText)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="perspective-1000 mx-auto w-full max-w-2xl space-y-4"
    >
      {/* Downloadable Card - Only contains the insight */}
      <Card
        ref={downloadableContentRef}
        className="transform-gpu overflow-hidden border-2 border-blue-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-blue-500/30"
      >
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Key Insight</h3>
            <div className="size-2 animate-pulse rounded-full bg-white/70"></div>
          </div>
        </CardHeader>

        <CardContent className="relative p-6">
          <div className="absolute left-0 top-0 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl"></div>
          <div className="absolute bottom-0 right-0 size-32 translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tl from-purple-400/20 to-blue-400/20 blur-xl"></div>

          <blockquote className="relative z-10">
            <span className="absolute -left-2 -top-4 text-4xl text-blue-300/50 dark:text-blue-500/30">
              "
            </span>
            <p
              className="px-6 py-2 text-center text-lg font-medium"
              dangerouslySetInnerHTML={{ __html: displayText }}
            ></p>
            <span className="absolute -bottom-8 -right-2 text-4xl text-blue-300/50 dark:text-blue-500/30">
              "
            </span>
          </blockquote>
        </CardContent>
      </Card>

      {/* Social Sharing Section - Separate from the downloadable content */}
      <div className="mt-4">
        <SocialSharing
          text={cleanText}
          url={
            typeof window !== "undefined"
              ? window.location.href
              : "https://whatwillitmeantome.com"
          }
          elementRef={downloadableContentRef as React.RefObject<HTMLElement>}
        />
      </div>
    </motion.div>
  )
}
