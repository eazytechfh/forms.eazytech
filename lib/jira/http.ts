import { NextResponse } from "next/server"

import { JiraApiError } from "./client.ts"

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  if (!origin) return process.env.NODE_ENV !== "production"
  return origin === new URL(request.url).origin
}

export function jiraErrorResponse(error: unknown) {
  if (error instanceof JiraApiError) {
    console.error("jira_api_error", { status: error.status, endpoint: error.endpoint, details: error.details })
    if (error.status === 401) return NextResponse.json({ error: "Credenciais do Jira invalidas" }, { status: 502 })
    if (error.status === 403) return NextResponse.json({ error: "O usuario do Jira nao possui permissao para esta operacao" }, { status: 502 })
    if (error.status === 409) return NextResponse.json({ error: "O Jira encontrou um conflito. Tente novamente." }, { status: 409 })
    if (error.status === 400) {
      let reason = "O Jira rejeitou os dados enviados"
      try {
        const body = JSON.parse(error.details) as { errorMessages?: string[]; errors?: Record<string, string> }
        reason = body.errorMessages?.[0] || Object.values(body.errors || {})[0] || reason
      } catch {}
      return NextResponse.json({ error: reason }, { status: 400 })
    }
    return NextResponse.json({ error: "O Jira nao conseguiu concluir a operacao" }, { status: 502 })
  }

  if (error instanceof Error && error.message === "Configuracao do Jira incompleta") {
    return NextResponse.json({ error: "Integracao com o Jira nao configurada" }, { status: 500 })
  }

  return NextResponse.json({ error: "Nao foi possivel concluir a operacao" }, { status: 500 })
}
