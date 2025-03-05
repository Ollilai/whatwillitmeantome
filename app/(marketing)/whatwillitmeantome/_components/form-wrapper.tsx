/**
 * @description
 * This client component serves as a wrapper that handles the AI submission flow:
 * - It renders FormInputs (the user input form)
 * - On success, it calls a prop function `onAiSuccess(data)` to let the parent
 *   page store the AI data in parent state
 *
 * Key features:
 * - Accepts a callback to pass the Mistral AI result up
 * - Maintains the existing form input logic
 *
 * @dependencies
 * - form-inputs.tsx: actual form UI
 *
 * @notes
 * - The major change here is that we remove the old local `result` state
 *   and instead pass successful results up to the parent
 */

"use client"

import React, { useTransition } from "react"
import { onSubmitAction } from "../actions"
import FormInputs from "./form-inputs"
import { ActionState } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { MistralReportData } from "./report-display"

/**
 * Props for FormWrapper, which includes the callback to be called on success.
 */
interface FormWrapperProps {
  /**
   * Callback invoked when the AI call has succeeded, with the structured data.
   */
  onAiSuccess: (data: MistralReportData) => void
}

/**
 * FormWrapper calls the server action and on success notifies the parent.
 */
export default function FormWrapper({ onAiSuccess }: FormWrapperProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  /**
   * Handler invoked by the child form on submit.
   * We wrap the server action and handle success or error.
   */
  const handleSubmit = async (
    profession: string,
    experience: number,
    region: string,
    skillLevel: number,
    details?: string
  ): Promise<ActionState<unknown>> => {
    return new Promise(resolve => {
      startTransition(async () => {
        const result = await onSubmitAction(
          profession,
          experience,
          region,
          skillLevel,
          details
        )

        if (!result.isSuccess) {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive"
          })
          resolve(result)
          return
        }

        // If we succeed, we have data -> pass to parent.
        // The shape should match MistralReportData.
        const data = result.data as MistralReportData
        onAiSuccess(data)

        toast({
          title: "Success",
          description: "Your career analysis is ready!"
        })

        resolve(result)
      })
    })
  }

  return <FormInputs onSubmitAction={handleSubmit} />
}
