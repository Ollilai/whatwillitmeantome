/**
 * @description
 * Initializes the database connection and schema for the app.
 *
 * This file sets up the Postgres client using `postgres`,
 * configures environment variables for the DB via `dotenv`,
 * and uses `drizzle-orm` to create a typed database instance.
 *
 * @dependencies
 * - dotenv: Loads environment variables from `.env.local`
 * - postgres: The Postgres client library
 * - drizzle-orm/postgres-js: The Drizzle ORM integration with Postgres
 *
 * @notes
 * - We attach the `schema` object to Drizzle, allowing typed queries.
 * - Includes profilesTable and usageTable in the schema.
 */

import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

// Import schemas
import { profilesTable, usageTable } from "@/db/schema"

config({ path: ".env.local" })

// We collect all table schemas into a single schema object
const schema = {
  profiles: profilesTable,
  usage: usageTable
}

// Create the Postgres client using the DATABASE_URL environment variable
const client = postgres(process.env.DATABASE_URL!)

// Export the Drizzle DB instance, providing our combined schema
export const db = drizzle(client, { schema })
