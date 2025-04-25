"use client"

import { useState, useEffect } from "react"
import { AgentRunsList } from "@/components/agent-runs-list"
import { EventsList } from "@/components/events-list"
import { parseJsonl } from "@/lib/parse-jsonl"
import { fetchTelemetryData } from "@/lib/data-service"
import type { AgentRun, TelemetryEvent } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw } from "lucide-react"

export default function TelemetryDashboard() {
  const [telemetryData, setTelemetryData] = useState<TelemetryEvent[]>([])
  const [agentRuns, setAgentRuns] = useState<AgentRun[]>([])
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const [selectedRunEvents, setSelectedRunEvents] = useState<TelemetryEvent[]>([])
  const [dataPath, setDataPath] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loadTelemetryData = async (path: string) => {
    console.log("HIII")
    setIsLoading(true)
    try {
      console.log("IN HERE")
      const data = await fetchTelemetryData(path)
      console.log(data)
      const parsedData = parseJsonl(data)
      console.log(parsedData)
      console.log("HEYO")
      setTelemetryData(parsedData)

      // Extract agent runs
      const runs: AgentRun[] = []
      parsedData.forEach((event) => {
        if (event.name === "agent_run" && event.properties?.agent_id) {
          runs.push({
            id: event.properties.agent_id,
            task: event.properties.task || "Unknown task",
            model: event.properties.model_name || "Unknown model",
            timestamp: new Date().toISOString(), // In a real app, you'd extract this from the data
            events: [],
          })
        }
      })

      setAgentRuns(runs)
      setSelectedRunId(null)
      setSelectedRunEvents([])
    } catch (error) {
      console.error("Error loading telemetry data:", error)
      alert("Error loading telemetry data. Please check the path and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   if (dataPath) {
  //     loadTelemetryData(dataPath);
  //   }
  // }, [dataPath]);

  const handleRunSelect = (runId: string) => {
    setSelectedRunId(runId)

    // Filter events for the selected run
    const runEvents = telemetryData.filter(
      (event) =>
        (event.name === "agent_run" && event.properties?.agent_id === runId) ||
        (event.name === "agent_step" && event.properties?.agent_id === runId) ||
        (event.name === "agent_end" && event.properties?.agent_id === runId) ||
        event.name === "controller_registered_functions",
    )

    setSelectedRunEvents(runEvents)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Browser Agent Telemetry Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Telemetry Source</h2>
              <div className="flex space-x-2">
                <Input
                  value={dataPath}
                  onChange={(e) => setDataPath(e.target.value)}
                  placeholder="Path to telemetry data"
                  className="flex-1"
                />
                <Button onClick={() => loadTelemetryData(dataPath)} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Load"}
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Agent Runs</h2>
              <AgentRunsList runs={agentRuns} selectedRunId={selectedRunId} onRunSelect={handleRunSelect} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {selectedRunId ? `Events for Run: ${selectedRunId}` : "Select a run to view events"}
              </h2>

              {selectedRunId ? (
                <EventsList events={selectedRunEvents} />
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>Select a run to view its events</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
