import { Flag, ChevronDown, ChevronRight, Clock, ListChecks, PlayCircle, StopCircle, AlertCircle, FileText, Hash, Timer, Brain } from "lucide-react"
import type { TelemetryEvent } from "@/lib/types"
import { EventCard } from "./event-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AgentEndCardProps {
  event: TelemetryEvent
  isExpanded: boolean
  onToggle: () => void
}

interface Result {
  is_done: boolean
  success: boolean | null
  extracted_content?: string
  error?: string
  include_in_memory: boolean
}

export function AgentEndCard({ event, isExpanded, onToggle }: AgentEndCardProps) {
  const getEventIcon = () => Flag
  const getEventSummary = () => `Agent Run Completed`
  const [showRunMetadata, setShowRunMetadata] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showRunStats, setShowRunStats] = useState(false)

  // Important state
  const lastPlan = event.properties?.agent_state?.last_plan || ""
  const agentPaused = event.properties?.agent_state?.paused || false
  const agentStopped = event.properties?.agent_state?.stopped || false
  const numberofFailures = event.properties?.agent_state?.number_of_failures || 0
  const result = event.properties?.agent_state?.last_result || []

  // Run statistics
  const agentId = event.properties?.agent_id || "Unknown"
  const steps = event.properties?.steps || 0
  const maxStepsReached = event.properties?.max_steps_reached || false
  const isDone = event.properties?.is_done || false
  const success = event.properties?.success || false
  const totalInputTokens = event.properties?.total_input_tokens || 0
  const totalDuration = event.properties?.total_duration_seconds || 0
  const errors = event.properties?.errors || []

  return (
    <EventCard
      event={event}
      isExpanded={isExpanded}
      onToggle={onToggle}
      getEventIcon={getEventIcon}
      getEventSummary={getEventSummary}
    >
      {isExpanded && (
        <div className="pt-2 bg-gray-50 dark:bg-gray-800/50">
          <CardContent className="mt-4 pt-0 pb-4 px-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="space-y-4">
              {/* Run Statistics Section */}
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowRunStats(!showRunStats)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showRunStats ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-indigo-500" />
                    <h3 className="font-medium text-sm">Run Statistics</h3>
                  </div>
                </div>

                {showRunStats && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Agent ID:</span>
                        <span className="text-sm font-mono">{agentId}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Steps:</span>
                        <span className={`text-sm ${maxStepsReached ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-300'}`}>
                          {steps} {maxStepsReached && '(Max Steps Reached)'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Completion:</span>
                        <span className={`text-sm ${isDone ? 'text-green-500' : 'text-yellow-500'}`}>
                          {isDone ? 'Done' : 'In Progress'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Success:</span>
                        <span className={`text-sm ${success ? 'text-green-500' : 'text-red-500'}`}>
                          {success ? 'Yes' : 'No'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Total Input Tokens:</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {totalInputTokens.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Timer className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Total Duration:</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {totalDuration.toFixed(2)}s
                        </span>
                      </div>

                      {errors.some(error => error !== null) && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-500">Errors:</span>
                          </div>
                          <div className="ml-6 space-y-1">
                            {errors.map((error, index) => (
                              error && (
                                <div key={index} className="text-sm text-red-500">
                                  Step {index + 1}: {error}
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Run Metadata Section */}
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowRunMetadata(!showRunMetadata)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showRunMetadata ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-purple-500" />
                    <h3 className="font-medium text-sm">Run Summary</h3>
                  </div>
                </div>

                {showRunMetadata && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Final Status:</span>
                        <div className="flex items-center space-x-2">
                          {!agentPaused && !agentStopped && (
                            <span className="text-sm text-green-500 flex items-center">
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Completed Successfully
                            </span>
                          )}
                          {agentPaused && (
                            <span className="text-sm text-yellow-500 flex items-center">
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Paused
                            </span>
                          )}
                          {agentStopped && (
                            <span className="text-sm text-red-500 flex items-center">
                              <StopCircle className="h-4 w-4 mr-1" />
                              Stopped
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Total Failures:</span>
                        <span className={`text-sm ${numberofFailures > 0 ? 'text-red-500' : 'text-green-500'} flex items-center`}>
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {numberofFailures}
                        </span>
                      </div>

                      {lastPlan && (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Final Plan:</span>
                          </div>
                          <pre className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto whitespace-pre-wrap">
                            {lastPlan}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Section */}
              {result.length > 0 && (
                <div className="rounded-md border border-gray-200 dark:border-gray-700">
                  <div
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                    onClick={() => setShowResults(!showResults)}
                  >
                    <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                      {showResults ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                    <div className="flex items-center space-x-2">
                      <ListChecks className="h-4 w-4 text-green-500" />
                      <h3 className="font-medium text-sm">Final Results</h3>
                    </div>
                  </div>

                  {showResults && (
                    <div className="p-4 pt-2">
                      <div className="space-y-4">
                        {result.map((item: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">Result {index + 1}:</span>
                            </div>
                            <div className="ml-6 space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">Status:</span>
                                <span className={`text-sm ${item.is_done ? 'text-green-500' : 'text-yellow-500'}`}>
                                  {item.is_done ? 'Done' : 'In Progress'}
                                </span>
                              </div>
                              {item.success !== null && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">Success:</span>
                                  <span className={`text-sm ${item.success ? 'text-green-500' : 'text-red-500'}`}>
                                    {item.success ? 'Yes' : 'No'}
                                  </span>
                                </div>
                              )}
                              {item.extracted_content && (
                                <div className="space-y-1">
                                  <span className="text-sm">Content:</span>
                                  <pre className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto whitespace-pre-wrap">
                                    {item.extracted_content}
                                  </pre>
                                </div>
                              )}
                              {item.error && (
                                <div className="space-y-1">
                                  <span className="text-sm text-red-500">Error:</span>
                                  <pre className="text-sm font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded-md overflow-x-auto whitespace-pre-wrap text-red-500">
                                    {item.error}
                                  </pre>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">Include in Memory:</span>
                                <span className={`text-sm ${item.include_in_memory ? 'text-green-500' : 'text-gray-500'}`}>
                                  {item.include_in_memory ? 'Yes' : 'No'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      )}
    </EventCard>
  )
} 