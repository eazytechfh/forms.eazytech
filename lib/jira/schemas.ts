import { z } from "zod"

import { TASK_TEMPLATE_NAMES } from "./task-rules.ts"

const isoDateSchema = z.string().refine((value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && ![0, 6].includes(date.getUTCDay())
}, "Data limite deve ser valida e cair em dia util")

export const createProjectSchema = z.object({
  nomeEmpresa: z.string().trim().min(2, "Informe o nome da empresa").max(100, "Nome da empresa muito longo"),
})

export const bulkIssuesSchema = z.object({
  projectToken: z.string().min(40, "Autorizacao do projeto invalida"),
  executor: z.enum(["felipe", "jacqueline"]),
  template: z.enum(TASK_TEMPLATE_NAMES),
  tarefas: z
    .array(
      z.object({
        templateTaskIndex: z.number().int().min(0).max(100).nullable(),
        titulo: z.string().trim().min(1, "Titulo obrigatorio").max(255, "Titulo muito longo"),
        descricao: z.string().trim().max(10000, "Descricao muito longa"),
        dataLimite: isoDateSchema,
      }),
    )
    .min(1, "Selecione ao menos uma tarefa")
    .max(50, "O Jira aceita no maximo 50 tarefas por envio"),
})
