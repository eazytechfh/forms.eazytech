import assert from "node:assert/strict"
import test from "node:test"

import { STANDARD_STATUS_NAMES, buildStandardWorkflowPayload } from "./workflow.ts"

test("define os doze status padrao do fluxo Eazytech", () => {
  assert.deepEqual(STANDARD_STATUS_NAMES, [
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
  ])
})

test("usa PROJETO EM ABERTO como transicao inicial", () => {
  const payload = buildStandardWorkflowPayload("Eazytech - Projetos")
  const workflow = payload.workflows[0]
  const initial = workflow.transitions.find((transition) => transition.type === "INITIAL")

  assert.equal(initial?.toStatusReference, payload.statuses[0].statusReference)
  assert.equal(payload.statuses[0].name, "PROJETO EM ABERTO")
})

test("permite transicao global para todas as etapas", () => {
  const payload = buildStandardWorkflowPayload("Eazytech - Projetos")
  const globalTransitions = payload.workflows[0].transitions.filter((transition) => transition.type === "GLOBAL")

  assert.equal(globalTransitions.length, STANDARD_STATUS_NAMES.length)
})
