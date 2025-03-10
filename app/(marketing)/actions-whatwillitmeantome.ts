"use server"

/**
 * @description
 * This server actions file provides functionality for the "WhatWillItMeantome"
 * feature in the marketing route.
 *
 * It is responsible for:
 * - Submitting user career details to Mistral for analysis
 * - Logging sharing events when a user shares their result
 *
 * @notes
 * - onSubmitAction calls the handleMistralAction from "@/actions/ai/handle-mistral-actions"
 * - onShareAction logs a usage event for social sharing
 */

import { ActionState } from "@/types"
import { handleMistralAction } from "@/actions/ai/handle-mistral-actions"
import { createUsageLogAction } from "@/actions/db/usage-actions"

/**
 * Submits user input to Mistral for AI-based career analysis.
 *
 * @param profession - The user's profession or job title
 * @param experience - Years of experience
 * @param region - Geographic region
 * @param skillLevel - Self-rated skill level (0-10)
 * @param details - Optional additional details
 * @returns ActionState with Mistral's analysis or an error
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
 * Logs a social share event in usage logs.
 *
 * @param network - The social network name (e.g. "twitter", "linkedin")
 * @returns ActionState indicating success or failure
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
