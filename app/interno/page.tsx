"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { AlertCircle, Check, CheckCircle2, Plus, RotateCcw, Save, Send, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { taskTemplates, type TaskTemplateName } from "./taskTemplates"

const N8N_BASE_URL = "https://n8n.eazy.tec.br"
const PROJECT_WEBHOOK = "https://eazytech-n8n.gsl3ku.easypanel.host/webhook/3eb4bcf4-9806-41a8-aad7-5d678804901a"
const TASKS_WEBHOOK = "https://eazytech-n8n.gsl3ku.easypanel.host/webhook/f434992a-b0c8-4780-bdf5-a11cdf0564d7"
const CALL_WEBHOOK = `${N8N_BASE_URL}/webhook/8bb0d014-dc5c-4a90-aaf4-d1ac85bd062b`

type Step = 1 | 2 | 3
type ProjectStatus = "idle" | "pendente" | "sucesso" | "erro"
type ProjectResult = { projectId: string; projectKey: string; issueTypeId: string }
type Feedback = { type: "success" | "error"; message: string } | null
type Assignee = "" | "fernando" | "felipe" | "jacqueline" | "herbert"
type Task = { id: string; selected: boolean; title: string; assignee: Assignee }
type ChecklistKey = "apresentou_eazysales" | "definiu_agentes" | "coletou_estoque" | "confirmou_crm" | "definiu_responsavel"

const providers = ["Uazapi", "Zaptos", "API Oficial (Meta)"]
const numberOptions = ["Número existente", "Número novo"]
const checklistItems: { key: ChecklistKey; label: string }[] = [
  { key: "apresentou_eazysales", label: "Apresentou a plataforma EazySales" },
  { key: "definiu_agentes", label: "Definiu quais agentes serão ativados" },
  { key: "coletou_estoque", label: "Coletou acesso ao estoque (XML / Revenda Mais)" },
  { key: "confirmou_crm", label: "Confirmou CRM atual do cliente" },
  { key: "definiu_responsavel", label: "Definiu responsável p/ homologação" },
]
const initialChecklist = Object.fromEntries(checklistItems.map(({ key }) => [key, false])) as Record<ChecklistKey, boolean>
const assignees: { value: Assignee; label: string }[] = [
  { value: "", label: "Selecionar responsável" },
  { value: "fernando", label: "Fernando" },
  { value: "felipe", label: "Felipe" },
  { value: "jacqueline", label: "Jacqueline" },
  { value: "herbert", label: "Herbert" },
]

const makeTask = (title = ""): Task => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
  selected: true,
  title,
  assignee: "",
})

