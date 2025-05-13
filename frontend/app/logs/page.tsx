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
import { usePageTitle } from "@/components/page-title-context"

export default function LogsPage() {
  const router = useRouter()
  const { setTitle } = usePageTitle()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTitle("Query Logs")
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
  }, [setTitle])

  return (
    <div className="">
      {isLoading ? (
        <div className="text-center py-4">Loading logs...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No logs found. Try running some queries first.
        </div>
      ) : (
        <div className="rounded-xl shadow-lg p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400">Timestamp</TableHead>
                <TableHead className="text-gray-400">Query</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow 
                  key={log.id}
                  className="cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => router.push(`/logs/${log.id}`)}
                >
                  <TableCell className="font-mono text-gray-100">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-md truncate font-mono text-gray-100">
                    {log.query}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
} 