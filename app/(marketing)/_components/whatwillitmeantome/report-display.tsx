"use client"

/**
 * @description
 * Displays the structured AI report data once the Mistral API returns it.
 *
 * @responsibilities
 * - Show each section: Outlook, Benefits, Risks, Steps, Summary
 * - Provide disclaimers about speculative nature of AI
 *
 * @notes
 * - The shape MistralReportData matches the server response
 */

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MistralReportData } from "./report-display-types"

/**
 * Export the type for convenience
 */
export type { MistralReportData }

interface ReportDisplayProps {
  /**
   * The AI-generated data from Mistral, including analysis sections.
   */
  data: MistralReportData
}

/**
 * Shows the final AI analysis in separate cards.
 */
export default function ReportDisplay({ data }: ReportDisplayProps) {
  return (
    <div className="my-8 w-full max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{data.summary}</p>
        </CardContent>
      </Card>

      {/* Disclaimer alert */}
      <Alert variant="default">
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          Nobody knows the future for certain. The information here is
          speculative and intended to highlight potential impacts of AGI.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data.impact}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data.opportunities}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data.challenges}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills to Develop</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data.skills}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
