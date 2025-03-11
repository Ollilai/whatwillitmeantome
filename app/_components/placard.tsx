/**
 * @description
 * This client component provides a visually appealing card ("placard")
 * that displays a short one-sentence summary (the "Placard") from the AI analysis.
 *
 * Responsibilities:
 * - Receives the short summary as a prop
 * - Renders it in a distinctive, production-grade design
 * - Provides a fallback text if the summary is missing
 * - Includes social sharing functionality
 *
 * Key features:
 * - Uses a gradient header to make it visually appealing
 * - Center-aligned for a neat layout
 * - Comprehensive file-level and inline documentation
 * - Integrated social sharing buttons
 *
 * @dependencies
 * - React: for rendering
 * - Shadcn's card components for consistent UI styling
 * - TypeScript for type safety
 * - SocialSharing component for sharing functionality
 *
 * @notes
 * - This is intended for Step 5 of the plan: "Ensure Mistral Output is Production-Ready & Placard is Appealing."
 * - The actual social sharing is implemented in Step 6, so not included here.
 */

"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SocialSharing from "@/app/(marketing)/_components/social-sharing"
import { cn } from "@/lib/utils"

/**
 * @interface PlacardProps
 * Represents the props for the Placard component.
 */
interface PlacardProps {
  /**
   * The short, one-sentence summary returned by the AI analysis.
   */
  summary: string
  /**
   * Optional className for additional styling
   */
  className?: string
}

/**
 * @function Placard
 * A visually appealing "placard" that displays a short AI-generated summary inside a card.
 *
 * @param {PlacardProps} props - The component's props containing the summary text.
 * @returns A card element with a gradient header and the summary text in the main body.
 *
 * @notes
 * - If the summary is empty or missing, a fallback message "No summary available" is displayed.
 */
export default function Placard({ summary, className }: PlacardProps) {
  // Fallback text if summary is empty
  const content = summary?.trim() ? summary : "No summary available"

  return (
    <Card
      className={cn("mx-auto w-full max-w-2xl border shadow-lg", className)}
    >
      {/* 
        Gradient header for a more appealing look
        Using a more vibrant gradient with a subtle pattern overlay
      */}
      <CardHeader className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <CardTitle className="relative text-center text-xl font-bold">
          Quick Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
        <div
          className="text-muted-foreground text-center text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Social sharing buttons */}
        <div className="mt-2">
          <SocialSharing
            text={content.replace(/<\/?[^>]+(>|$)/g, "")} // Strip HTML for sharing
            url="https://whatwillitmeantome.com"
          />
        </div>
      </CardContent>
    </Card>
  )
}
