export interface TelemetryEvent {
  name: string
  properties: {
    agent_id?: string
    task?: string
    model_name?: string
    use_vision?: boolean
    version?: string
    source?: string
    step?: number
    step_error?: any[]
    consecutive_failures?: number
    actions?: any[]
    steps?: number
    max_steps_reached?: boolean
    is_done?: boolean
    success?: boolean
    total_input_tokens?: number
    total_duration_seconds?: number
    errors?: any[]
    registered_functions?: any[]
    [key: string]: any
  }
}

export interface AgentRun {
  id: string
  task: string
  model: string
  timestamp: string
  events: TelemetryEvent[]
}
