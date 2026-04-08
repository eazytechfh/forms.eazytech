"use client"

import type React from "react"

import { useMemo, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type FieldType = "text" | "email" | "tel" | "url" | "textarea" | "password" | "number"
type ChoiceType = "checkbox" | "radio"

type BaseQuestion = {
  name: string
  label: string
  required?: boolean
  helper?: string
}

type TextQuestion = BaseQuestion & {
  kind?: "text"
  placeholder: string
  type?: FieldType
}

type ChoiceQuestion = BaseQuestion & {
  kind: ChoiceType
  options: string[]
}

type Question = TextQuestion | ChoiceQuestion

type Block = {
  id: string
  badge: string
  title: string
  description: string
  questions: Question[]
}

const blocks: Block[] = [
  {
    id: "dadosEmpresa",
    badge: "Bloco 1",
    title: "Dados da empresa",
    description: "Vamos montar a base da sua operacao e dos canais de atendimento.",
    questions: [
      { name: "nomeEmpresa", label: "Nome da empresa", placeholder: "Digite o nome da concessionaria", required: true },
      { name: "telefoneContato", label: "Telefone de contato", placeholder: "(11) 99999-9999", type: "tel", required: true },
      { name: "email", label: "Email", placeholder: "contato@empresa.com.br", type: "email", required: true },
      { name: "endereco", label: "Endereco", placeholder: "Rua, numero, bairro, cidade/UF", required: true },
      { name: "site", label: "Site", placeholder: "https://www.sualoja.com.br", type: "url" },
      {
        name: "redesSociais",
        label: "Redes sociais",
        placeholder: "Instagram, Facebook, TikTok ou links principais",
        type: "textarea",
      },
      {
        name: "funcionamento",
        label: "Dias e horarios de funcionamento",
        placeholder: "Ex: Segunda a sexta, das 8h as 18h. Sabado, das 8h as 13h",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "equipeAcessos",
    badge: "Bloco 2",
    title: "Equipe e acessos",
    description: "Agora vamos mapear vendedores, gerente, credenciais e portais ativos.",
    questions: [
      {
        name: "quantidadeVendedores",
        label: "Quantos vendedores tem atualmente?",
        placeholder: "Informe a quantidade de vendedores",
        type: "number",
        required: true,
      },
      {
        name: "vendedores",
        label: "Informe o nome e telefone de cada vendedor",
        placeholder: "Ex: Joao - (11) 99999-9999",
        type: "textarea",
        required: true,
      },
      {
        name: "revendaMaisEmail",
        label: "Acesso ao Revenda Mais - Email",
        placeholder: "Digite o email de acesso",
        type: "email",
        required: true,
      },
      {
        name: "revendaMaisSenha",
        label: "Acesso ao Revenda Mais - Senha",
        placeholder: "Digite a senha de acesso",
        type: "password",
        required: true,
      },
      {
        name: "gerenteNotificacoes",
        label: "Nome e telefone do gerente que recebera as notificacoes da distribuicao de leads",
        placeholder: "Ex: Maria Silva - (11) 98888-7777",
        type: "textarea",
        required: true,
      },
      {
        name: "portaisAtivos",
        kind: "checkbox",
        label: "Quais sao os portais que voces possuem?",
        options: ["Revenda Mais", "SO CARRAO", "Chaves na Mao", "WebMotors", "Outros"],
        required: true,
      },
      {
        name: "outrosPortais",
        label: "Se marcou Outros, quais portais sao utilizados?",
        placeholder: "Liste os outros portais",
        type: "textarea",
      },
      {
        name: "gmailCanais",
        label: "Acesso ao Gmail que recebe os e-mails dos canais de atendimento",
        placeholder: "Informe o email, senha ou o fluxo de acesso utilizado",
        type: "textarea",
        required: true,
        helper: "Ex: Revenda Mais, SO CARRAO, Chaves na Mao, WebMotors e outros canais.",
      },
    ],
  },
  {
    id: "regrasIa",
    badge: "Bloco 3",
    title: "Distribuicao e regras da IA",
    description: "Fechamos com a logica de distribuicao, atendimento e limites da IA.",
    questions: [
      {
        name: "distribuicaoLeads",
        kind: "radio",
        label: "Como sera a distribuicao dos leads da sua loja?",
        options: ["De forma sequencial", "De forma randomizada"],
        required: true,
      },
      {
        name: "realizaAgendamentos",
        kind: "radio",
        label: "Sua concessionaria realiza agendamentos?",
        options: ["Sim", "Nao"],
        required: true,
      },
      {
        name: "trabalhaRepasse",
        kind: "radio",
        label: "Sua loja trabalha com repasse de veiculos?",
        options: ["Sim", "Nao"],
        required: true,
      },
      {
        name: "naoPodeFalar",
        label: "O que a IA nao pode falar de jeito nenhum?",
        placeholder: "Liste assuntos proibidos, promessas ou respostas bloqueadas",
        type: "textarea",
        required: true,
      },
      {
        name: "informacoesPermitidas",
        kind: "checkbox",
        label: "Quais informacoes a IA pode informar ao lead?",
        options: ["Quilometragem", "Valor", "Cor", "Ano", "Motor", "Modelo", "Imagem"],
        required: true,
      },
    ],
  },
]

const initialTextValues = Object.fromEntries(
  blocks.flatMap((block) =>
    block.questions
      .filter((question) => question.kind !== "checkbox" && question.kind !== "radio")
      .map((question) => [question.name, ""]),
  ),
)

const initialCheckboxValues = Object.fromEntries(
  blocks.flatMap((block) =>
    block.questions.filter((question) => question.kind === "checkbox").map((question) => [question.name, [] as string[]]),
  ),
)

const initialRadioValues = Object.fromEntries(
  blocks.flatMap((block) =>
    block.questions.filter((question) => question.kind === "radio").map((question) => [question.name, ""]),
  ),
)

export default function IaConcessionariasPage() {
  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [textValues, setTextValues] = useState<Record<string, string>>(initialTextValues)
  const [checkboxValues, setCheckboxValues] = useState<Record<string, string[]>>(initialCheckboxValues)
  const [radioValues, setRadioValues] = useState<Record<string, string>>(initialRadioValues)
  const [blockError, setBlockError] = useState("")

  const currentBlock = blocks[currentStep]
  const progress = useMemo(() => ((currentStep + 1) / blocks.length) * 100, [currentStep])

  const updateTextField = (name: string, value: string) => {
    setTextValues((prev) => ({ ...prev, [name]: value }))
    setBlockError("")
  }

  const updateCheckboxField = (name: string, option: string) => {
    setCheckboxValues((prev) => {
      const current = prev[name] ?? []
      const updated = current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
      return { ...prev, [name]: updated }
    })
    setBlockError("")
  }

  const updateRadioField = (name: string, value: string) => {
    setRadioValues((prev) => ({ ...prev, [name]: value }))
    setBlockError("")
  }

  const getQuestionValue = (question: Question) => {
    if (question.kind === "checkbox") return checkboxValues[question.name] ?? []
    if (question.kind === "radio") return radioValues[question.name] ?? ""
    return textValues[question.name] ?? ""
  }

  const validateBlock = (block: Block) => {
    const hasMissing = block.questions.some((question) => {
      if (!question.required) return false
      const value = getQuestionValue(question)
      if (Array.isArray(value)) return value.length === 0
      return !String(value).trim()
    })

    if (!hasMissing) return true

    setBlockError(`Preencha os campos obrigatorios de "${block.title}" para continuar.`)
    return false
  }

  const handleNext = () => {
    if (!validateBlock(currentBlock)) return
    setCurrentStep((prev) => Math.min(prev + 1, blocks.length - 1))
  }

  const handlePrevious = () => {
    setBlockError("")
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const resetForm = () => {
    setStarted(false)
    setCurrentStep(0)
    setTextValues(initialTextValues)
    setCheckboxValues(initialCheckboxValues)
    setRadioValues(initialRadioValues)
    setBlockError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateBlock(currentBlock)) return

    setIsSubmitting(true)

    const payload = {
      tipoFormulario: "Briefing IA - Concessionarias",
      enviadoEm: new Date().toISOString(),
      ...textValues,
      ...radioValues,
      ...Object.fromEntries(Object.entries(checkboxValues).map(([key, value]) => [key, value.join(", ")])),
    }

    try {
      const response = await fetch("https://n8n.eazy.tec.br/webhook/35937fba-85fc-401e-bf73-7d20f00dc982", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Erro ao enviar")

      setShowSuccessDialog(true)
      resetForm()
    } catch {
      setBlockError("Nao foi possivel enviar o briefing agora. Tente novamente em alguns instantes.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.16),_transparent_32%),linear-gradient(180deg,_#ffffff_0%,_#f6f0ff_45%,_#ffffff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-20 h-64 w-64 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="absolute right-[-6rem] top-1/3 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-300/30 blur-3xl" />
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="border-violet-200 bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl text-violet-700">
              <CheckCircle2 className="h-8 w-8" />
              Briefing IA enviado com sucesso
            </DialogTitle>
            <DialogDescription className="pt-3 text-base text-slate-600">
              Recebemos os dados da sua concessionaria e vamos seguir com a configuracao da IA.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowSuccessDialog(false)} className="bg-violet-600 text-white hover:bg-violet-700">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {!started ? (
        <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            <div className="mb-8 rounded-[2rem] border border-violet-200/70 bg-white/80 p-8 shadow-[0_30px_80px_-30px_rgba(109,40,217,0.45)] backdrop-blur">
              <Image src="/s-c3-admbolo-20gradiente.png" alt="Logo da empresa" width={138} height={188} className="mx-auto h-24 w-auto md:h-28" />
            </div>

            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100/80 px-4 py-2 text-sm font-medium text-violet-700">
              <Sparkles className="h-4 w-4" />
              Experiencia guiada em blocos
            </span>

            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">Briefing IA - Concessionarias</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Preencha o briefing da sua loja em etapas curtas e objetivas. Vamos mapear equipe, acessos, distribuicao
              de leads e limites da IA em um fluxo simples.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4">
              <Button
                onClick={() => setStarted(true)}
                size="lg"
                className="h-14 rounded-full bg-violet-600 px-10 text-base font-semibold text-white shadow-lg shadow-violet-300/40 transition hover:bg-violet-700"
              >
                Preencher Formulario
              </Button>
              <p className="text-sm text-slate-500">3 blocos para estruturar a IA da sua concessionaria.</p>
            </div>
          </div>
        </main>
      ) : (
        <main className="relative px-4 py-8 md:px-6 md:py-10">
          <div className="mx-auto max-w-6xl">
            <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-violet-200 bg-white/85 p-4 shadow-sm">
                  <Image src="/s-c3-admbolo-20gradiente.png" alt="Logo da empresa" width={138} height={188} className="h-14 w-auto" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Formulario gameficado</p>
                  <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Briefing IA - Concessionarias</h1>
                </div>
              </div>

              <div className="rounded-3xl border border-violet-200 bg-white/85 p-4 shadow-sm md:min-w-80">
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>Progresso</span>
                  <span>{currentStep + 1}/{blocks.length}</span>
                </div>
                <div className="h-3 rounded-full bg-violet-100">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="rounded-[2rem] border border-violet-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="mb-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">Etapas</p>
                  <p className="mt-2 text-sm text-slate-500">Avance bloco por bloco e complete somente a etapa atual.</p>
                </div>

                <div className="space-y-3">
                  {blocks.map((block, index) => {
                    const isActive = index === currentStep
                    const isDone = index < currentStep
                    return (
                      <div
                        key={block.id}
                        className={`rounded-2xl border px-4 py-3 transition ${
                          isActive
                            ? "border-violet-400 bg-violet-600 text-white shadow-lg shadow-violet-200/60"
                            : isDone
                              ? "border-violet-200 bg-violet-50 text-violet-700"
                              : "border-violet-100 bg-white text-slate-500"
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em]">{block.badge}</p>
                        <p className="mt-1 text-sm font-semibold">{block.title}</p>
                      </div>
                    )
                  })}
                </div>
              </aside>

              <Card className="overflow-hidden rounded-[2rem] border-violet-200 bg-white/90 shadow-[0_35px_80px_-40px_rgba(109,40,217,0.45)] backdrop-blur">
                <CardContent className="p-0">
                  <form onSubmit={handleSubmit}>
                    <div className="border-b border-violet-100 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 px-6 py-8 text-white md:px-10">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">{currentBlock.badge}</p>
                      <h2 className="mt-2 text-3xl font-black md:text-4xl">{currentBlock.title}</h2>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-50 md:text-base">{currentBlock.description}</p>
                    </div>

                    <div className="space-y-6 px-6 py-8 md:px-10 md:py-10">
                      {currentBlock.questions.map((question) => {
                        if (question.kind === "checkbox") {
                          return (
                            <div key={question.name} className="space-y-3">
                              <Label className="text-sm font-semibold text-slate-800">
                                {question.label}
                                {question.required ? " *" : ""}
                              </Label>
                              <div className="grid gap-3 sm:grid-cols-2">
                                {question.options.map((option) => {
                                  const checked = (checkboxValues[question.name] ?? []).includes(option)
                                  return (
                                    <label
                                      key={option}
                                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                                        checked
                                          ? "border-violet-400 bg-violet-50 text-violet-700"
                                          : "border-violet-200 bg-white text-slate-600"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => updateCheckboxField(question.name, option)}
                                        className="h-4 w-4 accent-violet-600"
                                      />
                                      <span>{option}</span>
                                    </label>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        }

                        if (question.kind === "radio") {
                          return (
                            <div key={question.name} className="space-y-3">
                              <Label className="text-sm font-semibold text-slate-800">
                                {question.label}
                                {question.required ? " *" : ""}
                              </Label>
                              <div className="grid gap-3 sm:grid-cols-2">
                                {question.options.map((option) => {
                                  const checked = radioValues[question.name] === option
                                  return (
                                    <label
                                      key={option}
                                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                                        checked
                                          ? "border-violet-400 bg-violet-50 text-violet-700"
                                          : "border-violet-200 bg-white text-slate-600"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={question.name}
                                        checked={checked}
                                        onChange={() => updateRadioField(question.name, option)}
                                        className="h-4 w-4 accent-violet-600"
                                      />
                                      <span>{option}</span>
                                    </label>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        }

                        const textQuestion = question as TextQuestion

                        return (
                          <div key={question.name} className="space-y-2">
                            <Label htmlFor={question.name} className="text-sm font-semibold text-slate-800">
                              {question.label}
                              {question.required ? " *" : ""}
                            </Label>
                            {"helper" in question && question.helper ? <p className="text-sm text-slate-500">{question.helper}</p> : null}
                            {textQuestion.type === "textarea" ? (
                              <Textarea
                                id={question.name}
                                value={textValues[question.name] ?? ""}
                                onChange={(e) => updateTextField(question.name, e.target.value)}
                                rows={5}
                                placeholder={textQuestion.placeholder}
                                className="min-h-32 rounded-2xl border-violet-200 bg-violet-50/55 text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-400 focus-visible:ring-violet-300"
                              />
                            ) : (
                              <Input
                                id={question.name}
                                type={textQuestion.type ?? "text"}
                                value={textValues[question.name] ?? ""}
                                onChange={(e) => updateTextField(question.name, e.target.value)}
                                placeholder={textQuestion.placeholder}
                                className="h-12 rounded-2xl border-violet-200 bg-violet-50/55 text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-400 focus-visible:ring-violet-300"
                              />
                            )}
                          </div>
                        )
                      })}

                      {blockError ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                          {blockError}
                        </div>
                      ) : null}

                      <div className="flex flex-col gap-3 border-t border-violet-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 0 || isSubmitting}
                          className="h-12 rounded-full border-violet-200 px-6 text-violet-700 hover:bg-violet-50"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Voltar
                        </Button>

                        {currentStep < blocks.length - 1 ? (
                          <Button type="button" onClick={handleNext} className="h-12 rounded-full bg-violet-600 px-8 text-white hover:bg-violet-700">
                            Avancar
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button type="submit" disabled={isSubmitting} className="h-12 rounded-full bg-violet-600 px-8 text-white hover:bg-violet-700">
                            {isSubmitting ? "Enviando..." : "Enviar Briefing IA"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
