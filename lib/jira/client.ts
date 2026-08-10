import "server-only"
import { getJiraConfig } from "./config.ts"

export class JiraApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string,
    public readonly details = "",
  ) {
    super(`Jira request failed (${status})`)
    this.name = "JiraApiError"
  }
}

export async function jiraRequest<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const config = getJiraConfig()
  const authorization = Buffer.from(`${config.email}:${config.apiToken}`).toString("base64")
  const headers = new Headers(init.headers)
  headers.set("Authorization", `Basic ${authorization}`)
  headers.set("Accept", "application/json")
  if (init.body) headers.set("Content-Type", "application/json")

  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    ...init,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  })

  if (!response.ok) {
    const details = (await response.text()).slice(0, 2000)
    throw new JiraApiError(response.status, endpoint, details)
  }

  if (response.status === 204) return undefined as T
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}
