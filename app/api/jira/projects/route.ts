import { NextResponse } from "next/server"

import { createProjectCapability, getInternalAuthConfig, isInternalRequestAuthenticated, verifyProjectCapability } from "@/lib/jira/auth.ts"
import { JiraApiError, jiraRequest } from "@/lib/jira/client.ts"
import { getJiraConfig } from "@/lib/jira/config.ts"
import { todayInSaoPaulo } from "@/lib/jira/due-date.ts"
import { isSameOrigin, jiraErrorResponse } from "@/lib/jira/http.ts"
import { buildProjectKeyCandidates } from "@/lib/jira/project-key.ts"
import { checkRateLimit } from "@/lib/jira/rate-limit.ts"
import { createProjectSchema } from "@/lib/jira/schemas.ts"
import { ensureStandardWorkflow } from "@/lib/jira/workflow-service.ts"

type ProjectCreated = { id: string; key: string; self: string }
type JiraProject = { issueTypes?: Array<{ id: string; name: string }> }
type ProjectSearch = { values: Array<{ id: string; key: string; name: string }> }

function normalizeProjectName(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("pt-BR")
}

async function findProjectWithSameName(companyName: string) {
  const result = await jiraRequest<ProjectSearch>(`/rest/api/3/project/search?query=${encodeURIComponent(companyName)}&maxResults=50`)
  const wanted = normalizeProjectName(companyName)
  return result.values.find((project) => normalizeProjectName(project.name) === wanted)
}

async function createProject(companyName: string, leadAccountId: string) {
  for (const candidate of buildProjectKeyCandidates(companyName)) {
    try {
      return await jiraRequest<ProjectCreated>("/rest/api/3/project", {
        method: "POST",
        body: JSON.stringify({
          key: candidate,
          name: companyName,
          projectTypeKey: "business",
          projectTemplateKey: "com.atlassian.jira-core-project-templates:jira-core-simplified-project-management",
          leadAccountId,
          assigneeType: "PROJECT_LEAD",
        }),
      })
    } catch (error) {
      if (error instanceof JiraApiError && (error.status === 409 || (error.status === 400 && error.details.includes('"projectKey"')))) continue
      throw error
    }
  }
  throw new Error("Nao foi possivel gerar uma chave disponivel")
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origem nao permitida" }, { status: 403 })
  if (!isInternalRequestAuthenticated(request)) return NextResponse.json({ error: "Acesso nao autorizado" }, { status: 401 })
  if (!checkRateLimit(request, "jira-project", 5, 10 * 60_000)) return NextResponse.json({ error: "Limite de criacao atingido. Aguarde alguns minutos." }, { status: 429 })

  let createdProject: ProjectCreated | null = null
  try {
    const input = createProjectSchema.safeParse(await request.json())
    if (!input.success) return NextResponse.json({ error: input.error.issues[0]?.message }, { status: 400 })

    const config = getJiraConfig()
    const duplicate = await findProjectWithSameName(input.data.nomeEmpresa)
    if (duplicate) {
      return NextResponse.json(
        { error: `Já existe um projeto chamado ${duplicate.name} no Jira (${duplicate.key}). Escolha outro nome.` },
        { status: 409 },
      )
    }
    createdProject = await createProject(input.data.nomeEmpresa, config.projectLeadAccountId)

    await ensureStandardWorkflow(createdProject.id)
    const project = await jiraRequest<JiraProject>(`/rest/api/3/project/${createdProject.id}?expand=issueTypes`)
    const issueType = project.issueTypes?.find((type) => ["tarefa", "task"].includes(type.name.toLowerCase()))
    if (!issueType) throw new Error("Tipo Tarefa nao encontrado")

    const createdDate = todayInSaoPaulo()
    const projectId = String(createdProject.id)
    const issueTypeId = String(issueType.id)
    const authConfig = getInternalAuthConfig()
    const projectToken = createProjectCapability(
      { projectId, issueTypeId, createdDate },
      authConfig.secret,
    )
    if (!verifyProjectCapability(projectToken, authConfig.secret)) throw new Error("Falha ao autorizar o projeto criado")
    console.info("jira_project_created", { projectId: createdProject.id, projectKey: createdProject.key, capabilityLength: projectToken.length })
    return NextResponse.json({
      projectId,
      projectKey: createdProject.key,
      projectToken,
      createdDate,
    })
  } catch (error) {
    if (createdProject) {
      try {
        await jiraRequest<void>(`/rest/api/3/project/${createdProject.id}?enableUndo=false`, { method: "DELETE" })
      } catch (rollbackError) {
        if (rollbackError instanceof JiraApiError) console.error("Falha ao desfazer projeto incompleto", rollbackError.status)
      }
    }
    return jiraErrorResponse(error)
  }
}
