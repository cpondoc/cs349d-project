import { Bot, Brain, ChevronDown, ChevronRight, ListChecks, History, Globe, MessageSquare, BookOpen } from "lucide-react"
import type { TelemetryEvent } from "@/lib/types"
import { EventCard } from "./event-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AgentDetermineActionCardProps {
  event: TelemetryEvent
  isExpanded: boolean
  onToggle: () => void
}

export function AgentDetermineActionCard({ event, isExpanded, onToggle }: AgentDetermineActionCardProps) {
  console.log(event)
  const getEventIcon = () => Brain
  console.log(event.properties?.step_no)
  const getEventSummary = () => `Step ${event.properties?.step_no}: ${event.properties?.model_output?.current_state?.next_goal}`
  const [showActionDetails, setShowActionDetails] = useState(false)
  const [showCurrentState, setShowCurrentState] = useState(false)
  const [showBrowserState, setShowBrowserState] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showPlanningAndMemory, setShowPlanningAndMemory] = useState(false)

  // Important state
  const currentState = event.properties?.model_output?.current_state || {}
  const action = event.properties?.model_output?.action || []
  const browserState = event.properties?.browser_state?.state || {}
  const messages = event.properties?.message_manager_state?.message?.kwargs?.content || []
  const tokens = event.properties?.message_manager_state?.metadata?.tokens || 0

  // State for messages and prompting
  const planningState = event.properties?.planning_state || {}
  const proceduralMemory = event.properties?.procedural_memory || {}

  // Find any images in the messages
  const images = messages.filter((message: any) => message.type === "image_url")
  const textMessages = messages.filter((message: any) => message.type === "text")

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
          {/* Images at the top */}
          {images.length > 0 && (
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {images.map((image: any, index: number) => (
                  <div key={index} className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <img 
                      src={image.image_url.url} 
                      alt="Action context"
                      className="w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <CardContent className="mt-4 pt-0 pb-4 px-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="space-y-4">
              {/* Prompt Section */}
              {textMessages.length > 0 && (
                <div className="rounded-md border border-gray-200 dark:border-gray-700">
                  <div
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                    onClick={() => setShowPrompt(!showPrompt)}
                  >
                    <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                      {showPrompt ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-indigo-500" />
                      <h3 className="font-medium text-sm">Prompt for Action</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({tokens} tokens)</span>
                    </div>
                  </div>

                  {showPrompt && (
                    <div className="p-4 pt-2">
                      <div className="space-y-4">
                        {textMessages.map((message: any, index: number) => (
                          <pre 
                            key={index}
                            className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto whitespace-pre-wrap"
                          >
                            {message.text}
                          </pre>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Planning and Memory Section */}
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowPlanningAndMemory(!showPlanningAndMemory)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showPlanningAndMemory ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    <h3 className="font-medium text-sm">Planning and Memory</h3>
                  </div>
                </div>

                {showPlanningAndMemory && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      {/* Planning State */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Planning State:</span>
                        </div>
                        <pre className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                          {planningState === "None" ? "None" : JSON.stringify(planningState, null, 2)}
                        </pre>
                      </div>

                      {/* Procedural Memory */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Procedural Memory:</span>
                        </div>
                        <pre className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                          {proceduralMemory === "None" ? "None" : JSON.stringify(proceduralMemory, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Current State Section */}
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowCurrentState(!showCurrentState)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showCurrentState ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <History className="h-4 w-4 text-amber-500" />
                    <h3 className="font-medium text-sm">Current State</h3>
                  </div>
                </div>

                {showCurrentState && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Previous Goal:</span>
                        </div>
                        <p className="text-sm ml-6 text-gray-600 dark:text-gray-300">
                          {currentState.evaluation_previous_goal || "No previous goal"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Memory:</span>
                        </div>
                        <p className="text-sm ml-6 text-gray-600 dark:text-gray-300">
                          {currentState.memory || "No memory context"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Next Goal:</span>
                        </div>
                        <p className="text-sm ml-6 text-gray-600 dark:text-gray-300">
                          {currentState.next_goal || "No next goal set"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Details Section */}
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowActionDetails(!showActionDetails)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showActionDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium text-sm">Selected Action</h3>
                  </div>
                </div>

                {showActionDetails && (
                  <div className="p-4 pt-2">
                    <div className="space-y-2">
                      {action.length > 0 && action[0] && (
                        <>
                          {Object.entries(action[0]).map(([key, value]) => {
                            if (value !== null) {
                              return (
                                <div key={key} className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-sm">Action:</span>
                                    <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{key}</span>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-sm">Parameters:</span>
                                    </div>
                                    <pre className="text-sm ml-6 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-x-auto">
                                      {JSON.stringify(value, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          })}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Browser State Section */}
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowBrowserState(!showBrowserState)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showBrowserState ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium text-sm">Browser State</h3>
                  </div>
                </div>

                {showBrowserState && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Current URL:</span>
                        </div>
                        <p className="text-sm ml-6 text-gray-600 dark:text-gray-300 break-all">
                          {browserState.url || "No URL"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Page Title:</span>
                        </div>
                        <p className="text-sm ml-6 text-gray-600 dark:text-gray-300">
                          {browserState.title || "No title"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Scroll Position:</span>
                        </div>
                        <p className="text-sm ml-6 text-gray-600 dark:text-gray-300">
                          {`${browserState.pixels_above}px from top, ${browserState.pixels_below}px from bottom`}
                        </p>
                      </div>

                      {browserState.tabs && browserState.tabs.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">Open Tabs:</span>
                          </div>
                          <div className="ml-6 space-y-2">
                            {browserState.tabs.map((tab: any, index: number) => (
                              <div key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                                <p className="text-sm font-medium">{tab.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 break-all">{tab.url}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {browserState.browser_errors && browserState.browser_errors.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm text-red-500">Browser Errors:</span>
                          </div>
                          <div className="ml-6 space-y-1">
                            {browserState.browser_errors.map((error: string, index: number) => (
                              <p key={index} className="text-sm text-red-500">{error}</p>
                            ))}
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