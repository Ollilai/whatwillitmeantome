"use server"

import { handleMistralAction } from "@/actions/ai/handle-mistral-actions"
import type { ActionState } from "@/types"

/**
 * This server action wrapper calls our handleMistralAction function.
 * Called by the client form in form-inputs.tsx.
 *
 * @param profession - The user's profession or job title
 * @param experience - The user's years of experience
 * @param region     - The user's geographic region
 * @param skillLevel - The user's skill level (0-10)
 * @param details    - Optional extra details
 * @returns A promise with the Mistral AI ActionState
 */
export async function onSubmitAction(
  profession: string,
  experience: number,
  region: string,
  skillLevel: number,
  details?: string
): Promise<ActionState<unknown>> {
  // We simply call handleMistralAction directly and return the result
  return await handleMistralAction(
    profession,
    experience,
    region,
    skillLevel,
    details
  )
}
