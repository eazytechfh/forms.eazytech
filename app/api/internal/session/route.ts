import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"

import {
  createSessionToken,
  getInternalAuthConfig,
  INTERNAL_SESSION_COOKIE,
  isInternalRequestAuthenticated,
} from "@/lib/jira/auth.ts"
import { isSameOrigin } from "@/lib/jira/http.ts"
import { checkRateLimit } from "@/lib/jira/rate-limit.ts"

export async function GET(request: Request) {
  try {
    return NextResponse.json({ authenticated: isInternalRequestAuthenticated(request) })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origem nao permitida" }, { status: 403 })
  if (!checkRateLimit(request, "internal-login", 10, 15 * 60_000)) return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 })
  try {
    const { password, secret } = getInternalAuthConfig()
    const input = (await request.json()) as { password?: unknown }
    const supplied = typeof input.password === "string" ? Buffer.from(input.password) : Buffer.alloc(0)
    const expected = Buffer.from(password)
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      return NextResponse.json({ error: "Senha invalida" }, { status: 401 })
    }
    const response = NextResponse.json({ authenticated: true })
    response.cookies.set(INTERNAL_SESSION_COOKIE, createSessionToken(secret), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 8 * 60 * 60,
    })
    return response
  } catch {
    return NextResponse.json({ error: "Acesso interno nao configurado" }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false })
  response.cookies.set(INTERNAL_SESSION_COOKIE, "", { path: "/", maxAge: 0 })
  return response
}
