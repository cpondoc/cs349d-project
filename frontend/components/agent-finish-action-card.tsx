import { CheckCircle2, ChevronDown, ChevronRight, Clock, ListChecks, PlayCircle, StopCircle, AlertCircle, FileText, Globe } from "lucide-react"
import type { TelemetryEvent } from "@/lib/types"
import { EventCard } from "./event-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AgentFinishActionCardProps {
  event: TelemetryEvent
  isExpanded: boolean
  onToggle: () => void
}

interface Tab {
  title?: string
  url: string
  parent_page_id: string | null
}

interface ActionState {
  url?: string
  title?: string
  tabs?: Tab[]
  screenshot?: string
}

interface Result {
  is_done: boolean
  success: boolean | null
  extracted_content?: string
  error?: string
  include_in_memory: boolean
}

export function AgentFinishActionCard({ event, isExpanded, onToggle }: AgentFinishActionCardProps) {
  const getEventIcon = () => CheckCircle2
  const getEventSummary = () => `Step ${event.properties?.step_no}: Action Taken`
  const [showStepMetadata, setShowStepMetadata] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showRunMetadata, setShowRunMetadata] = useState(false)
  const [showActionState, setShowActionState] = useState(false)

  // Important state
  const stepMetadata = event.properties?.step_metadata || {}
  const lastPlan = event.properties?.agent_state?.last_plan || ""
  const agentPaused = event.properties?.agent_state?.paused || false
  const agentStopped = event.properties?.agent_state?.stopped || false
  const numberofFailures = event.properties?.agent_state?.number_of_failures || 0
  const result = event.properties?.agent_state?.last_result || []
  console.log(result)

  // History data
  let historyObject = null
  let actionState: ActionState = {}

  if (event.properties?.step_no < event.properties?.agent_state?.history?.history.length) {
    historyObject = event.properties?.agent_state?.history?.history[Number(event.properties?.step_no)] || []
    actionState = historyObject.state || {}
  }

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
                    <h3 className="font-medium text-sm">Run Metadata</h3>
                  </div>
                </div>

                {showRunMetadata && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Status:</span>
                        <div className="flex items-center space-x-2">
                          {!agentPaused && !agentStopped && (
                            <span className="text-sm text-green-500 flex items-center">
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Running
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
                        <span className="text-sm">Failures:</span>
                        <span className={`text-sm ${numberofFailures > 0 ? 'text-red-500' : 'text-green-500'} flex items-center`}>
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {numberofFailures}
                        </span>
                      </div>

                      {lastPlan && (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Last Plan:</span>
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

              {/* Step Metadata Section */}
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowStepMetadata(!showStepMetadata)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showStepMetadata ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium text-sm">Step Metadata</h3>
                  </div>
                </div>

                {showStepMetadata && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Input Tokens:</span>
                        </div>
                        <p className="text-sm ml-6 text-gray-600 dark:text-gray-300">
                          {stepMetadata.input_tokens?.toLocaleString() || "N/A"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Step Duration:</span>
                        </div>
                        <p className="text-sm ml-6 text-gray-600 dark:text-gray-300">
                          {stepMetadata.step_start_time && stepMetadata.step_end_time
                            ? `${(stepMetadata.step_end_time - stepMetadata.step_start_time).toFixed(2)}s`
                            : "N/A"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Start Time:</span>
                        </div>
                        <p className="text-sm ml-6 text-gray-600 dark:text-gray-300">
                          {stepMetadata.step_start_time
                            ? new Date(stepMetadata.step_start_time * 1000).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">End Time:</span>
                        </div>
                        <p className="text-sm ml-6 text-gray-600 dark:text-gray-300">
                          {stepMetadata.step_end_time
                            ? new Date(stepMetadata.step_end_time * 1000).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* History-dependent sections */}
              {historyObject && (
                <>
                  {/* Action State Section */}
                  <div className="rounded-md border border-gray-200 dark:border-gray-700">
                    <div
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                      onClick={() => setShowActionState(!showActionState)}
                    >
                      <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                        {showActionState ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        <h3 className="font-medium text-sm">Action State</h3>
                      </div>
                    </div>

                    {showActionState && (
                      <div className="p-4 pt-2">
                        <div className="space-y-4">
                          {/* Screenshot at the top */}
                          {actionState.screenshot && (
                            <div className="space-y-2">
                              <div className="ml-6">
                                <img 
                                  src={`data:image/png;base64,${actionState.screenshot}`}
                                  alt="Page screenshot"
                                  className="max-h-[500px] w-auto object-contain rounded-md border border-gray-200 dark:border-gray-700"
                                />
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">Current URL:</span>
                            </div>
                            <p className="text-sm ml-6 text-gray-600 dark:text-gray-300 break-all">
                              {actionState.url || "No URL"}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">Page Title:</span>
                            </div>
                            <p className="text-sm ml-6 text-gray-600 dark:text-gray-300">
                              {actionState.title || "No title"}
                            </p>
                          </div>

                          {actionState.tabs && actionState.tabs.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">Open Tabs:</span>
                              </div>
                              <div className="ml-6 space-y-2">
                                {actionState.tabs.map((tab: any, index: number) => (
                                  <div key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                                    <p className="text-sm font-medium">{tab.title || "Untitled"}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 break-all">{tab.url}</p>
                                    {tab.parent_page_id !== null && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Parent Page ID: {tab.parent_page_id}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

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
                      <h3 className="font-medium text-sm">Results</h3>
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