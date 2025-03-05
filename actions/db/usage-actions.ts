/**
 * @description
 * This server actions file provides functions to create usage logs
 * in the usage_logs table for analytics or tracking events such as
 * "report_generated", "shared_twitter", etc.
 *
 * It is responsible for:
 * - Accepting input data (eventType, optional userId)
 * - Inserting a new row into usage_logs via Drizzle ORM
 * - Returning an ActionState indicating success/failure
 *
 * Key features:
 * - createUsageLogAction: Insert a usage log record with optional user ID
 *
 * @dependencies
 * - db from "@/db/db": Our Drizzle-ORM connected Postgres instance
 * - usageTable from "@/db/schema/usage-schema": Schema for the usage_logs table
 * - ActionState from "@/types": The unified type for server actions
 *
 * @notes
 * - We rely on id: uuid().defaultRandom() in usageTable, so no need for manual UUID generation
 * - createdAt is automatically handled by .defaultNow()
 */

"use server"

import { db } from "@/db/db"
import { usageTable } from "@/db/schema/usage-schema"
import { ActionState } from "@/types"

/**
 * @function createUsageLogAction
 * @async
 * @description
 * Inserts a new usage log record into the usage_logs table.
 *
 * @param {string} eventType - The type of event (e.g. "report_generated", "shared_twitter")
 * @param {string} [userId]  - Optional user ID to associate with the event
 *
 * @returns {Promise<ActionState<void>>} A promise resolving to an ActionState object
 *
 * @example
 * const res = await createUsageLogAction("report_generated", "user_123")
 * if (res.isSuccess) {
 *   console.log("Usage log created")
 * } else {
 *   console.error("Failed to create usage log")
 * }
 */
export async function createUsageLogAction(
  eventType: string,
  userId?: string
): Promise<ActionState<void>> {
  try {
    await db.insert(usageTable).values({
      eventType,
      userId
    })

    return {
      isSuccess: true,
      message: "Usage log created",
      data: undefined
    }
  } catch (error) {
    console.error("Error creating usage log:", error)

    return {
      isSuccess: false,
      message: "Failed to create usage log"
    }
  }
}
