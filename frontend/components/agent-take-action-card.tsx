import { Database, ChevronDown, ChevronRight, Globe, FileText } from "lucide-react"
import type { TelemetryEvent } from "@/lib/types"
import { EventCard } from "./event-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AgentTakeActionCardProps {
  event: TelemetryEvent
  isExpanded: boolean
  onToggle: () => void
}

export function AgentTakeActionCard({ event, isExpanded, onToggle }: AgentTakeActionCardProps) {
  console.log(event)
  const getEventIcon = () => Database
  const getEventSummary = () => `Step ${event.properties?.step_no}: Metadata`
  const [showBrowserContext, setShowBrowserContext] = useState(false)
  const [showFileInfo, setShowFileInfo] = useState(false)

  // Important state
  const browserContext = event.properties?.agent_actions[0]?.browser_context || {}
  const availableFilePaths = event.properties?.available_file_paths || []
  const pageExtractionModel = event.properties?.page_extraction_llm || ""

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
              {/* File Information Section */}
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowFileInfo(!showFileInfo)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showFileInfo ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <h3 className="font-medium text-sm">Action Information</h3>
                  </div>
                </div>

                {showFileInfo && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      {/* Page Extraction Model */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Page Extraction Model:</span>
                        </div>
                        <p className="text-sm ml-6">{pageExtractionModel || "None"}</p>
                      </div>

                      {/* Available File Paths */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Available File Paths:</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          {availableFilePaths.length > 0 ? (
                            availableFilePaths.map((path: string, index: number) => (
                              <p key={index} className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                                {path}
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No file paths available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Browser Context Section */}
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowBrowserContext(!showBrowserContext)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showBrowserContext ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium text-sm">Browser Context</h3>
                  </div>
                </div>

                {showBrowserContext && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      {/* Page Load Settings */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Page Load Settings:</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <p className="text-sm">Minimum Wait: {browserContext.minimum_wait_page_load_time}s</p>
                          <p className="text-sm">Network Idle Wait: {browserContext.wait_for_network_idle_page_load_time}s</p>
                          <p className="text-sm">Maximum Wait: {browserContext.maximum_wait_page_load_time}s</p>
                          <p className="text-sm">Wait Between Actions: {browserContext.wait_between_actions}s</p>
                        </div>
                      </div>

                      {/* Window Settings */}
                      {browserContext.browser_window_size && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">Window Size:</span>
                          </div>
                          <div className="ml-6 space-y-1">
                            <p className="text-sm">Width: {browserContext.browser_window_size.width}px</p>
                            <p className="text-sm">Height: {browserContext.browser_window_size.height}px</p>
                          </div>
                        </div>
                      )}

                      {/* Feature Settings */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Feature Settings:</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <p className="text-sm">Security Disabled: {browserContext.disable_security ? "Yes" : "No"}</p>
                          <p className="text-sm">Highlight Elements: {browserContext.highlight_elements ? "Yes" : "No"}</p>
                          <p className="text-sm">Include Dynamic Attributes: {browserContext.include_dynamic_attributes ? "Yes" : "No"}</p>
                          <p className="text-sm">Keep Alive: {browserContext.keep_alive ? "Yes" : "No"}</p>
                          <p className="text-sm">Force New Context: {browserContext.force_new_context ? "Yes" : "No"}</p>
                        </div>
                      </div>

                      {/* Path Settings */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Path Settings:</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <p className="text-sm">Recording Path: {browserContext.save_recording_path || "None"}</p>
                          <p className="text-sm">Downloads Path: {browserContext.save_downloads_path || "None"}</p>
                          <p className="text-sm">HAR Path: {browserContext.save_har_path || "None"}</p>
                          <p className="text-sm">Trace Path: {browserContext.trace_path || "None"}</p>
                        </div>
                      </div>

                      {/* Optional Settings */}
                      {(browserContext.locale || browserContext.user_agent || browserContext.timezone_id) && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">Optional Settings:</span>
                          </div>
                          <div className="ml-6 space-y-1">
                            {browserContext.locale && <p className="text-sm">Locale: {browserContext.locale}</p>}
                            {browserContext.user_agent && <p className="text-sm">User Agent: {browserContext.user_agent}</p>}
                            {browserContext.timezone_id && <p className="text-sm">Timezone: {browserContext.timezone_id}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      )}
    </EventCard>
  )
} 