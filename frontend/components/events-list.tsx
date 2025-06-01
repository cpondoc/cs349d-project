"use client"

import { useState } from "react"
import type { TelemetryEvent } from "@/lib/types"
import { EventCard } from "./event-card"
import { AgentInitializationCard } from "./agent-initialization-card"
import { AgentDetermineActionCard } from "./agent-determine-action-card"
import { AgentTakeActionCard } from "./agent-take-action-card"
import { AgentFinishActionCard } from "./agent-finish-action-card"
import { AgentEndCard } from "./agent-end-card"
import { 
  Play, 
  StepForward, 
  CheckCircle2, 
  Wrench, 
  Bot,
  LucideIcon
} from "lucide-react"

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

  // Filter out agent_run events
  const filteredEvents = events.filter(event => event.name !== "agent_run")

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No events found for this run</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredEvents.map((event, index) => {
        if (event.name === "agent_initialization") {
          return (
            <AgentInitializationCard
              key={index}
              event={event}
              isExpanded={expandedEvents[index] || false}
              onToggle={() => toggleEvent(index)}
            />
          )
        }

        if (event.name === "agent_determine_action") {
          return (
            <AgentDetermineActionCard
              key={index}
              event={event}
              isExpanded={expandedEvents[index] || false}
              onToggle={() => toggleEvent(index)}
            />
          )
        }

        if (event.name === "agent_take_action") {
          return (
            <AgentTakeActionCard
              key={index}
              event={event}
              isExpanded={expandedEvents[index] || false}
              onToggle={() => toggleEvent(index)}
            />
          )
        }

        if (event.name === "agent_finish_action") {
          return (
            <AgentFinishActionCard
              key={index}
              event={event}
              isExpanded={expandedEvents[index] || false}
              onToggle={() => toggleEvent(index)}
            />
          )
        }

        if (event.name === "agent_end") {
          return (
            <AgentEndCard
              key={index}
              event={event}
              isExpanded={expandedEvents[index] || false}
              onToggle={() => toggleEvent(index)}
            />
          )
        }

        return (
          <EventCard
            key={index}
            event={event}
            isExpanded={expandedEvents[index] || false}
            onToggle={() => toggleEvent(index)}
            getEventIcon={getEventIcon}
            getEventSummary={getEventSummary}
          />
        )
      })}
    </div>
  )
}

function getEventIcon(eventName: string): LucideIcon {
  switch (eventName) {
    case "agent_step":
      return StepForward
    case "agent_end":
      return CheckCircle2
    case "controller_registered_functions":
      return Wrench
    case "agent_overall_step":
      return Bot
    default:
      return Bot
  }
}

function getEventSummary(event: TelemetryEvent): string {
  switch (event.name) {
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
