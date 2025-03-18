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

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

// Import schemas
import { profilesTable, usageTable } from "@/db/schema"

// We collect all table schemas into a single schema object
const schema = {
  profiles: profilesTable,
  usage: usageTable
}

// Get DATABASE_URL from environment - should be added in Vercel project settings
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error(
    "❌ DATABASE_URL is not defined! Database operations will fail."
  )
}

// Create the Postgres client using the DATABASE_URL environment variable
const connectionString = DATABASE_URL || ""

// Set postgres options with better error handling
const postgresOptions = {
  max: 10, // Limit the number of connections
  idle_timeout: 20, // Timeout after 20 seconds
  connect_timeout: 10, // Connection timeout after 10 seconds
  ssl: { rejectUnauthorized: false } // Important for many hosted PostgreSQL providers
}

// Log connection attempt
console.log("🔌 Attempting to connect to PostgreSQL")

// Create DB instance with proper error handling
let dbInstance: any
try {
  // Create the Postgres client with the connection options
  const client = postgres(connectionString, postgresOptions)

  // Create the Drizzle DB instance, providing our combined schema
  dbInstance = drizzle(client, { schema })

  console.log("✅ PostgreSQL connection initialized")
} catch (error) {
  console.error("❌ Failed to initialize PostgreSQL connection:", error)
  // Create a dummy db object that logs errors instead of crashing
  dbInstance = new Proxy(
    {},
    {
      get(target, prop) {
        if (typeof prop === "string") {
          // Return a function that logs the error for any method called
          return (...args: any[]) => {
            console.error(
              `❌ Database operation '${String(prop)}' failed: Database connection not established`
            )
            throw new Error("Database connection not established")
          }
        }
        return undefined
      }
    }
  )
}

// Export the DB instance
export const db = dbInstance
