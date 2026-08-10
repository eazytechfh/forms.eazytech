import assert from "node:assert/strict"
import test from "node:test"

import { resolveTaskRule } from "./task-rules.ts"

test("atribui tarefas de briefing ao Fernando", () => {
  assert.deepEqual(resolveTaskRule("[D0] [BRIEFING] Enviar briefing ao cliente"), {
    assignee: "fernando",
    dueOffsetDays: 0,
  })
})

test("atribui criacao da instancia e acessos tecnicos ao Herbert", () => {
  assert.equal(resolveTaskRule("[D0] [KICK OFF] Criar instância do UAZAPI").assignee, "herbert")
  assert.equal(resolveTaskRule("[D1] [ACESSOS] Criação de Supabase").assignee, "herbert")
})

test("mantem logs de atualizacao com o executor operacional", () => {
  assert.equal(
    resolveTaskRule("ADICIONAR LOGS DE ATUALIZAÇÃO NO GRUPO", "TAREFAS EAZY PRO CONCESSIONARIA").assignee,
    "executor",
  )
})

test("mantem as tarefas operacionais para o executor escolhido", () => {
  assert.equal(resolveTaskRule("[D2] [ESTRUTURA] Criar CRM EazyLeads").assignee, "executor")
})

test("usa os intervalos observados no projeto 19 MOTORS", () => {
  assert.equal(resolveTaskRule("[D2] [ESTRUTURA] Criar prompt na OpenAI").dueOffsetDays, 4)
  assert.equal(resolveTaskRule("[D5] [TESTES] Teste interno completo com equipe (incluindo Follow-up)").dueOffsetDays, 11)
  assert.equal(resolveTaskRule("[D7+] [PÓS] Ativar IA (UAZAPI)").dueOffsetDays, 12)
})

test("limita a entrega final a quinze dias corridos", () => {
  assert.equal(resolveTaskRule("[D15+] [PÓS] Validação final + feedback (15 dias)").dueOffsetDays, 15)
  assert.equal(resolveTaskRule("Tarefa sem marcador de dia").dueOffsetDays, 15)
})

test("mantem acessos do EazyStart com o executor operacional", () => {
  assert.equal(
    resolveTaskRule("[D1] [ACESSOS] Criação de Gmail do cliente", "TAREFAS EAZYSTART").assignee,
    "executor",
  )
})

test("aplica as tarefas fixas de Fernando no Eazy Sales interno", () => {
  assert.equal(
    resolveTaskRule("[ONBOARDING] - REUNIÃO DE CAPTURA DE ACESSOS", "TAREFAS EAZY SALES (interno)").assignee,
    "fernando",
  )
  assert.equal(
    resolveTaskRule("[CRM] - CONFIGURAR PIPELINES E FUNIL", "TAREFAS EAZY SALES (interno)").assignee,
    "executor",
  )
})
