"use client"

/**
 * @description
 * Generates a shareable placard highlighting the user's profession and summary.
 * Allows for generating an image via html2canvas and optionally downloading or
 * previewing that image. Also includes social sharing.
 *
 * @responsibilities
 * - Render a stylized "placard" area for screenshot
 * - Provide "Generate Image" and "Download" functionality
 * - Provide a <SocialSharing> row for sharing on social media
 *
 * @notes
 * - The summary is pulled from Mistral's analysis
 * - The final image can be downloaded by the user
 */

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MistralReportData } from "./report-display-types"

export default function Placard({
  profession,
  data
}: {
  profession: string
  data: MistralReportData
}) {
  return (
    <div className="my-8 w-full max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{profession}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{data.placard}</p>
        </CardContent>
      </Card>
    </div>
  )
}
