"use client"

/**
 * @description
 * This client component handles the state for the "WhatWillItMeantome" page.
 * It stores the AI data after a successful analysis and conditionally renders
 * the report display and placard.
 *
 * @responsibilities
 * - Maintain the mistralData state
 * - Render <FormWrapper> which calls Mistral AI
 * - Render the final <ReportDisplay> and <Placard> once data is available
 *
 * @notes
 * - The disclaimers are in the server component above, but we also show disclaimers
 *   within the <ReportDisplay> itself.
 */

import React, { useState } from "react"
import { MistralReportData } from "./report-display-types"
import FormWrapper from "./form-wrapper"
import ReportDisplay from "./report-display"
import Placard from "./placard"

export default function PageClientBoundary() {
  const [mistralData, setMistralData] = useState<MistralReportData | null>(null)

  const handleSuccess = (data: MistralReportData) => {
    setMistralData(data)
  }

  return (
    <div className="space-y-4 p-8">
      <h1 className="mb-4 text-2xl font-bold">What Will It Mean To Me?</h1>

      <p className="text-muted-foreground">
        Enter your career details below. We'll analyze how emerging AGI might
        affect you and provide a structured report.
      </p>

      <FormWrapper onAiSuccess={handleSuccess} />

      {mistralData && (
        <>
          <ReportDisplay data={mistralData} />
          <Placard profession={mistralData.profession} data={mistralData} />
        </>
      )}
    </div>
  )
}
