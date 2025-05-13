"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchLogById, type LogEntry } from "@/lib/api"
import Link from "next/link"

interface ReportData {
  [key: string]: any
}

export default function LogDetailPage() {
  const params = useParams()
  const [log, setLog] = useState<LogEntry | null>(null)
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLog = async () => {
      try {
        const data = await fetchLogById(params.id as string)
        setLog(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch log')
      } finally {
        setIsLoading(false)
      }
    }

    loadLog()
  }, [params.id])

  const loadReport = async () => {
    if (!log?.file) return
    
    setIsLoadingReport(true)
    try {
      const response = await fetch(log.file)
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report')
    } finally {
      setIsLoadingReport(false)
    }
  }

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
            <div className="text-center py-4">Loading log details...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : log ? (
            <div className="space-y-4">
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
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Report</h2>
                  <div className="mt-2 space-y-4">
                    {!reportData.length && (
                      <Button 
                        onClick={loadReport}
                        disabled={isLoadingReport}
                        variant="outline"
                      >
                        {isLoadingReport ? 'Loading Report...' : 'Load Report'}
                      </Button>
                    )}
                    {reportData.length > 0 && (
                      <div className="space-y-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Found {reportData.length} entries
                        </div>
                        <div className="space-y-2">
                          {reportData.map((entry, index) => (
                            <pre 
                              key={index}
                              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto text-sm"
                            >
                              {JSON.stringify(entry, null, 2)}
                            </pre>
                          ))}
                        </div>
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