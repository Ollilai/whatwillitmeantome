/**
 * @description
 * This client component provides a visually appealing card ("placard")
 * that displays a short one-sentence summary (the "Placard") from the AI analysis.
 *
 * Responsibilities:
 * - Receives the short summary as a prop
 * - Renders it in a distinctive, production-grade design
 * - Provides a fallback text if the summary is missing
 *
 * Key features:
 * - Uses a gradient header to make it visually appealing
 * - Center-aligned for a neat layout
 * - Comprehensive file-level and inline documentation
 *
 * @dependencies
 * - React: for rendering
 * - Shadcn's card components for consistent UI styling
 * - TypeScript for type safety
 *
 * @notes
 * - This is intended for Step 5 of the plan: "Ensure Mistral Output is Production-Ready & Placard is Appealing."
 * - The actual social sharing is implemented in Step 6, so not included here.
 */

"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
 * @function Placard
 * A visually appealing "placard" that displays a short AI-generated summary inside a card.
 *
 * @param {PlacardProps} props - The component's props containing the summary text.
 * @returns A card element with a gradient header and the summary text in the main body.
 *
 * @notes
 * - If the summary is empty or missing, a fallback message "No summary available" is displayed.
 */
export default function Placard({ summary }: PlacardProps) {
  // Fallback text if summary is empty
  const content = summary?.trim() ? summary : "No summary available"

  return (
    <Card className="mx-auto w-full max-w-2xl border shadow-sm">
      {/* 
        Gradient header for a more appealing look
        The gradient can be customized via tailwind config or inline styles 
      */}
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <CardTitle className="text-center text-lg font-semibold">
          Quick Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-muted-foreground text-base">{content}</p>
      </CardContent>
    </Card>
  )
}
