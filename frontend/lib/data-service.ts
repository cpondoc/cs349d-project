/**
 * Fetches telemetry data from the specified path
 *
 * In a real application, this would make an API call to your backend
 * For this example, we're simulating loading from a local file
 */
export async function fetchTelemetryData(path: string): Promise<string> {
  const response = await fetch(`/api/telemetry?path=${encodeURIComponent(path)}`);
  const result = await response.json();

  if (!response.ok) throw new Error(result.error || "Failed to fetch telemetry");

  return result.data;
}
