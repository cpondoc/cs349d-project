import { Bot, Target, Brain, Shield, ChevronDown, ChevronRight, Database, HardDrive, Activity, Globe, Layout, Settings } from "lucide-react"
import type { TelemetryEvent } from "@/lib/types"
import { EventCard } from "./event-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AgentInitializationCardProps {
  event: TelemetryEvent
  isExpanded: boolean
  onToggle: () => void
}

export function AgentInitializationCard({ event, isExpanded, onToggle }: AgentInitializationCardProps) {
  const getEventIcon = () => Bot
  const getEventSummary = () => "Agent Initialization"
  const [showCoreComponents, setShowCoreComponents] = useState(false)
  const [showMemoryConfig, setShowMemoryConfig] = useState(false)
  const [showState, setShowState] = useState(false)
  const [showBrowserSettings, setShowBrowserSettings] = useState(false)
  const [showBrowserContext, setShowBrowserContext] = useState(false)
  const [showAgentSettings, setShowAgentSettings] = useState(false)

  const coreComponents = event.properties?.core_components || {}
  const memoryAndState = event.properties?.memory_and_state || {}
  const memoryConfig = memoryAndState.memory_config || {}
  const state = memoryAndState.state || {}

  const browserSettings = event.properties?.browser_settings?.browser || {}
  const browserContextSettings = event.properties?.browser_settings?.browser_context || {}
  const agentSettings = event.properties?.settings || {}

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
              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowCoreComponents(!showCoreComponents)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showCoreComponents ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium text-sm">Core Components</h3>
                  </div>
                </div>

                {showCoreComponents && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">Task:</span>
                        </div>
                        <p className="text-sm ml-6">{coreComponents.task || "No task specified"}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-purple-500" />
                          <span className="font-medium text-sm">LLM Model:</span>
                        </div>
                        <p className="text-sm ml-6">{coreComponents.llm || "No model specified"}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-sm">Sensitive Data:</span>
                        </div>
                        <p className="text-sm ml-6">{coreComponents.sensitive_data ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowMemoryConfig(!showMemoryConfig)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showMemoryConfig ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4 text-indigo-500" />
                    <h3 className="font-medium text-sm">Memory Configuration</h3>
                  </div>
                </div>

                {showMemoryConfig && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Memory Enabled:</span>
                        </div>
                        <p className="text-sm ml-6">{memoryAndState.enable_memory ? "Yes" : "No"}</p>
                      </div>

                      {memoryConfig && (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">Agent ID:</span>
                            </div>
                            <p className="text-sm ml-6">{memoryConfig.agent_id}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">Memory Interval:</span>
                            </div>
                            <p className="text-sm ml-6">{memoryConfig.memory_interval} seconds</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">Embedder:</span>
                            </div>
                            <p className="text-sm ml-6">
                              Provider: {memoryConfig.embedder_provider}
                              <br />
                              Model: {memoryConfig.embedder_model}
                              <br />
                              Dimensions: {memoryConfig.embedder_dims}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">LLM Provider:</span>
                            </div>
                            <p className="text-sm ml-6">{memoryConfig.llm_provider}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">Vector Store:</span>
                            </div>
                            <p className="text-sm ml-6">
                              Provider: {memoryConfig.vector_store_provider}
                              <br />
                              Base Path: {memoryConfig.vector_store_base_path}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowState(!showState)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showState ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    <h3 className="font-medium text-sm">Agent State</h3>
                  </div>
                </div>

                {showState && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Agent ID:</span>
                        </div>
                        <p className="text-sm ml-6 font-mono">{state.agent_id}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Progress:</span>
                        </div>
                        <p className="text-sm ml-6">
                          Steps: {state.n_steps}
                          <br />
                          Consecutive Failures: {state.consecutive_failures}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Status:</span>
                        </div>
                        <p className="text-sm ml-6">
                          Paused: {state.paused ? "Yes" : "No"}
                          <br />
                          Stopped: {state.stopped ? "Yes" : "No"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Message Manager:</span>
                        </div>
                        <p className="text-sm ml-6">
                          Current Tokens: {state.message_manager_state?.history?.current_tokens || 0}
                          <br />
                          Tool ID: {state.message_manager_state?.tool_id || "None"}
                          <br />
                          Messages: {state.message_manager_state?.history?.messages?.length || 0}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">History:</span>
                        </div>
                        <p className="text-sm ml-6">
                          History Items: {state.history?.history?.length || 0}
                          <br />
                          Last Plan: {state.last_plan ? "Available" : "None"}
                          <br />
                          Last Result: {state.last_result ? "Available" : "None"}
                        </p>
                      </div>

                      {memoryAndState.initial_actions && memoryAndState.initial_actions.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">Initial Actions:</span>
                          </div>
                          <p className="text-sm ml-6">
                            Count: {memoryAndState.initial_actions.length}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowAgentSettings(!showAgentSettings)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showAgentSettings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-amber-500" />
                    <h3 className="font-medium text-sm">Agent Settings</h3>
                  </div>
                </div>

                {showAgentSettings && (
                  <div className="p-4 pt-2">
                    <div className="space-y-4">
                      {/* Vision Settings */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Vision Settings:</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <p className="text-sm">Use Vision: {agentSettings.use_vision ? "Enabled" : "Disabled"}</p>
                          <p className="text-sm">Use Vision for Planner: {agentSettings.use_vision_for_planner ? "Enabled" : "Disabled"}</p>
                        </div>
                      </div>

                      {/* Conversation Settings */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Conversation Settings:</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <p className="text-sm">Save Path: {agentSettings.save_conversation_path || "None"}</p>
                          <p className="text-sm">Encoding: {agentSettings.save_conversation_path_encoding}</p>
                          <p className="text-sm">Generate GIF: {agentSettings.generate_gif ? "Enabled" : "Disabled"}</p>
                        </div>
                      </div>

                      {/* Performance Settings */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Performance Settings:</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <p className="text-sm">Max Failures: {agentSettings.max_failures}</p>
                          <p className="text-sm">Retry Delay: {agentSettings.retry_delay} seconds</p>
                          <p className="text-sm">Max Input Tokens: {agentSettings.max_input_tokens.toLocaleString()}</p>
                          <p className="text-sm">Max Actions per Step: {agentSettings.max_actions_per_step}</p>
                        </div>
                      </div>

                      {/* Planner Settings */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Planner Settings:</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <p className="text-sm">Planner Interval: {agentSettings.planner_interval}</p>
                          <p className="text-sm">Planner Reasoning: {agentSettings.is_planner_reasoning ? "Enabled" : "Disabled"}</p>
                          <p className="text-sm">Tool Calling Method: {agentSettings.tool_calling_method}</p>
                        </div>
                      </div>

                      {/* Validation Settings */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Validation Settings:</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <p className="text-sm">Validate Output: {agentSettings.validate_output ? "Enabled" : "Disabled"}</p>
                        </div>
                      </div>

                      {/* Message Settings */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">Message Settings:</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <p className="text-sm">Message Context: {agentSettings.message_context || "None"}</p>
                          <p className="text-sm">Override System Message: {agentSettings.override_system_message ? "Set" : "None"}</p>
                          <p className="text-sm">Extend System Message: {agentSettings.extend_system_message ? "Set" : "None"}</p>
                          <p className="text-sm">Extend Planner System Message: {agentSettings.extend_planner_system_message ? "Set" : "None"}</p>
                        </div>
                      </div>

                      {/* Include Attributes */}
                      {agentSettings.include_attributes && agentSettings.include_attributes.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">Include Attributes:</span>
                          </div>
                          <div className="ml-6">
                            <div className="flex flex-wrap gap-1">
                              {agentSettings.include_attributes.map((attr: string, index: number) => (
                                <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {attr}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* File Paths */}
                      {agentSettings.available_file_paths && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">Available File Paths:</span>
                          </div>
                          <div className="ml-6">
                            <p className="text-sm">{agentSettings.available_file_paths || "None"}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowBrowserSettings(!showBrowserSettings)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showBrowserSettings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium text-sm">Browser Settings</h3>
                  </div>
                </div>

                {showBrowserSettings && (
                  <div className="p-4 pt-2">
                    <pre className="text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                      {JSON.stringify(browserSettings, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="rounded-md border border-gray-200 dark:border-gray-700">
                <div
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                  onClick={() => setShowBrowserContext(!showBrowserContext)}
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
                    {showBrowserContext ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Layout className="h-4 w-4 text-purple-500" />
                    <h3 className="font-medium text-sm">Browser Context Settings</h3>
                  </div>
                </div>

                {showBrowserContext && (
                  <div className="p-4 pt-2">
                    <pre className="text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                      {JSON.stringify(browserContextSettings, null, 2)}
                    </pre>
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