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

import React from "react"
import PageClientBoundary from "./_components/page-client-boundary"

/**
 * The default server export. We wrap the PageClientBoundary in a minimal
 * server component (no async logic needed).
 */
export default async function WhatWillItMeantomePage() {
  return <PageClientBoundary />
}
