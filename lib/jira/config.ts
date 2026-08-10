import "server-only"
import { z } from "zod"

const configSchema = z.object({
  baseUrl: z.string().url(),
  email: z.string().email(),
  apiToken: z.string().min(10),
  projectLeadAccountId: z.string().min(10),
  reporterAccountId: z.string().min(10),
  fernandoAccountId: z.string().min(10),
  herbertAccountId: z.string().min(10),
  felipeAccountId: z.string().min(10),
  jacquelineAccountId: z.string().min(10),
})

export type JiraConfig = z.infer<typeof configSchema>

export function getJiraConfig(): JiraConfig {
  const result = configSchema.safeParse({
    baseUrl: process.env.JIRA_BASE_URL?.replace(/\/$/, ""),
    email: process.env.JIRA_EMAIL,
    apiToken: process.env.JIRA_API_TOKEN,
    projectLeadAccountId: process.env.JIRA_PROJECT_LEAD_ACCOUNT_ID,
    reporterAccountId: process.env.JIRA_REPORTER_ACCOUNT_ID,
    fernandoAccountId: process.env.JIRA_FERNANDO_ACCOUNT_ID,
    herbertAccountId: process.env.JIRA_HERBERT_ACCOUNT_ID,
    felipeAccountId: process.env.JIRA_FELIPE_ACCOUNT_ID,
    jacquelineAccountId: process.env.JIRA_JACQUELINE_ACCOUNT_ID,
  })

  if (!result.success || result.data.projectLeadAccountId === "..." || result.data.reporterAccountId === "...") {
    throw new Error("Configuracao do Jira incompleta")
  }

  return result.data
}

export function getJiraAccountIds() {
  const config = getJiraConfig()

  return {
    fernando: config.fernandoAccountId,
    felipe: config.felipeAccountId,
    jacqueline: config.jacquelineAccountId,
    herbert: config.herbertAccountId,
  }
}
