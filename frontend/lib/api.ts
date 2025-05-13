export interface LogEntry {
  id: string
  created_at: string
  query: string
  file?: string
}

export async function fetchLogs(): Promise<LogEntry[]> {
  const response = await fetch('http://localhost:8000/logs')
  if (!response.ok) {
    throw new Error('Failed to fetch logs')
  }
  const data = await response.json()
  return data.data // The backend wraps the logs in a data field
}

export async function fetchLogById(id: string): Promise<LogEntry> {
  const response = await fetch(`http://localhost:8000/logs/${id}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Log not found')
    }
    throw new Error('Failed to fetch log')
  }
  const data = await response.json()
  return data.data // The backend wraps the log in a data field
}