export default function InternoPage() {
  const [step, setStep] = useState<Step>(1)
  const [company, setCompany] = useState("")
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("idle")
  const [project, setProject] = useState<ProjectResult | null>(null)
  const [provider, setProvider] = useState(providers[0])
  const [numberType, setNumberType] = useState(numberOptions[0])
  const [checklist, setChecklist] = useState(initialChecklist)
  const [observations, setObservations] = useState("")
  const [callSubmitting, setCallSubmitting] = useState(false)
  const [callFeedback, setCallFeedback] = useState<Feedback>(null)
  const [template, setTemplate] = useState<TaskTemplateName | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksSubmitting, setTasksSubmitting] = useState(false)
  const [tasksFeedback, setTasksFeedback] = useState<Feedback>(null)

  const createProject = async () => {
    const nomeEmpresa = company.trim()
    if (!nomeEmpresa) return
    setProjectStatus("pendente")
    setProject(null)
    try {
      const response = await fetch(PROJECT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomeEmpresa }),
      })
      if (!response.ok) throw new Error("Erro ao criar projeto")
      const result = (await response.json()) as Partial<ProjectResult>
      if (!result.projectId || !result.projectKey || !result.issueTypeId) throw new Error("Resposta inválida")
      setProject(result as ProjectResult)
      setProjectStatus("sucesso")
    } catch {
      setProjectStatus("erro")
    }
  }

  const startFlow = (event: React.FormEvent) => {
    event.preventDefault()
    if (!company.trim()) return
    setStep(2)
    void createProject()
  }

  const submitCall = async (event: React.FormEvent) => {
    event.preventDefault()
    setCallSubmitting(true)
    setCallFeedback(null)
    try {
      const response = await fetch(CALL_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresa: company, provedor: provider, numero: numberType, checklist, observacoes: observations }),
      })
      if (!response.ok) throw new Error()
      setCallFeedback({ type: "success", message: "Anotações enviadas com sucesso!" })
    } catch {
      setCallFeedback({ type: "error", message: "Erro ao enviar. Tente novamente." })
    } finally {
      setCallSubmitting(false)
    }
  }

  const selectTemplate = (name: TaskTemplateName) => {
    setTemplate(name)
    setTasks(taskTemplates[name].map((title) => makeTask(title)))
    setTasksFeedback(null)
  }

  const updateTask = (id: string, patch: Partial<Task>) =>
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)))

  const submitTasks = async () => {
    if (projectStatus !== "sucesso" || !project) return
    const selected = tasks.filter((task) => task.selected)
    if (!template || !selected.length) {
      setTasksFeedback({ type: "error", message: "Selecione ao menos uma tarefa." })
      return
    }
    if (selected.some((task) => !task.title.trim() || !task.assignee)) {
      setTasksFeedback({ type: "error", message: "Preencha o título e o responsável de todas as tarefas selecionadas." })
      return
    }
    setTasksSubmitting(true)
    setTasksFeedback(null)
    try {
      const response = await fetch(TASKS_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.projectId,
          issueTypeId: project.issueTypeId,
          tarefas: selected.map((task) => ({ titulo: task.title.trim(), responsavel: task.assignee, descricao: observations })),
        }),
      })
      if (!response.ok) throw new Error()
      setTasksFeedback({ type: "success", message: "Tarefas enviadas para o Jira com sucesso!" })
    } catch {
      setTasksFeedback({ type: "error", message: "Não foi possível enviar as tarefas. Tente novamente." })
    } finally {
      setTasksSubmitting(false)
    }
  }

  const stepInfo = [
    { number: 1 as Step, title: "Dados da empresa", detail: company || "Informe o cliente" },
    { number: 2 as Step, title: "Call com cliente", detail: "Infraestrutura e observações" },
    { number: 3 as Step, title: "Tarefas do projeto", detail: template || "Escolha o produto" },
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.16),_transparent_32%),linear-gradient(180deg,_#fff_0%,_#f6f0ff_45%,_#fff_100%)] text-slate-900">
      <main className="relative px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex items-center gap-4">
            <div className="rounded-2xl border border-violet-200 bg-white/80 p-3 shadow-lg">
              <Image src="/s-c3-admbolo-20gradiente.png" alt="Logo da empresa" width={70} height={90} className="h-14 w-auto" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Bloco de notas interno</p>
              <h1 className="text-2xl font-black md:text-4xl">Implantação do cliente</h1>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <aside className="h-fit space-y-3 lg:sticky lg:top-6">
              {stepInfo.map((item) => {
                const active = step === item.number
                const accessible = item.number === 1 || company.trim().length > 0
                return (
                  <button key={item.number} type="button" disabled={!accessible} onClick={() => accessible && setStep(item.number)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${active ? "border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200" : "border-violet-100 bg-white/90 text-slate-700 hover:border-violet-300"}`}>
                    <div className="flex gap-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${active ? "bg-white/20" : "bg-violet-100 text-violet-700"}`}>{item.number}</span>
                      <span className="min-w-0">
                        <span className="block font-bold">{item.title}</span>
                        <span className={`mt-1 block truncate text-xs ${active ? "text-violet-100" : "text-slate-500"}`}>{item.detail}</span>
                      </span>
                    </div>
                    {item.number === 1 && company && (
                      <div className={`mt-3 flex items-center gap-2 text-xs font-semibold ${active ? "text-white" : projectStatus === "erro" ? "text-rose-600" : "text-slate-500"}`}>
                        {projectStatus === "pendente" && <><Spinner className="h-3.5 w-3.5" /> Criando projeto...</>}
                        {projectStatus === "sucesso" && <><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Projeto criado{project ? ` · ${project.projectKey}` : ""}</>}
                        {projectStatus === "erro" && <><AlertCircle className="h-4 w-4" /> Erro ao criar projeto</>}
                      </div>
                    )}
                  </button>
                )
              })}
            </aside>

            <Card className="overflow-hidden rounded-[2rem] border-violet-200 bg-white/90 shadow-[0_35px_80px_-40px_rgba(109,40,217,.45)]">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 px-6 py-7 text-white md:px-10">
                  <p className="text-sm font-semibold uppercase tracking-[.2em] text-violet-100">Bloco {step}</p>
                  <h2 className="mt-2 text-3xl font-black">{stepInfo[step - 1].title}</h2>
                </div>

                {step === 1 && (
                  <form onSubmit={startFlow} className="space-y-6 p-6 md:p-10">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-base font-bold">Nome da empresa</Label>
                      <Input id="company" required value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Ex: AC Automóveis" className="h-12 rounded-2xl border-violet-200 bg-violet-50/50" />
                      <p className="text-sm text-slate-500">Esse nome será usado para criar o projeto no Jira</p>
                    </div>
                    <Button type="submit" disabled={!company.trim()} className="h-12 rounded-full bg-violet-600 px-7 hover:bg-violet-700"><Save /> Criar / Salvar</Button>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={submitCall} className="space-y-8 p-6 md:p-10">
                    <section className="space-y-5">
                      <div><h3 className="text-xl font-black">Infraestrutura WhatsApp</h3><p className="text-sm text-slate-500">Confirmar durante a call qual será usado</p></div>
                      <div className="flex flex-wrap gap-3">{providers.map((option) => <Choice key={option} active={provider === option} onClick={() => setProvider(option)}>{option}</Choice>)}</div>
                      <div className="space-y-3"><Label>Número já existe ou criar novo?</Label><div className="flex flex-wrap gap-3">{numberOptions.map((option) => <Choice key={option} active={numberType === option} onClick={() => setNumberType(option)}>{option}</Choice>)}</div></div>
                    </section>
                    <section className="space-y-4 border-t border-violet-100 pt-7">
                      <div><h3 className="text-xl font-black">Checklist da call</h3><p className="text-sm text-slate-500">Marque os pontos abordados com o cliente</p></div>
                      {checklistItems.map((item) => <label key={item.key} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-violet-200 px-4 py-3 text-sm"><Checkbox checked={checklist[item.key]} onCheckedChange={(checked) => setChecklist((old) => ({ ...old, [item.key]: checked === true }))} /><span>{item.label}</span></label>)}
                    </section>
                    <section className="space-y-4 border-t border-violet-100 pt-7">
                      <div><h3 className="text-xl font-black">Observações livres</h3><p className="text-sm text-slate-500">Contexto adicional, dores e combinados</p></div>
                      <Textarea value={observations} onChange={(event) => setObservations(event.target.value)} rows={6} className="rounded-2xl border-violet-200 bg-violet-50/50" />
                    </section>
                    <div className="flex flex-wrap items-center gap-3 border-t border-violet-100 pt-7">
                      <Button type="submit" disabled={callSubmitting} className="rounded-full bg-violet-600 hover:bg-violet-700">{callSubmitting ? <Spinner /> : <Save />} {callSubmitting ? "Salvando..." : "Salvar anotações"}</Button>
                      <Button type="button" variant="outline" onClick={() => setStep(3)} className="rounded-full border-violet-300">Ir para tarefas</Button>
                      <FeedbackBox feedback={callFeedback} />
                    </div>
                  </form>
                )}

                {step === 3 && (
                  <div className="space-y-7 p-6 md:p-10">
                    <section className="space-y-4">
                      <div><h3 className="text-xl font-black">Escolha o tipo de projeto</h3><p className="text-sm text-slate-500">A seleção carrega a checklist padrão editável.</p></div>
                      <div className="flex flex-wrap gap-2">{(Object.keys(taskTemplates) as TaskTemplateName[]).map((name) => <Choice key={name} active={template === name} onClick={() => selectTemplate(name)}>{name}</Choice>)}</div>
                    </section>

                    {template && (
                      <section className="space-y-3 border-t border-violet-100 pt-7">
                        {tasks.map((task) => (
                          <div key={task.id} className="grid gap-3 rounded-2xl border border-violet-200 bg-white p-3 md:grid-cols-[auto_1fr_210px_auto] md:items-center">
                            <Checkbox checked={task.selected} onCheckedChange={(checked) => updateTask(task.id, { selected: checked === true })} aria-label="Incluir tarefa" />
                            <Input value={task.title} onChange={(event) => updateTask(task.id, { title: event.target.value })} placeholder="Título da tarefa" className="border-violet-200" />
                            <select value={task.assignee} onChange={(event) => updateTask(task.id, { assignee: event.target.value as Assignee })} className="h-10 rounded-md border border-violet-200 bg-white px-3 text-sm">
                              {assignees.map((person) => <option key={person.value} value={person.value}>{person.label}</option>)}
                            </select>
                            <Button type="button" variant="ghost" size="icon" onClick={() => setTasks((old) => old.filter((item) => item.id !== task.id))} className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 /></Button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => setTasks((old) => [...old, makeTask()])} className="rounded-full border-violet-300 text-violet-700"><Plus /> Adicionar tarefa</Button>
                      </section>
                    )}

                    <section className="space-y-3 border-t border-violet-100 pt-7">
                      {projectStatus !== "sucesso" && (
                        <div className={`rounded-2xl border p-4 text-sm ${projectStatus === "erro" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                          {projectStatus === "erro" ? "O projeto não foi criado. Tente novamente antes de enviar as tarefas." : "Aguarde a criação do projeto no Jira para enviar as tarefas."}
                          {projectStatus === "erro" && <Button type="button" size="sm" variant="outline" onClick={() => void createProject()} className="ml-3 rounded-full border-rose-300"><RotateCcw /> Tentar criar projeto novamente</Button>}
                        </div>
                      )}
                      <Button type="button" onClick={() => void submitTasks()} disabled={projectStatus !== "sucesso" || tasksSubmitting || !template} className="h-12 rounded-full bg-violet-600 px-7 hover:bg-violet-700">
                        {tasksSubmitting ? <Spinner /> : <Send />} {tasksSubmitting ? "Enviando..." : "Enviar tarefas para o Jira"}
                      </Button>
                      <FeedbackBox feedback={tasksFeedback} />
                    </section>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${active ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "border border-violet-300 bg-white text-slate-600 hover:bg-violet-50"}`}>{active && <Check className="mr-1 inline h-4 w-4" />}{children}</button>
}

function FeedbackBox({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  return <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>{feedback.message}</div>
}
