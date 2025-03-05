/**
 * @description
 * This client component handles the state management for the WhatWillItMeantome page.
 * It uses React hooks to store the Mistral AI response data and conditionally renders
 * the report and placard components when data is available.
 */

"use client"

import React, { useState } from "react"
import FormWrapper from "./form-wrapper"
import ReportDisplay, { MistralReportData } from "./report-display"
import Placard from "./placard"

export default function PageClientBoundary() {
  const [mistralData, setMistralData] = useState<MistralReportData | null>(null)

  /**
   * Called by the child component when the AI call is successful.
   * We store the structured data in state. Then we display it below.
   */
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

      {/**
       * Our client form. We pass a callback on AI success to store the data
       * in this parent-level state.
       */}
      <FormWrapper onAiSuccess={handleSuccess} />

      {/**
       * Conditionally render the structured report if we have data.
       */}
      {mistralData && (
        <>
          <ReportDisplay data={mistralData} />

          {/**
           * The placard, which focuses on profession + summary.
           * We do assume the user typed "profession" in the form,
           * but we can store it from the form or we can pass it in.
           * We'll do a quick hack: for demonstration, let's pass
           * the 'profession' from the outlook or something,
           * but ideally we'd store the profession in parent as well.
           */}
          <Placard profession={"Your Career"} data={mistralData} />
        </>
      )}
    </div>
  )
}
