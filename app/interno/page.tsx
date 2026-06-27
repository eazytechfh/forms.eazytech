"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

type SelectionOption = {
  label: string
  value: string
}

type ChecklistKey =
  | "apresentou_eazysales"
  | "definiu_agentes"
  | "coletou_estoque"
  | "confirmou_crm"
  | "definiu_responsavel"

type ChecklistItem = {
  key: ChecklistKey
  label: string
}

type Feedback = {
  type: "success" | "error"
  message: string
} | null

const whatsappProviders: SelectionOption[] = [
  { label: "Uazapi", value: "Uazapi" },
  { label: "Zaptos", value: "Zaptos" },
  { label: "API Oficial (Meta)", value: "API Oficial (Meta)" },
]

const numberOptions: SelectionOption[] = [
  { label: "Numero existente", value: "Número existente" },
  { label: "Numero novo", value: "Número novo" },
]

const checklistItems: ChecklistItem[] = [
  { key: "apresentou_eazysales", label: "Apresentou a plataforma EazySales" },
  { key: "definiu_agentes", label: "Definiu quais agentes serao ativados" },
  { key: "coletou_estoque", label: "Coletou acesso ao estoque (XML / Revenda Mais)" },
  { key: "confirmou_crm", label: "Confirmou CRM atual do cliente" },
  { key: "definiu_responsavel", label: "Definiu responsavel p/ homologacao" },
]

const initialChecklist: Record<ChecklistKey, boolean> = {
  apresentou_eazysales: false,
  definiu_agentes: false,
  coletou_estoque: false,
  confirmou_crm: false,
  definiu_responsavel: false,
}

export default function InternoPage() {
  const [company, setCompany] = useState("")
  const [provider, setProvider] = useState(whatsappProviders[0].value)
  const [numberType, setNumberType] = useState(numberOptions[0].value)
  const [checklist, setChecklist] = useState<Record<ChecklistKey, boolean>>(initialChecklist)
  const [observations, setObservations] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const updateChecklist = (key: ChecklistKey, checked: boolean) => {
    setChecklist((prev) => ({ ...prev, [key]: checked }))
    setFeedback(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    const payload = {
      empresa: company,
      provedor: provider,
      numero: numberType,
      checklist,
      observacoes: observations,
    }

    try {
      const response = await fetch("https://n8n.eazy.tec.br/webhook/8bb0d014-dc5c-4a90-aaf4-d1ac85bd062b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar")
      }

      setFeedback({ type: "success", message: "Anotacoes enviadas com sucesso!" })
    } catch {
      setFeedback({ type: "error", message: "Erro ao enviar. Tente novamente." })
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

      <main className="relative px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 flex flex-col items-center text-center">
            <div className="mb-6 rounded-[2rem] border border-violet-200/70 bg-white/80 p-6 shadow-[0_30px_80px_-30px_rgba(109,40,217,0.45)] backdrop-blur">
              <Image
                src="/s-c3-admbolo-20gradiente.png"
                alt="Logo da empresa"
                width={138}
                height={188}
                className="mx-auto h-20 w-auto md:h-24"
              />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Bloco de notas interno</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-5xl">Call com cliente</h1>
          </header>

          <Card className="overflow-hidden rounded-[2rem] border-violet-200 bg-white/90 shadow-[0_35px_80px_-40px_rgba(109,40,217,0.45)] backdrop-blur">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                <div className="border-b border-violet-100 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-500 px-6 py-8 text-white md:px-10">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">Interno</p>
                  <h2 className="mt-2 text-3xl font-black md:text-4xl">Anotacoes da call</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-50 md:text-base">
                    Use durante a conversa para registrar infraestrutura, combinados e proximos passos.
                  </p>
                </div>

                <div className="space-y-8 px-6 py-8 md:px-10 md:py-10">
                  <section className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">Bloco 0</p>
                      <h3 className="mt-1 text-2xl font-black text-slate-900">Nome da empresa</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">Identifique o cliente desta call</p>
                    </div>

                    <Input
                      type="text"
                      value={company}
                      onChange={(event) => {
                        setCompany(event.target.value)
                        setFeedback(null)
                      }}
                      placeholder="Ex: AC Automoveis, Premier Car..."
                      className="h-12 rounded-2xl border-violet-200 bg-violet-50/55 text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-400 focus-visible:ring-violet-300"
                    />
                  </section>

                  <section className="space-y-5 border-t border-violet-100 pt-8">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">Bloco 1</p>
                      <h3 className="mt-1 text-2xl font-black text-slate-900">Infraestrutura WhatsApp</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">Confirmar durante a call qual sera usado</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {whatsappProviders.map((option) => {
                        const active = provider === option.value

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setProvider(option.value)
                              setFeedback(null)
                            }}
                            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                              active
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-200/60"
                                : "border border-purple-300 bg-white text-gray-600 hover:bg-purple-50"
                            }`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-800">Numero ja existe ou criar novo?</Label>
                      <div className="flex flex-wrap gap-3">
                        {numberOptions.map((option) => {
                          const active = numberType === option.value

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setNumberType(option.value)
                                setFeedback(null)
                              }}
                              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                                active
                                  ? "bg-purple-600 text-white shadow-lg shadow-purple-200/60"
                                  : "border border-purple-300 bg-white text-gray-600 hover:bg-purple-50"
                              }`}
                            >
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </section>

                  <section className="space-y-5 border-t border-violet-100 pt-8">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">Bloco 2</p>
                      <h3 className="mt-1 text-2xl font-black text-slate-900">Checklist da call</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">Marcar os pontos abordados com o cliente</p>
                    </div>

                    <div className="grid gap-3">
                      {checklistItems.map((item) => (
                        <label
                          key={item.key}
                          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-violet-50"
                        >
                          <Checkbox
                            checked={checklist[item.key]}
                            onCheckedChange={(checked) => updateChecklist(item.key, checked === true)}
                            className="border-violet-300 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-5 border-t border-violet-100 pt-8">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">Bloco 3</p>
                      <h3 className="mt-1 text-2xl font-black text-slate-900">Observacoes livres</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">Contexto adicional, dores, combinados verbais</p>
                    </div>

                    <Textarea
                      value={observations}
                      onChange={(event) => {
                        setObservations(event.target.value)
                        setFeedback(null)
                      }}
                      rows={6}
                      placeholder="Ex: cliente quer comecar pelo agente de leads do Meta. Tem 3 vendedores. Prefere nao usar IA no pos-venda por enquanto..."
                      className="min-h-40 rounded-2xl border-violet-200 bg-violet-50/55 text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-400 focus-visible:ring-violet-300"
                    />
                  </section>

                  <section className="space-y-4 border-t border-violet-100 pt-8 text-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-12 rounded-full bg-violet-600 px-8 text-white hover:bg-violet-700"
                    >
                      {isSubmitting ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                      {isSubmitting ? "Salvando..." : "Salvar anotacoes"}
                    </Button>

                    {feedback ? (
                      <div
                        className={`mx-auto max-w-md rounded-2xl border px-4 py-3 text-sm font-medium ${
                          feedback.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {feedback.message}
                      </div>
                    ) : null}
                  </section>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
