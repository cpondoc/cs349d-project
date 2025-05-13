"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchLogById, type LogEntry } from "@/lib/api"
import { EventsList } from "@/components/events-list"
import Link from "next/link"

interface ReportData {
  name: string
  properties: Record<string, any>
  timestamp: string
}

export default function LogDetailPage() {
  const params = useParams()
  const [log, setLog] = useState<LogEntry | null>(null)
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLogAndReport = async () => {
      try {
        // Load log details
        const logData = await fetchLogById(params.id as string)
        setLog(logData)

        // If there's a report file, load it
        if (logData.file) {
          const response = await fetch(logData.file)
          if (!response.ok) {
            throw new Error('Failed to fetch report')
          }
          const text = await response.text()
          // Parse JSONL format - each line is a separate JSON object
          const lines = text.split('\n').filter(line => line.trim())
          const parsedData = lines.map(line => {
            try {
              return JSON.parse(line)
            } catch (e) {
              console.error('Failed to parse JSON line:', line)
              return null
            }
          }).filter(Boolean) as ReportData[]
          
          setReportData(parsedData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setIsLoading(false)
      }
    }

    loadLogAndReport()
  }, [params.id])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Log Details</h1>
          <Link href="/logs">
            <Button variant="outline">Back to Logs</Button>
          </Link>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <div className="text-center py-4">Loading log details and report...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : log ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</h2>
                <p className="mt-1 text-lg text-gray-900 dark:text-white">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Query</h2>
                <p className="mt-1 text-lg text-gray-900 dark:text-white whitespace-pre-wrap">
                  {log.query}
                </p>
              </div>
              {log.file && (
                <div>
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Report</h2>
                  <div className="space-y-4">
                    {reportData.length > 0 ? (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Found {reportData.length} events
                        </div>
                        <EventsList events={reportData} />
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No events found in report
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Log not found
            </div>
          )}
        </Card>
      </div>
    </div>
  )
} 