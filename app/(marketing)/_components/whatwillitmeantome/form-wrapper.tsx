"use client"

/**
 * @description
 * This client component wraps the form and handles the server action calls.
 * It uses `onSubmitAction` from the newly moved `actions-whatwillitmeantome.ts`.
 *
 * @responsibilities
 * - Provide a callback for the FormInputs that calls the server action
 * - Notify the parent when AI analysis is ready, via onAiSuccess
 *
 * @notes
 * - We do not store local result state here; instead, we pass the result up
 *   through onAiSuccess.
 */

import React, { useTransition } from "react"
import { onSubmitAction } from "../../actions-whatwillitmeantome" // Adjusted import
import FormInputs from "./form-inputs"
import { ActionState } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { MistralReportData } from "./report-display-types"

interface FormWrapperProps {
  /**
   * Called when the Mistral AI call succeeds, passing the structured analysis data.
   */
  onAiSuccess: (data: MistralReportData) => void
}

/**
 * Wraps the user input form and calls the server action.
 */
export default function FormWrapper({ onAiSuccess }: FormWrapperProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  /**
   * This function is provided to our child <FormInputs>.
   * When the user submits, we call the server action onSubmitAction,
   * then pass the result up to onAiSuccess if successful.
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

        // If we succeed, pass data to parent
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
