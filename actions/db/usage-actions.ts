/**
 * @description
 * This server actions file provides functions to interact with the usage_logs table.
 * It includes creating and retrieving usage logs.
 *
 * Key features:
 * - createUsageLogAction: Insert a usage log record for analytics/tracking
 * - getAllUsageLogsAction: Retrieve all usage logs for a simple analytics view
 *
 * @dependencies
 * - db from "@/db/db": Drizzle-ORM connected Postgres instance
 * - usageTable from "@/db/schema/usage-schema": The usage_logs table schema
 * - ActionState from "@/types": Our standardized return type
 *
 * @notes
 * - The newly added getAllUsageLogsAction returns all usage logs. For larger data sets,
 *   pagination might be desired, but this is sufficient for an MVP.
 */

"use server"

import { db } from "@/db/db"
import { usageTable } from "@/db/schema/usage-schema"
import { ActionState } from "@/types"
import { desc } from "drizzle-orm"

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

/**
 * @function getAllUsageLogsAction
 * @async
 * @description
 * Retrieves all usage logs from the usage_logs table, ordered by most recent.
 *
 * @returns {Promise<ActionState<{ eventType: string; userId?: string | null; createdAt: Date }[]>>}
 *   A promise resolving to an ActionState object with an array of usage log data.
 *
 * @example
 * const res = await getAllUsageLogsAction()
 * if (res.isSuccess) {
 *   console.log("All usage logs:", res.data)
 * } else {
 *   console.error("Failed to retrieve usage logs")
 * }
 */
export async function getAllUsageLogsAction(): Promise<
  ActionState<{ eventType: string; userId?: string | null; createdAt: Date }[]>
> {
  try {
    // Retrieve all logs, newest first
    const logs = await db
      .select({
        eventType: usageTable.eventType,
        userId: usageTable.userId,
        createdAt: usageTable.createdAt
      })
      .from(usageTable)
      .orderBy(desc(usageTable.createdAt))

    return {
      isSuccess: true,
      message: "All usage logs retrieved successfully",
      data: logs
    }
  } catch (error) {
    console.error("Error retrieving usage logs:", error)
    return { isSuccess: false, message: "Failed to get usage logs" }
  }
}
