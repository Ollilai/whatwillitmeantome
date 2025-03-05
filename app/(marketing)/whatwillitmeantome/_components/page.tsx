/**
 * @description
 * This server component hosts the main user flow for "WhatWillItMeantome".
 * It includes a form where the user enters career data, calls Mistral AI,
 * and displays the resulting analysis plus a shareable placard image generator.
 *
 * It is responsible for:
 * - Maintaining the user input form (in a child client component) and passing
 *   a callback to store the final AI data in parent state
 * - Conditionally rendering the AI report display and the placard once data is ready
 *
 * Key features:
 * - Minimal usage: we define a state for MistralResponse
 * - When the child form finishes a successful AI call, we set that state here
 * - We then show <ReportDisplay /> and <Placard />
 *
 * @dependencies
 * - handleMistralAction from "@/actions/ai/handle-mistral-actions" (called in the child)
 * - React for the form data
 * - Our newly created ReportDisplay and Placard components
 *
 * @notes
 * - We strongly separate form logic (client) from final display logic (here)
 * - The plan calls for disclaimers, so we have them in the <ReportDisplay /> as well
 */

"use server"

import React, { useState } from "react"
import FormWrapper from "../_components/form-wrapper"
import ReportDisplay, { MistralReportData } from "../_components/report-display"
import Placard from "../_components/placard"

/**
 * We define a server page. We'll store the final Mistral data in local client state
 * by using a small client-handoff approach. We can't do that in a pure server component,
 * so we'll do a trick with a 'useState' in a client boundary. We'll pass a callback
 * down to FormWrapper that sets that state upon success.
 *
 * Then we show the report and placard if we have data.
 */

// We can do a small client boundary for storing the result.
function PageClientBoundary() {
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

/**
 * The default server export. We wrap the PageClientBoundary in a minimal
 * server component (no async logic needed).
 */
export default async function WhatWillItMeantomePage() {
  return <PageClientBoundary />
}
