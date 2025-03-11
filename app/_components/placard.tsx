/**
 * @description
 * This client component provides a visually appealing "placard" to display
 * the short one-sentence summary (the "Placard") returned by Mistral.
 *
 * It is responsible for:
 * - Receiving the placard (summary) text as a prop
 * - Rendering it inside a stylish Card from shadcn
 * - Offering a visually appealing, production-ready look for sharing
 *
 * Key features:
 * - Uses Shadcn's <Card> and <CardContent> for consistent styling
 * - Emphasizes the summary with a larger or distinct text style
 * - Allows easy integration of future share buttons (step 6)
 *
 * @dependencies
 * - React for rendering
 * - Shadcn <Card> components for UI
 *
 * @notes
 * - This step directly addresses Step 5 of the plan:
 *   "Ensure Mistral Output is Production-Ready & Placard is Appealing"
 * - We do not yet add social share code—this will happen in Step 6.
 * - We provide the entire file content per the project instructions
 */

"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * @interface PlacardProps
 * @property {string} summary
 *  The short one-sentence summary from the Mistral response. Typically something
 *  a user might want to share on social media.
 */
interface PlacardProps {
  summary: string
}

/**
 * @function Placard
 * A visually appealing card that displays the short summary from Mistral.
 *
 * @param {PlacardProps} props - Contains the summary text to display
 * @returns A styled card containing the summary
 *
 * @notes
 * - Future expansions might include social share buttons, copy to clipboard, etc.
 * - We keep the layout minimal here, focusing on "production-readiness"
 *   and an appealing design.
 */
export default function Placard({ summary }: PlacardProps) {
  return (
    <Card className="mx-auto w-full max-w-2xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold">
          Quick Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center gap-2 text-center">
        <p className="text-foreground text-base">{summary}</p>
      </CardContent>
    </Card>
  )
}
