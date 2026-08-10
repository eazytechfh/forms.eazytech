export type TaskAssigneeRole = "fernando" | "herbert" | "executor"

export const TASK_TEMPLATE_NAMES = [
  "EAZYSALES (PROSPECTVENDAS)",
  "TAREFAS EAZYSTART",
  "TAREFAS EAZY SALES (interno)",
  "TAREFAS EAZY PRO",
  "TAREFAS EAZY PRO CONCESSIONARIA",
] as const
export type JiraTaskTemplateName = (typeof TASK_TEMPLATE_NAMES)[number]

export type TaskRule = {
  assignee: TaskAssigneeRole
  dueOffsetDays: number
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
}

function resolveAssignee(normalizedTitle: string, template?: JiraTaskTemplateName): TaskAssigneeRole {
  if (template === "EAZYSALES (PROSPECTVENDAS)") return "executor"

  if (template === "TAREFAS EAZYSTART") {
    return normalizedTitle.includes("[BRIEFING]") || normalizedTitle.includes("[D7+]") || normalizedTitle.includes("[D15+]")
      ? "fernando"
      : "executor"
  }

  if (template === "TAREFAS EAZY SALES (interno)") {
    const fernandoTasks = [
      "REUNIAO DE CAPTURA DE ACESSOS",
      "CONECTAR FACEBOOK + INSTAGRAM",
      "LEVAMENTO DE ESTAGIOS",
      "LEVANTAMENTO DE PESSOAS",
      "CONECTAR CARTAO DE CREDITO",
      "[FEEDBACK]",
      "[FINALIZACAO]",
    ]
    return fernandoTasks.some((part) => normalizedTitle.includes(part)) ? "fernando" : "executor"
  }

  if (
    normalizedTitle.includes("[BRIEFING]") ||
    normalizedTitle.includes("PEGAR TODOS OS ACESSOS") ||
    normalizedTitle.includes("VALIDACAO FINAL") ||
    normalizedTitle.includes("VALIDACAO + AJUSTES") ||
    normalizedTitle.includes("CONECTAR A UAZAPI")
  ) {
    return "fernando"
  }

  if (
    normalizedTitle.includes("CRIAR INSTANCIA") ||
    normalizedTitle.includes("PREENCHER DESCRICAO DO GRUPO") ||
    (normalizedTitle.includes("[ACESSOS]") &&
      ["CRIACAO DE GMAIL", "CRIACAO DE OPENAI", "CRIACAO DE PROJETO", "CRIACAO DE SUPABASE"].some((part) =>
        normalizedTitle.includes(part),
      ))
  ) {
    return "herbert"
  }

  return "executor"
}

const REFERENCE_OFFSETS: Array<[string, number]> = [
  ["ENVIAR BRIEFING", 0],
  ["OBTER VERSAO 1 DO PROMPT", 6],
  ["CONECTAR A UAZAPI", 6],
  ["CONFIGURAR A DATA DE ENTREGA", 0],
  ["CRIAR INSTANCIA", 0],
  ["PEGAR TODOS OS ACESSOS", 2],
  ["PREENCHER DESCRICAO DO GRUPO", 12],
  ["CRIACAO DE GMAIL", 2],
  ["CRIACAO DE OPENAI", 2],
  ["CRIACAO DE PROJETO CRM", 3],
  ["CRIACAO DE PROJETO V0", 3],
  ["CRIACAO DE SUPABASE", 2],
  ["VALIDACAO FINAL", 15],
  ["CRIAR CRM", 3],
  ["CRIAR PROMPT NA OPENAI", 4],
  ["DUPLICAR CENARIO", 2],
  ["GERAR CREDENCIAIS", 2],
  ["CONFIGURAR FOLLOW-UP", 3],
  ["INTEGRACAO COM O REVENDA", 4],
  ["CANAIS DE AQUISICAO", 5],
  ["INTEGRACAO SUPABASE COM CRM", 6],
  ["INFORMAR CLIENTE SOBRE INICIO", 6],
  ["TESTE INTERNO COMPLETO", 11],
  ["INFORMAR CLIENTE E AGENDAR ENTREGA", 11],
  ["[D7] [TESTES] TESTE FINAL", 11],
  ["ATIVAR IA", 12],
  ["VALIDACAO + AJUSTES", 15],
  ["TESTE DE CONEXAO COM PLATAFORMAS", 11],
  ["BATERIA DE TESTES", 11],
  ["TESTE DE BATERIA", 11],
  ["ADICIONAR LOGS DE ATUALIZACAO", 6],
]

function resolveDueOffset(normalizedTitle: string): number {
  const reference = REFERENCE_OFFSETS.find(([part]) => normalizedTitle.includes(part))
  if (reference) return reference[1]

  const dayMarker = normalizedTitle.match(/\[D(\d+)\+?\]/)
  if (dayMarker) return Math.min(Number(dayMarker[1]), 15)

  return 15
}

export function resolveTaskRule(title: string, template?: JiraTaskTemplateName): TaskRule {
  const normalizedTitle = normalize(title)
  return {
    assignee: resolveAssignee(normalizedTitle, template),
    dueOffsetDays: resolveDueOffset(normalizedTitle),
  }
}
