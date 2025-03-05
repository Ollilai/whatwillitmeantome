/**
 * @description
 * This client component displays the structured AI report data (outlook, benefits,
 * risks, steps, summary). It is rendered once we have a successful MistralResponse.
 *
 * It is responsible for:
 * - Rendering each section of the AI analysis in a clear manner using Shadcn UI
 * - Providing disclaimers that the future is uncertain
 *
 * Key features:
 * - Minimalistic card layout
 * - Sections for Outlook, Benefits, Risks, Steps, and Summary
 * - A user-friendly disclaimer at the bottom
 *
 * @dependencies
 * - React: For building the UI
 * - Shadcn UI components: Card, CardContent, etc. for styling
 *
 * @notes
 * - MistralResponse shape is imported from the parent's usage (we define an interface here for clarity)
 * - This component is purely presentational
 */

"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

/**
 * Interface describing the shape of data we expect from Mistral AI.
 * This must match the server action's MistralResponse structure.
 */
export interface MistralReportData {
  outlook: string
  benefits: string
  risks: string
  steps: string
  summary: string
}

/**
 * Props for ReportDisplay.
 */
interface ReportDisplayProps {
  /**
   * The AI-generated data from Mistral.
   */
  data: MistralReportData
}

/**
 * A client component that displays the structured AI report.
 * @param props Contains the MistralReportData object.
 * @returns JSX element representing the AI report.
 */
export default function ReportDisplay({ data }: ReportDisplayProps) {
  return (
    <div className="my-8 w-full max-w-3xl space-y-6">
      {/**
       * We present each section in a styled card or box.
       */}
      <Card>
        <CardHeader>
          <CardTitle>General Outlook</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{data.outlook}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Potential Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{data.benefits}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Potential Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{data.risks}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actionable Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{data.steps}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>One-Sentence Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-semibold">{data.summary}</p>
        </CardContent>
      </Card>

      {/**
       * A disclaimer alert for the user, letting them know
       * that these insights are speculative.
       */}
      <Alert variant="default">
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          Nobody knows the future for certain. The information here is
          speculative and meant to spark discussion and awareness about the
          potential impact of AGI.
        </AlertDescription>
      </Alert>
    </div>
  )
}
