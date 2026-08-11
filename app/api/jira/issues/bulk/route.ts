import { NextResponse } from "next/server"

import { taskTemplates } from "@/app/interno/taskTemplates.ts"
import { getInternalAuthConfig, isInternalRequestAuthenticated, verifyProjectCapability } from "@/lib/jira/auth.ts"
import { jiraRequest } from "@/lib/jira/client.ts"
import { getJiraAccountIds } from "@/lib/jira/config.ts"
import { calculateDueDate } from "@/lib/jira/due-date.ts"
import { isSameOrigin, jiraErrorResponse } from "@/lib/jira/http.ts"
import { buildBulkIssuePayload } from "@/lib/jira/payloads.ts"
import { checkRateLimit } from "@/lib/jira/rate-limit.ts"
import { bulkIssuesSchema } from "@/lib/jira/schemas.ts"
import { resolveTaskRule } from "@/lib/jira/task-rules.ts"
import { assertStandardWorkflow } from "@/lib/jira/workflow-service.ts"

type JiraProject = { issueTypes?: Array<{ id: string }> }
type BulkIssuesResponse = {
  issues?: Array<{ id: string; key: string; self: string }>
  errors?: Array<{ status: number; failedElementNumber?: number; elementErrors: unknown }>
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    console.warn("jira_bulk_rejected", { reason: "origin" })
    return NextResponse.json({ error: "Origem nao permitida" }, { status: 403 })
  }
  if (!isInternalRequestAuthenticated(request)) {
    console.warn("jira_bulk_rejected", { reason: "session" })
    return NextResponse.json({ error: "Acesso nao autorizado" }, { status: 401 })
  }
  if (!checkRateLimit(request, "jira-bulk", 20, 10 * 60_000)) return NextResponse.json({ error: "Limite de envios atingido. Aguarde alguns minutos." }, { status: 429 })

  try {
    const input = bulkIssuesSchema.safeParse(await request.json())
    if (!input.success) return NextResponse.json({ error: input.error.issues[0]?.message }, { status: 400 })

    const capability = verifyProjectCapability(input.data.projectToken, getInternalAuthConfig().secret)
    if (!capability) {
      console.warn("jira_bulk_rejected", { reason: "project_capability", capabilityLength: input.data.projectToken.length })
      return NextResponse.json({ error: "Autorizacao do projeto expirada ou invalida" }, { status: 403 })
    }
    const project = await jiraRequest<JiraProject>(`/rest/api/3/project/${capability.projectId}?expand=issueTypes`)
    if (!project.issueTypes?.some((type) => type.id === capability.issueTypeId)) {
      return NextResponse.json({ error: "Tipo de tarefa nao pertence ao projeto" }, { status: 400 })
    }
    await assertStandardWorkflow(capability.projectId)

    const payload = buildBulkIssuePayload({
      projectId: capability.projectId,
      issueTypeId: capability.issueTypeId,
      executor: input.data.executor,
      template: input.data.template,
      accountIds: getJiraAccountIds(),
      tasks: input.data.tarefas.map((task) => {
        if (task.templateTaskIndex === null) {
          return { title: task.titulo, description: task.descricao, dueDate: task.dataLimite, assigneeKey: input.data.executor }
        }
        const title = taskTemplates[input.data.template][task.templateTaskIndex]
        if (!title) throw new Error("Tarefa nao pertence ao modelo selecionado")
        const rule = resolveTaskRule(title, input.data.template)
        return { title, description: task.descricao, dueDate: calculateDueDate(capability.createdDate, rule.dueOffsetDays, true) }
      }),
    })

    const result = await jiraRequest<BulkIssuesResponse>("/rest/api/3/issue/bulk", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    if (result.errors?.length) {
      const body = {
        error: `${result.errors.length} tarefa(s) nao foram criadas`,
        issues: result.issues ?? [],
        failedIndexes: result.errors.map((item) => item.failedElementNumber).filter((value): value is number => Number.isInteger(value)),
        partial: Boolean(result.issues?.length),
        retrySafe: result.errors.every((item) => Number.isInteger(item.failedElementNumber)),
      }
      console.warn("jira_bulk_partial_failure", { projectId: capability.projectId, created: body.issues.length, failed: result.errors.length })
      return NextResponse.json(body, { status: body.partial ? 207 : 502 })
    }

    console.info("jira_bulk_created", { projectId: capability.projectId, count: result.issues?.length ?? 0 })
    return NextResponse.json({ issues: result.issues ?? [] })
  } catch (error) {
    return jiraErrorResponse(error)
  }
}
