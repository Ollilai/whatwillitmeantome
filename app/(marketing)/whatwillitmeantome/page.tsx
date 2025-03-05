/**
 * @description
 * This server component hosts the main user flow for "WhatWillItMeantome".
 * It integrates the FormInputs client component and supplies a server action
 * that calls handleMistralAction from "@/actions/ai/handle-mistral-actions".
 *
 * It is responsible for:
 * - Providing a server function onSubmitAction that the client form can call
 * - Rendering the form within a marketing layout
 *
 * Key features:
 * - Minimal usage: calls handleMistralAction, returning the response
 * - We do not yet display a fancy report or placard (that is in later steps)
 *
 * @dependencies
 * - handleMistralAction from "@/actions/ai/handle-mistral-actions"
 * - FormInputs from "./_components/form-inputs"
 *
 * @notes
 * - According to our project rule, we cannot directly import handleMistralAction in the client.
 * - So we define a short server function onSubmitAction that references handleMistralAction.
 * - This function is passed down to <FormInputs> as a prop.
 */

"use server"

import React from "react"
import FormWrapper from "./_components/form-wrapper"

// We define a server component, so we can do any server logic or data fetching here.
// The user interacts with the client form. On submit, the client calls the server action.
export default async function WhatWillItMeantomePage() {
  // The server component returns the UI, which includes the client form.
  return (
    <div className="space-y-4 p-8">
      <h1 className="mb-4 text-2xl font-bold">What Will It Mean To Me?</h1>

      <p className="text-muted-foreground">
        Enter your career details below. We'll analyze how emerging AGI might
        affect you and provide a structured report.
      </p>

      {/* Render our client wrapper component, which will use the form-inputs component */}
      <FormWrapper />
    </div>
  )
}
