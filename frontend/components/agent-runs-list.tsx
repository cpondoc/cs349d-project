"use client"

import type { AgentRun } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface AgentRunsListProps {
  runs: AgentRun[]
  selectedRunId: string | null
  onRunSelect: (runId: string) => void
}

export function AgentRunsList({ runs, selectedRunId, onRunSelect }: AgentRunsListProps) {
  if (runs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No agent runs found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {runs.map((run) => (
        <Button
          key={run.id}
          variant={selectedRunId === run.id ? "default" : "outline"}
          className="w-full justify-start text-left h-auto py-3 px-4"
          onClick={() => onRunSelect(run.id)}
        >
          <div className="flex flex-col items-start">
            <span className="font-medium truncate w-full">{run.task}</span>
            <span className="text-xs text-muted-foreground mt-1">Model: {run.model}</span>
            <span className="text-xs text-muted-foreground mt-0.5 truncate w-full">ID: {run.id}</span>
          </div>
        </Button>
      ))}
    </div>
  )
}
