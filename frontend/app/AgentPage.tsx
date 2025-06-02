"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePageTitle } from "@/components/page-title-context"

export default function AgentPage() {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Home");
  }, [setTitle]);

  const [task, setTask] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('http://localhost:8000/run-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      })

      const data = await response.json()
      setResult(data.message)
    } catch (error) {
      setResult('Error: ' + (error instanceof Error ? error.message : 'Failed to run agent'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl w-full pt-8 pl-2">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Browser Agent</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task" className="block text-sm font-medium text-gray-300 mb-2">
            Enter your task
          </label>
          <Textarea
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g., Compare the price of gpt-4o and DeepSeek-V3"
            className="w-full min-h-[100px] resize-y"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Running...' : 'Run Agent'}
        </Button>
      </form>

      {result && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-100">{result}</p>
        </div>
      )}
    </div>
  )
} 