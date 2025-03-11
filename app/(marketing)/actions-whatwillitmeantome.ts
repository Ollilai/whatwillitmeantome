/**
 * @description
 * This server actions file provides functionality for the "WhatWillItMeantome"
 * feature in the marketing route.
 *
 * It is responsible for:
 * - Submitting user career details to Mistral for AI-based analysis
 * - Logging sharing events when a user shares their result to social media
 *
 * Key Features:
 * - The onSubmitAction calls handleMistralAction to get AI insights
 * - The onShareAction logs a usage event (shared_{network}) in the usage_logs table
 * - Optionally includes the userId if the user is logged in
 *
 * @dependencies
 * - handleMistralAction from "@/actions/ai/handle-mistral-actions"
 * - createUsageLogAction from "@/actions/db/usage-actions"
 * - auth from "@clerk/nextjs/server" to get userId
 *
 * @notes
 * - The social sharing logs are now stored in usage_logs
 * - We embed userId if available
 */

"use server"

import { ActionState } from "@/types"
import { handleMistralAction } from "@/actions/ai/handle-mistral-actions"
import { createUsageLogAction } from "@/actions/db/usage-actions"
import { auth } from "@clerk/nextjs/server"

/**
 * @function onSubmitAction
 * Takes user form input and calls handleMistralAction to get a structured AI result.
 *
 * @param profession - The user's profession/job title
 * @param experience - Years of experience
 * @param region - Geographic region
 * @param skillLevel - Self-rated skill level (1-10)
 * @param details - Any extra details or concerns
 *
 * @returns The structured Mistral analysis or error
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
 * @function onShareAction
 * Logs a share event in usage_logs, with an event type of "shared_{network}".
 *
 * @param network - The social network being shared to, e.g. "twitter", "facebook", etc.
 *
 * @returns Success or error state
 *
 * @notes
 * - We optionally attach the userId if the user is logged in
 * - This helps track how many times users share their results
 */
export async function onShareAction(
  network: string
): Promise<ActionState<void>> {
  try {
    // Use Clerk to see if there's a user session
    const { userId } = await auth()

    // Create a usage log event such as "shared_twitter"
    const eventType = `shared_${network}`

    // Log with optional userId
    const result = await createUsageLogAction(eventType, userId || undefined)

    return result
  } catch (error) {
    console.error("Error logging share action:", error)
    return {
      isSuccess: false,
      message: "Failed to log share action"
    }
  }
}
