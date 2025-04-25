import type { TelemetryEvent } from "./types"

export function parseJsonl(jsonlString: string): TelemetryEvent[] {
  // Split the string by newlines and filter out empty lines
  const lines = jsonlString.split("\n").filter((line) => line.trim() !== "")

  // Parse each line as JSON
  const parsedData = lines
    .map((line) => {
      try {
        return JSON.parse(line) as TelemetryEvent
      } catch (error) {
        console.error(`Error parsing line: ${line}`, error)
        return null
      }
    })
    .filter((item): item is TelemetryEvent => item !== null)

  return parsedData
}
