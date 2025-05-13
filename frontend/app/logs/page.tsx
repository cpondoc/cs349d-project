"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchLogs, type LogEntry } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function LogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchLogs()
        setLogs(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch logs')
      } finally {
        setIsLoading(false)
      }
    }

    loadLogs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Query Logs</h1>

        <Card className="p-6">
          {isLoading ? (
            <div className="text-center py-4">Loading logs...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No logs found. Try running some queries first.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Query</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow 
                    key={log.id}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => router.push(`/logs/${log.id}`)}
                  >
                    <TableCell>
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {log.query}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  )
} 