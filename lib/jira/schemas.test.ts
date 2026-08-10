import assert from "node:assert/strict"
import test from "node:test"

import { bulkIssuesSchema, createProjectSchema } from "./schemas.ts"

test("normaliza um nome de empresa valido", () => {
  assert.deepEqual(createProjectSchema.parse({ nomeEmpresa: "  Top Car  " }), { nomeEmpresa: "Top Car" })
})

test("rejeita nome de empresa vazio", () => {
  assert.equal(createProjectSchema.safeParse({ nomeEmpresa: " " }).success, false)
})

test("aceita somente executor e tarefas dentro dos limites", () => {
  const result = bulkIssuesSchema.safeParse({
    projectToken: "x".repeat(40),
    executor: "felipe",
    template: "TAREFAS EAZY PRO",
    tarefas: [{ templateTaskIndex: 0, titulo: "Tarefa", descricao: "", dataLimite: "2026-08-10" }],
  })

  assert.equal(result.success, true)
})

test("rejeita responsavel ou data forjados", () => {
  const invalidExecutor = bulkIssuesSchema.safeParse({
    projectToken: "x".repeat(40),
    executor: "fernando",
    template: "TAREFAS EAZY PRO",
    tarefas: [{ templateTaskIndex: 0, titulo: "Tarefa", descricao: "", dataLimite: "2026-08-10" }],
  })
  const invalidDate = bulkIssuesSchema.safeParse({
    projectToken: "x".repeat(40),
    executor: "felipe",
    template: "TAREFAS EAZY PRO",
    tarefas: [{ templateTaskIndex: 0, titulo: "Tarefa", descricao: "", dataLimite: "10/08/2026" }],
  })

  assert.equal(invalidExecutor.success, false)
  assert.equal(invalidDate.success, false)
})

test("rejeita datas inexistentes e vencimentos no fim de semana", () => {
  const base = { projectToken: "x".repeat(40), executor: "felipe", template: "TAREFAS EAZY PRO" }
  assert.equal(bulkIssuesSchema.safeParse({ ...base, tarefas: [{ templateTaskIndex: 0, titulo: "Tarefa", descricao: "", dataLimite: "2026-02-30" }] }).success, false)
  assert.equal(bulkIssuesSchema.safeParse({ ...base, tarefas: [{ templateTaskIndex: 0, titulo: "Tarefa", descricao: "", dataLimite: "2026-08-09" }] }).success, false)
})
