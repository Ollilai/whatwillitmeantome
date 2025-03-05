/**
 * @description
 * Defines the database schema for usage logs.
 *
 * This table tracks events such as "report_generated", "shared_twitter", etc.
 * for analytics or usage tracking.
 *
 * @dependencies
 * - drizzle-orm/pg-core: for building the schema
 *
 * @notes
 * - The table includes optional userId, if we want to tie usage logs to a user
 * - Timestamps handled by createdAt with .defaultNow()
 */

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

/**
 * usageTable defines the structure for usage logs within the application.
 * Each record represents a single usage event (e.g. "report_generated").
 */
export const usageTable = pgTable("usage_logs", {
  /**
   * Primary key for usage logs
   */
  id: uuid("id").defaultRandom().primaryKey(),

  /**
   * The event type, e.g. "report_generated", "shared_twitter"
   */
  eventType: text("event_type").notNull(),

  /**
   * Optional user ID if we want to associate the event with a user
   */
  userId: text("user_id"),

  /**
   * Timestamp when the record was created
   */
  createdAt: timestamp("created_at").defaultNow().notNull()
})

/**
 * InsertUsageLog represents the shape of data required to insert a new usage log
 */
export type InsertUsageLog = typeof usageTable.$inferInsert

/**
 * SelectUsageLog represents the shape of data returned by a SELECT query
 */
export type SelectUsageLog = typeof usageTable.$inferSelect
