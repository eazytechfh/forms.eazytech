"use server"

import { getSupabaseAdmin } from "@/lib/supabase-admin"

type SaveResult = { error: string | null }

export async function saveBriefingGeral(payload: Record<string, unknown>): Promise<SaveResult> {
  const supabaseAdmin = getSupabaseAdmin()
  const briefing = {
    nome_empresa: payload.nomeEmpresa,
    telefone: payload.telefoneContato,
    email: payload.email,
    whatsapp_numero: payload.whatsapp_numero,
    respostas: payload,
  }

  const { error } = await supabaseAdmin.from("briefings_geral").insert([briefing])
  console.log(error)
  return { error: error?.message ?? null }
}

export async function saveBriefingConcessionaria(payload: Record<string, unknown>): Promise<SaveResult> {
  const supabaseAdmin = getSupabaseAdmin()
  const briefing = {
    nome_empresa: payload.nomeEmpresa,
    telefone: payload.telefoneContato,
    email: payload.email,
    whatsapp_numero: payload.whatsapp_numero,
    respostas: payload,
  }
  const { error } = await supabaseAdmin.from("briefings_concessionarias").insert([briefing])
  console.log(error)
  return { error: error?.message ?? null }
}

type BriefingId = string | number

async function updateBriefing(table: "briefings_concessionarias" | "briefings_geral", id: BriefingId, payload: Record<string, unknown>): Promise<SaveResult> {
  const supabaseAdmin = getSupabaseAdmin()
  const update = {
    nome_empresa: payload.nomeEmpresa ?? payload.nome_empresa,
    telefone: payload.telefoneContato ?? payload.telefone,
    email: payload.email,
    whatsapp_numero: payload.whatsapp_numero,
    respostas: payload,
  }
  const { error } = await supabaseAdmin.from(table).update(update).eq("id", id)
  console.log(error)
  return { error: error?.message ?? null }
}

async function deleteBriefing(table: "briefings_concessionarias" | "briefings_geral", id: BriefingId): Promise<SaveResult> {
  const supabaseAdmin = getSupabaseAdmin()
  const { error } = await supabaseAdmin.from(table).delete().eq("id", id)
  console.log(error)
  return { error: error?.message ?? null }
}

export async function updateBriefingConcessionaria(id: BriefingId, payload: Record<string, unknown>) {
  return updateBriefing("briefings_concessionarias", id, payload)
}

export async function updateBriefingGeral(id: BriefingId, payload: Record<string, unknown>) {
  return updateBriefing("briefings_geral", id, payload)
}

export async function deleteBriefingConcessionaria(id: BriefingId) {
  return deleteBriefing("briefings_concessionarias", id)
}

export async function deleteBriefingGeral(id: BriefingId) {
  return deleteBriefing("briefings_geral", id)
}
