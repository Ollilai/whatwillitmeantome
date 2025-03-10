"use server"

import { ActionState } from "@/types"

/**
 * Logs when a user shares content to social media
 * @param network - The social network used (e.g., "twitter", "linkedin")
 * @param text - The text being shared
 * @returns A promise with success/failure state
 */
export async function onShareAction(
  network: string,
  text: string
): Promise<ActionState<void>> {
  try {
    console.log(`Shared to ${network}: ${text.substring(0, 30)}...`)
    
    // Here you would typically log to your database
    // Example: await db.insert(usageLogsTable).values({ type: 'share', network, text })
    
    return {
      isSuccess: true,
      message: "Share logged successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error logging share:", error)
    return { 
      isSuccess: false, 
      message: "Failed to log share" 
    }
  }
} 