import assert from "node:assert/strict"
import test from "node:test"

import { buildBulkIssuePayload } from "./payloads.ts"

const accountIds = {
  fernando: "account-fernando",
  herbert: "account-herbert",
  felipe: "account-felipe",
  jacqueline: "account-jacqueline",
}

test("monta tarefas com responsaveis fixos, executor e datas", () => {
  const payload = buildBulkIssuePayload({
    projectId: "12000",
    issueTypeId: "13000",
    template: "TAREFAS EAZY PRO CONCESSIONARIA",
    executor: "jacqueline",
    accountIds,
    tasks: [
      {
        title: "[D0] [BRIEFING] Enviar briefing ao cliente",
        description: "Observação do projeto",
        dueDate: "2026-08-10",
      },
      {
        title: "[D2] [ESTRUTURA] Criar CRM EazyLeads",
        description: "",
        dueDate: "2026-08-13",
      },
    ],
  })

  assert.equal(payload.issueUpdates[0].fields.assignee.accountId, accountIds.fernando)
  assert.equal(payload.issueUpdates[1].fields.assignee.accountId, accountIds.jacqueline)
  assert.equal(payload.issueUpdates[1].fields.duedate, "2026-08-13")
  assert.deepEqual(payload.issueUpdates[0].fields.description, {
    type: "doc",
    version: 1,
    content: [{ type: "paragraph", content: [{ type: "text", text: "Observação do projeto" }] }],
  })
  assert.equal("reporter" in payload.issueUpdates[0].fields, false)
})

test("atribui tarefas tecnicas fixas ao Herbert", () => {
  const payload = buildBulkIssuePayload({
    projectId: "12000",
    issueTypeId: "13000",
    template: "TAREFAS EAZY PRO CONCESSIONARIA",
    executor: "felipe",
    accountIds,
    tasks: [
      {
        title: "[D1] [ACESSOS] Criação de Supabase",
        description: "",
        dueDate: "2026-08-12",
      },
    ],
  })

  assert.equal(payload.issueUpdates[0].fields.assignee.accountId, accountIds.herbert)
})
