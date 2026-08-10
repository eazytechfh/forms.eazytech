import { JiraApiError, jiraRequest } from "./client.ts"
import {
  STANDARD_STATUS_NAMES,
  buildStandardWorkflowPayload,
  type ExistingStatus,
  type StandardStatusName,
} from "./workflow.ts"

const WORKFLOW_NAME = "Eazytech - Projetos v1"
const WORKFLOW_SCHEME_NAME = "Eazytech - Projetos v1"

type WorkflowScheme = { id: string; name: string }
type WorkflowSchemesResponse = { values: WorkflowScheme[] }
type WorkflowSearchResponse = { values: Array<{ id: { name: string; entityId: string } }> }
type WorkflowSchemeCreateResponse = { id: string; name: string }
type ProjectStatuses = Array<{ statuses: Array<{ name: string }> }>
type JiraStatus = {
  id: string
  name: string
  description?: string
  scope?: { type?: string }
  statusCategory: { key: "new" | "indeterminate" | "done" }
}

async function findWorkflowScheme(): Promise<WorkflowScheme | undefined> {
  const response = await jiraRequest<WorkflowSchemesResponse>("/rest/api/3/workflowscheme?maxResults=100")
  return response.values.find((scheme) => scheme.name === WORKFLOW_SCHEME_NAME)
}

async function ensureWorkflowExists() {
  const current = await jiraRequest<WorkflowSearchResponse>(
    `/rest/api/3/workflow/search?workflowName=${encodeURIComponent(WORKFLOW_NAME)}&maxResults=50`,
  )

  if (current.values.some((workflow) => workflow.id.name === WORKFLOW_NAME)) return

  const jiraStatuses = await jiraRequest<JiraStatus[]>("/rest/api/3/status")
  const wantedNames = new Set<string>(STANDARD_STATUS_NAMES)
  const categoryMap = { new: "TODO", indeterminate: "IN_PROGRESS", done: "DONE" } as const
  const existingStatuses = Object.fromEntries(
    jiraStatuses
      .filter((status) => wantedNames.has(status.name) && status.scope?.type !== "PROJECT")
      .map((status) => [
        status.name,
        {
          id: status.id,
          description: status.description || "",
          statusCategory: categoryMap[status.statusCategory.key],
        },
      ]),
  ) as Partial<Record<StandardStatusName, ExistingStatus>>

  await jiraRequest("/rest/api/3/workflows/create", {
    method: "POST",
    body: JSON.stringify(buildStandardWorkflowPayload(WORKFLOW_NAME, existingStatuses)),
  })
}

async function getOrCreateWorkflowSchemeId(): Promise<string> {
  const existing = await findWorkflowScheme()
  if (existing) return existing.id

  try {
    await ensureWorkflowExists()
    const created = await jiraRequest<WorkflowSchemeCreateResponse>("/rest/api/3/workflowscheme", {
      method: "POST",
      body: JSON.stringify({
        name: WORKFLOW_SCHEME_NAME,
        description: "Fluxo padrão dos projetos criados pelo briefing interno",
        defaultWorkflow: WORKFLOW_NAME,
      }),
    })
    return created.id
  } catch (error) {
    if (!(error instanceof JiraApiError) || error.status !== 409) throw error
    const concurrent = await findWorkflowScheme()
    if (!concurrent) throw error
    return concurrent.id
  }
}

export async function ensureStandardWorkflow(projectId: string) {
  const workflowSchemeId = await getOrCreateWorkflowSchemeId()
  await jiraRequest<void>("/rest/api/3/workflowscheme/project", {
    method: "PUT",
    body: JSON.stringify({ projectId, workflowSchemeId }),
  })

  const projectStatuses = await jiraRequest<ProjectStatuses>(`/rest/api/3/project/${projectId}/statuses`)
  const available = new Set(projectStatuses.flatMap((issueType) => issueType.statuses.map((status) => status.name)))
  const missing = STANDARD_STATUS_NAMES.filter((status) => !available.has(status))
  if (missing.length) throw new Error("O workflow padrao nao foi associado ao projeto")
}

export async function assertStandardWorkflow(projectId: string) {
  const projectStatuses = await jiraRequest<ProjectStatuses>(`/rest/api/3/project/${projectId}/statuses`)
  const available = new Set(projectStatuses.flatMap((issueType) => issueType.statuses.map((status) => status.name)))
  if (STANDARD_STATUS_NAMES.some((status) => !available.has(status))) throw new Error("Projeto sem o workflow padrao")
}
