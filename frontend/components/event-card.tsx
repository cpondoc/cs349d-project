import { ChevronDown, ChevronRight, LucideIcon, Code } from "lucide-react"
import type { TelemetryEvent } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ReactNode, useState } from "react"
import { JsonViewerModal } from "./json-viewer-modal"

interface EventCardProps {
  event: TelemetryEvent
  isExpanded: boolean
  onToggle: () => void
  getEventIcon: (eventName: string) => LucideIcon
  getEventSummary: (event: TelemetryEvent) => string
  children?: ReactNode
}

export function EventCard({
  event,
  isExpanded,
  onToggle,
  getEventIcon,
  getEventSummary,
  children,
}: EventCardProps) {
  const [showJsonModal, setShowJsonModal] = useState(false)
  const Icon = getEventIcon(event.name)
  
  return (
    <>
      <Card className="overflow-hidden">
        <div
          className="flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={onToggle}
        >
          <Button variant="ghost" size="icon" className="h-5 w-5 mr-2">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>

          <div className="flex-1 flex items-center">
            <div className="mr-3 text-gray-500 dark:text-gray-400">
              <Icon className="h-4 w-4" />
            </div>
            <div className="text-sm truncate">{getEventSummary(event)}</div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-2"
            onClick={(e) => {
              e.stopPropagation()
              setShowJsonModal(true)
            }}
          >
            <Code className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>

        {isExpanded && (
          children || (
            <CardContent className="pt-0 pb-4 px-4 bg-gray-50 dark:bg-gray-800/50">
              <pre className="text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded-md max-h-96">
                {JSON.stringify(event, null, 2)}
              </pre>
            </CardContent>
          )
        )}
      </Card>

      <JsonViewerModal
        event={event}
        isOpen={showJsonModal}
        onClose={() => setShowJsonModal(false)}
      />
    </>
  )
} 