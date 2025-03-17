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
 *
 * @dependencies
 * - handleMistralAction from "@/actions/ai/handle-mistral-actions"
 * - createUsageLogAction from "@/actions/db/usage-actions"
 *
 * @notes
 * - Authentication has been removed as it's not needed for this project
 */

"use server"

import { ActionState, MistralResponse } from "@/types"
import { handleMistralAction } from "@/actions/ai/handle-mistral-actions"
import { createUsageLogAction } from "@/actions/db/usage-actions"

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
): Promise<ActionState<MistralResponse>> {
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
 * - User ID is no longer tracked as authentication has been removed
 */
export async function onShareAction(
  network: string
): Promise<ActionState<void>> {
  try {
    // Create a usage log event such as "shared_twitter"
    const eventType = `shared_${network}`

    // Log the share event without user ID
    const result = await createUsageLogAction(eventType)

    return result
  } catch (error) {
    console.error("Error logging share action:", error)
    return {
      isSuccess: false,
      message: "Failed to log share action"
    }
  }
}
