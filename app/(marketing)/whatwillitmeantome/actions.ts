/**
 * @description
 * This server actions file provides functionality for the "WhatWillItMeantome"
 * route in terms of calling Mistral (already existing) and now includes a
 * share event action for logging usage. We call createUsageLogAction with
 * an event type "shared_<network>" to track social sharing.
 *
 * @notes
 * - onSubmitAction is used to generate the AI analysis
 * - onShareAction is new, used to log share events
 * - We import createUsageLogAction from "@/actions/db/usage-actions"
 */
"use server"

import { ActionState } from "@/types"
import { handleMistralAction } from "@/actions/ai/handle-mistral-actions"
import { createUsageLogAction } from "@/actions/db/usage-actions"

/**
 * onSubmitAction
 *
 * Called by the client form in form-inputs.tsx to request AI analysis from Mistral.
 * @param profession The user's profession or job title
 * @param experience The user's years of experience
 * @param region     The user's geographic region
 * @param skillLevel The user's skill level (0-10)
 * @param details    Optional extra details
 * @returns A promise with the Mistral AI ActionState
 */
export async function onSubmitAction(
  profession: string,
  experience: number,
  region: string,
  skillLevel: number,
  details?: string
): Promise<ActionState<unknown>> {
  return await handleMistralAction(
    profession,
    experience,
    region,
    skillLevel,
    details
  )
}

/**
 * onShareAction
 *
 * Logs a usage event for social sharing. For example "shared_twitter" or "shared_linkedin".
 * Called from the SocialSharing client component. The usage logs are stored for analytics.
 *
 * @param network The string representing the network (e.g. "twitter", "linkedin")
 * @returns An ActionState<void> indicating success/failure
 */
export async function onShareAction(
  network: string
): Promise<ActionState<void>> {
  try {
    const eventType = `shared_${network}`
    const res = await createUsageLogAction(eventType)
    return res
  } catch (error) {
    console.error("Error logging share action:", error)
    return {
      isSuccess: false,
      message: "Failed to log share action"
    }
  }
}
