/**
 * @description
 * This server actions file provides functions to interact with the usage_logs table.
 * It includes creating and retrieving usage logs.
 *
 * Key features:
 *  - createUsageLogAction: Insert usage event with optional userId
 *  - getAllUsageLogsAction: Retrieve all usage logs for an admin analytics page
 *
 * @dependencies
 *  - db from "@/db/db": Drizzle-ORM connected Postgres instance
 *  - usageTable from "@/db/schema/usage-schema": The usage_logs table schema
 *  - ActionState from "@/types": standardized return type
 *
 * @notes
 *  - We do not need further changes at this time.
 *  - Step 2 confirmed that usage logging is correct and aligns with the plan.
 */

"use server"

import { db } from "@/db/db"
import { usageTable } from "@/db/schema/usage-schema"
import { ActionState } from "@/types"
import { desc } from "drizzle-orm"

/**
 * @function createUsageLogAction
 * Inserts a usage log record into the usage_logs table.
 *
 * @param {string} eventType - The event name, e.g. "report_generated"
 * @param {string} [userId]  - Optional user ID
 *
 * @returns {Promise<ActionState<void>>}
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
 * Retrieves all usage logs from the usage_logs table, newest first.
 *
 * @returns {Promise<ActionState<{ eventType: string; userId?: string | null; createdAt: Date }[]>>}
 */
export async function getAllUsageLogsAction(): Promise<
  ActionState<{ eventType: string; userId?: string | null; createdAt: Date }[]>
> {
  try {
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
