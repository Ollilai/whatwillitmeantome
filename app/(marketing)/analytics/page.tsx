/**
 * @description
 * This server page displays a simple analytics dashboard showing all usage logs.
 *
 * It is responsible for:
 * - Calling getAllUsageLogsAction to retrieve usage logs from the DB
 * - Rendering them in a basic table
 *
 * Key features:
 * - Minimal styling for clarity
 * - Provides a quick overview of usage events
 *
 * @dependencies
 * - getAllUsageLogsAction from "@/actions/db/usage-actions"
 * - React for building the UI
 *
 * @notes
 * - For a larger dataset, you might add pagination or filtering
 */

"use server"

import { getAllUsageLogsAction } from "@/actions/db/usage-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

export default async function AnalyticsPage() {
  // Fetch all usage logs from the server action
  const logsResult = await getAllUsageLogsAction()

  // If the fetch fails, show an error (in a real app, handle gracefully)
  if (!logsResult.isSuccess) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="mb-4 text-2xl font-bold">Analytics</h1>
        <p className="text-red-500">
          Failed to fetch usage logs: {logsResult.message}
        </p>
      </div>
    )
  }

  const logs = logsResult.data

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-2xl font-bold">Analytics Dashboard</h1>

      <p className="text-muted-foreground mb-6">
        Below is a simple list of usage logs recorded by our system.
      </p>

      {logs.length === 0 ? (
        <p className="text-muted-foreground">No usage logs found.</p>
      ) : (
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Event Type</TableHead>
              <TableHead className="w-1/3">User ID</TableHead>
              <TableHead className="w-1/3">Created At</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.map((log, idx) => (
              <TableRow key={idx}>
                <TableCell>{log.eventType}</TableCell>
                <TableCell>{log.userId || "N/A"}</TableCell>
                <TableCell>
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
