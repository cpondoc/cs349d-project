"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { TelemetryEvent } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EventsListProps {
  events: TelemetryEvent[]
}

export function EventsList({ events }: EventsListProps) {
  const [expandedEvents, setExpandedEvents] = useState<Record<number, boolean>>({})

  const toggleEvent = (index: number) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No events found for this run</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <Card key={index} className="overflow-hidden">
          <div
            className="flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => toggleEvent(index)}
          >
            <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
              {expandedEvents[index] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>

            <div className="flex-1 flex items-center">
              <Badge variant={getEventVariant(event.name)} className="mr-3">
                {event.name}
              </Badge>
              <div className="text-sm truncate">{getEventSummary(event)}</div>
            </div>
          </div>

          {expandedEvents[index] && (
            <CardContent className="pt-0 pb-4 px-4 bg-gray-50 dark:bg-gray-800/50">
              <pre className="text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded-md max-h-96">
                {JSON.stringify(event, null, 2)}
              </pre>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}

function getEventVariant(eventName: string): "default" | "secondary" | "destructive" | "outline" {
  switch (eventName) {
    case "agent_run":
      return "default"
    case "agent_step":
      return "secondary"
    case "agent_end":
      return "outline"
    case "controller_registered_functions":
      return "outline"
    default:
      return "default"
  }
}

function getEventSummary(event: TelemetryEvent): string {
  switch (event.name) {
    case "agent_run":
      return `Task: ${event.properties?.task || "Unknown"}`
    case "agent_step":
      return `Step ${event.properties?.step}: ${getActionSummary(event.properties?.actions)}`
    case "agent_end":
      return `Run completed (${event.properties?.success ? "Success" : "Failed"})`
    case "controller_registered_functions":
      return `${event.properties?.registered_functions?.length || 0} functions registered`
    case "agent_overall_step":
      return event.properties?.step === 1
        ? "Initialization of Agent"
        : `${event.properties?.previous_goal}`
    default:
      return event.name
  }
}

function getActionSummary(actions: any[] | undefined): string {
  if (!actions || actions.length === 0) return "No actions"

  const action = actions[0]
  const actionType = Object.keys(action)[0]

  switch (actionType) {
    case "search_google":
      return `Search: "${action.search_google.query}"`
    case "click_element_by_index":
      return `Click element at index ${action.click_element_by_index.index}`
    case "extract_content":
      return `Extract: "${action.extract_content.goal}"`
    case "done":
      return `Done: ${action.done.success ? "Success" : "Failed"}`
    default:
      return actionType
  }
}
