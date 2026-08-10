export const STANDARD_STATUS_NAMES = [
  "PROJETO EM ABERTO",
  "PROJETO EM ANDAMENTO",
  "PROJETO EM TESTE",
  "PROJETO CONCLUÍDO",
  "DEMANDAS EM ABERTO",
  "DEMANDAS EM ANDAMENTO",
  "DEMANDAS CONCLUÍDAS",
  "STANDBY",
  "AGUARDANDO RESPOSTA (CEO)",
  "AGUARDANDO RESPOSTA (CLIENTE)",
  "TAREFAS CANCELADAS",
  "FEED",
] as const

export type StandardStatusName = (typeof STANDARD_STATUS_NAMES)[number]
export type ExistingStatus = {
  id: string
  description: string
  statusCategory: "TODO" | "IN_PROGRESS" | "DONE"
}

const STATUS_UUIDS: Record<StandardStatusName, string> = {
  "PROJETO EM ABERTO": "00000000-0000-4000-8000-000000000001",
  "PROJETO EM ANDAMENTO": "00000000-0000-4000-8000-000000000002",
  "PROJETO EM TESTE": "00000000-0000-4000-8000-000000000003",
  "PROJETO CONCLUÍDO": "00000000-0000-4000-8000-000000000004",
  "DEMANDAS EM ABERTO": "00000000-0000-4000-8000-000000000005",
  "DEMANDAS EM ANDAMENTO": "00000000-0000-4000-8000-000000000006",
  "DEMANDAS CONCLUÍDAS": "00000000-0000-4000-8000-000000000007",
  STANDBY: "00000000-0000-4000-8000-000000000008",
  "AGUARDANDO RESPOSTA (CEO)": "00000000-0000-4000-8000-000000000009",
  "AGUARDANDO RESPOSTA (CLIENTE)": "00000000-0000-4000-8000-000000000010",
  "TAREFAS CANCELADAS": "00000000-0000-4000-8000-000000000011",
  FEED: "00000000-0000-4000-8000-000000000012",
}

function statusCategory(name: (typeof STANDARD_STATUS_NAMES)[number]) {
  if (name.includes("CONCLUÍD")) return "DONE" as const
  if (name.includes("ANDAMENTO") || name === "PROJETO EM TESTE") return "IN_PROGRESS" as const
  return "TODO" as const
}

export function buildStandardWorkflowPayload(
  workflowName: string,
  existingStatuses: Partial<Record<StandardStatusName, ExistingStatus>> = {},
) {
  const statusReferences = Object.fromEntries(
    STANDARD_STATUS_NAMES.map((name) => [name, existingStatuses[name]?.id || STATUS_UUIDS[name]]),
  ) as Record<StandardStatusName, string>
  const statuses = STANDARD_STATUS_NAMES.map((name) => {
    const existing = existingStatuses[name]
    return existing
      ? {
          id: existing.id,
          name,
          description: existing.description,
          scope: { type: "GLOBAL" as const },
          statusCategory: existing.statusCategory,
          statusReference: existing.id,
        }
      : {
          name,
          description: "",
          statusCategory: statusCategory(name),
          statusReference: STATUS_UUIDS[name],
        }
  })

  const initialTransition = {
    id: "1",
    name: "Criar",
    description: "",
    type: "INITIAL" as const,
    toStatusReference: statusReferences["PROJETO EM ABERTO"],
    links: [],
    actions: [],
    validators: [],
    triggers: [],
    properties: {},
  }

  const globalTransitions = STANDARD_STATUS_NAMES.map((statusName, index) => ({
    id: String(10 + index + 1),
    name: statusName,
    description: "",
    type: "GLOBAL" as const,
    toStatusReference: statusReferences[statusName],
    links: [],
    actions: [],
    validators: [],
    triggers: [],
    properties: {},
  }))

  return {
    scope: { type: "GLOBAL" as const },
    statuses,
    workflows: [
      {
        name: workflowName,
        description: "Fluxo padrão dos projetos Eazytech",
        startPointLayout: { x: -100, y: 0 },
        statuses: STANDARD_STATUS_NAMES.map((statusName, index) => ({
          statusReference: statusReferences[statusName],
          layout: { x: 120 + index * 180, y: 0 },
          properties: {},
        })),
        transitions: [initialTransition, ...globalTransitions],
      },
    ],
  }
}
