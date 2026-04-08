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

type FieldType = "text" | "email" | "tel" | "url" | "textarea"

type Question = {
  name: string
  label: string
  placeholder: string
  type?: FieldType
  required?: boolean
}

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
    description: "Vamos comecar pelas informacoes base para estruturar seu briefing.",
    questions: [
      {
        name: "nomeEmpresa",
        label: "Nome da empresa",
        placeholder: "Digite o nome da empresa",
        required: true,
      },
      {
        name: "telefoneContato",
        label: "Telefone de contato",
        placeholder: "(11) 99999-9999",
        type: "tel",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        placeholder: "contato@empresa.com.br",
        type: "email",
        required: true,
      },
      {
        name: "endereco",
        label: "Endereco",
        placeholder: "Rua, numero, bairro, cidade/UF",
        required: true,
      },
      {
        name: "site",
        label: "Site",
        placeholder: "https://www.suaempresa.com.br",
        type: "url",
      },
      {
        name: "redesSociais",
        label: "Redes sociais",
        placeholder: "Instagram, LinkedIn, Facebook ou links principais",
        type: "textarea",
      },
    ],
  },
  {
    id: "objetivoIa",
    badge: "Bloco 2",
    title: "Objetivo da IA",
    description: "Aqui definimos para que a IA vai existir e o que precisa evitar.",
    questions: [
      {
        name: "objetivoPrincipalIa",
        label: "Qual e o principal objetivo dessa IA?",
        placeholder: "Ex: vender, qualificar, suporte, agendamento, retencao",
        type: "textarea",
        required: true,
      },
      {
        name: "resultadoPerfeito",
        label: "O que seria um resultado perfeito pra voce?",
        placeholder: "Descreva o cenario ideal de funcionamento",
        type: "textarea",
        required: true,
      },
      {
        name: "iaNaoPodeFazer",
        label: "O que a IA nao pode fazer de jeito nenhum?",
        placeholder: "Liste limites criticos e comportamentos proibidos",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "contextoNegocio",
    badge: "Bloco 3",
    title: "Contexto do negocio",
    description: "Essas respostas ajudam a IA a entender o mercado e o cliente ideal.",
    questions: [
      {
        name: "oQueVende",
        label: "O que voce vende exatamente?",
        placeholder: "Detalhe o produto ou servico",
        type: "textarea",
        required: true,
      },
      {
        name: "publicoIdeal",
        label: "Quem e seu publico ideal?",
        placeholder: "Descreva o cliente ideal",
        type: "textarea",
        required: true,
      },
      {
        name: "doresPublico",
        label: "Quais sao as principais dores desse publico?",
        placeholder: "Liste as dores mais comuns",
        type: "textarea",
        required: true,
      },
      {
        name: "diferencialEmpresa",
        label: "Qual e o diferencial da sua empresa hoje?",
        placeholder: "O que faz sua empresa se destacar",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "comportamentoIa",
    badge: "Bloco 4",
    title: "Comportamento da IA",
    description: "Vamos definir o tom de voz e o estilo da comunicacao.",
    questions: [
      {
        name: "tomDeVoz",
        label: "A IA deve ser mais formal ou mais descontraida?",
        placeholder: "Descreva o estilo ideal",
        type: "textarea",
        required: true,
      },
      {
        name: "usoEmojis",
        label: "Pode usar emojis ou nao?",
        placeholder: "Explique como a IA deve lidar com emojis",
        type: "textarea",
        required: true,
      },
      {
        name: "nivelDetalhe",
        label: "Deve ser curta e direta ou mais explicativa?",
        placeholder: "Defina como as respostas devem ser estruturadas",
        type: "textarea",
        required: true,
      },
      {
        name: "referenciasComunicacao",
        label: "Existe algum exemplo de comunicacao que voce gosta?",
        placeholder: "Cite referencias, marcas ou frases",
        type: "textarea",
      },
    ],
  },
  {
    id: "fluxoAtendimento",
    badge: "Bloco 5",
    title: "Fluxo de atendimento",
    description: "Agora mapeamos como a conversa precisa acontecer na pratica.",
    questions: [
      {
        name: "perguntasObrigatorias",
        label: "Quais perguntas a IA precisa fazer obrigatoriamente?",
        placeholder: "Liste as perguntas essenciais",
        type: "textarea",
        required: true,
      },
      {
        name: "transferenciaHumano",
        label: "Em que momento deve transferir para humano?",
        placeholder: "Explique os gatilhos de transferencia",
        type: "textarea",
        required: true,
      },
      {
        name: "quemRecebeLead",
        label: "Quem recebe o lead depois?",
        placeholder: "Informe cargo, nome ou setor responsavel",
        type: "textarea",
        required: true,
      },
      {
        name: "setoresTransferencia",
        label: "Existe mais de 1 setor? Se sim, informe os setores e quando cada um deve receber a transferencia.",
        placeholder: "Descreva os setores e regras de encaminhamento",
        type: "textarea",
      },
    ],
  },
  {
    id: "limitesRegras",
    badge: "Bloco 6",
    title: "Limites e regras",
    description: "Aqui entram as travas, scripts e politicas que a IA deve respeitar.",
    questions: [
      {
        name: "assuntoProibido",
        label: "Existe algum assunto proibido?",
        placeholder: "Liste assuntos que a IA deve evitar",
        type: "textarea",
        required: true,
      },
      {
        name: "podeFalarPreco",
        label: "A IA pode falar preco?",
        placeholder: "Explique quando pode ou nao pode",
        type: "textarea",
        required: true,
      },
      {
        name: "podeNegociar",
        label: "Pode negociar ou so apresentar?",
        placeholder: "Defina o limite comercial da IA",
        type: "textarea",
        required: true,
      },
      {
        name: "scriptsFixos",
        label: "Tem respostas que devem ser padrao (script fixo)?",
        placeholder: "Cole ou descreva os scripts obrigatorios",
        type: "textarea",
      },
    ],
  },
  {
    id: "comercial",
    badge: "Bloco 7",
    title: "Comercial",
    description: "Esse bloco ajuda a IA a converter melhor e conduzir a venda.",
    questions: [
      {
        name: "ofertasPrincipais",
        label: "Quais sao suas ofertas principais?",
        placeholder: "Liste produtos, servicos ou planos",
        type: "textarea",
        required: true,
      },
      {
        name: "promocoesAtivas",
        label: "Tem promocoes ou gatilhos de anuncios ativos que devem ser usados?",
        placeholder: "Explique campanhas, bonus ou condicoes vigentes",
        type: "textarea",
      },
      {
        name: "objecoesMaisComuns",
        label: "Quais objecoes voce mais recebe hoje?",
        placeholder: "Liste as objecoes mais frequentes",
        type: "textarea",
        required: true,
      },
      {
        name: "comoFechaVenda",
        label: "Como voce costuma fechar uma venda?",
        placeholder: "Descreva o processo de fechamento",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "qualificacao",
    badge: "Bloco 8",
    title: "Qualificacao",
    description: "Aqui a gente define o que e um lead bom e o que precisa ser filtrado.",
    questions: [
      {
        name: "leadQualificado",
        label: "O que define um lead qualificado pra voce?",
        placeholder: "Explique o perfil ideal",
        type: "textarea",
        required: true,
      },
      {
        name: "informacoesObrigatorias",
        label: "Quais informacoes sao obrigatorias coletar?",
        placeholder: "Ex: nome, cidade, orcamento, segmento",
        type: "textarea",
        required: true,
      },
      {
        name: "criteriosDescarte",
        label: "Existe algum criterio pra descartar leads?",
        placeholder: "Descreva quando o lead nao deve seguir",
        type: "textarea",
      },
    ],
  },
  {
    id: "cenariosReais",
    badge: "Bloco 9",
    title: "Cenarios reais",
    description: "Fechamos com situacoes do dia a dia para deixar a IA mais preparada.",
    questions: [
      {
        name: "perguntasRepetidas",
        label: "Quais perguntas mais se repetem?",
        placeholder: "Liste as duvidas mais frequentes",
        type: "textarea",
        required: true,
      },
      {
        name: "ondePerdeLeads",
        label: "Onde voce perde mais leads hoje?",
        placeholder: "Explique os pontos de maior perda",
        type: "textarea",
        required: true,
      },
    ],
  },
]

const initialValues = Object.fromEntries(blocks.flatMap((block) => block.questions.map((question) => [question.name, ""])))

export default function ProspectForms() {
  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, string>>(initialValues)
  const [blockError, setBlockError] = useState("")

  const currentBlock = blocks[currentStep]
  const progress = useMemo(() => ((currentStep + 1) / blocks.length) * 100, [currentStep])

  const updateField = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }))
    setBlockError("")
  }

  const validateBlock = (block: Block) => {
    const missingFields = block.questions.filter((question) => question.required && !formValues[question.name]?.trim())

    if (missingFields.length === 0) {
      return true
    }

    setBlockError(`Preencha os campos obrigatorios de "${block.title}" para continuar.`)
    return false
  }

  const handleNext = () => {
    if (!validateBlock(currentBlock)) {
      return
    }

    setCurrentStep((prev) => Math.min(prev + 1, blocks.length - 1))
  }

  const handlePrevious = () => {
    setBlockError("")
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateBlock(currentBlock)) {
      return
    }

    setIsSubmitting(true)

    const payload = {
      tipoFormulario: "Briefing IA",
      enviadoEm: new Date().toISOString(),
      ...formValues,
    }

    try {
      const response = await fetch("https://n8n.eazy.tec.br/webhook/a146aec8-4d86-4456-820c-84a6e13427c3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar")
      }

      setShowSuccessDialog(true)
      setStarted(false)
      setCurrentStep(0)
      setFormValues(initialValues)
      setBlockError("")
    } catch (error) {
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
              Recebemos suas respostas e vamos usar esse material para estruturar a IA da forma certa.
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
              <Image
                src="/s-c3-admbolo-20gradiente.png"
                alt="Logo da empresa"
                width={138}
                height={188}
                className="mx-auto h-24 w-auto md:h-28"
              />
            </div>

            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100/80 px-4 py-2 text-sm font-medium text-violet-700">
              <Sparkles className="h-4 w-4" />
              Experiencia guiada em blocos
            </span>

            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">Briefing IA</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Preencha seu briefing em etapas curtas e objetivas. Cada bloco ajuda a construir uma IA mais alinhada ao
              seu negocio, ao seu time e a sua conversao.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4">
              <Button
                onClick={() => setStarted(true)}
                size="lg"
                className="h-14 rounded-full bg-violet-600 px-10 text-base font-semibold text-white shadow-lg shadow-violet-300/40 transition hover:bg-violet-700"
              >
                Preencher Formulario
              </Button>
              <p className="text-sm text-slate-500">9 blocos para mapear objetivo, contexto, regras e conversao.</p>
            </div>
          </div>
        </main>
      ) : (
        <main className="relative px-4 py-8 md:px-6 md:py-10">
          <div className="mx-auto max-w-6xl">
            <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-violet-200 bg-white/85 p-4 shadow-sm">
                  <Image
                    src="/s-c3-admbolo-20gradiente.png"
                    alt="Logo da empresa"
                    width={138}
                    height={188}
                    className="h-14 w-auto"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Formulario gameficado</p>
                  <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Briefing IA</h1>
                </div>
              </div>

              <div className="rounded-3xl border border-violet-200 bg-white/85 p-4 shadow-sm md:min-w-80">
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>Progresso</span>
                  <span>
                    {currentStep + 1}/{blocks.length}
                  </span>
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
                  <p className="mt-2 text-sm text-slate-500">Avance bloco por bloco e complete somente o que esta na fase atual.</p>
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
                      {currentBlock.questions.map((question) => (
                        <div key={question.name} className="space-y-2">
                          <Label htmlFor={question.name} className="text-sm font-semibold text-slate-800">
                            {question.label}
                            {question.required ? " *" : ""}
                          </Label>

                          {question.type === "textarea" ? (
                            <Textarea
                              id={question.name}
                              value={formValues[question.name]}
                              onChange={(e) => updateField(question.name, e.target.value)}
                              rows={5}
                              placeholder={question.placeholder}
                              className="min-h-32 rounded-2xl border-violet-200 bg-violet-50/55 text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-400 focus-visible:ring-violet-300"
                            />
                          ) : (
                            <Input
                              id={question.name}
                              type={question.type ?? "text"}
                              value={formValues[question.name]}
                              onChange={(e) => updateField(question.name, e.target.value)}
                              placeholder={question.placeholder}
                              className="h-12 rounded-2xl border-violet-200 bg-violet-50/55 text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-400 focus-visible:ring-violet-300"
                            />
                          )}
                        </div>
                      ))}

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
                          <Button
                            type="button"
                            onClick={handleNext}
                            className="h-12 rounded-full bg-violet-600 px-8 text-white hover:bg-violet-700"
                          >
                            Avancar
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-12 rounded-full bg-violet-600 px-8 text-white hover:bg-violet-700"
                          >
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
