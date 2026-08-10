import { createHmac, timingSafeEqual } from "node:crypto"

export const INTERNAL_SESSION_COOKIE = "eazy_internal_session"

type ProjectCapability = {
  projectId: string
  issueTypeId: string
  createdDate: string
}

function encode(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url")
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url")
}

function createSignedToken(payload: object, secret: string, nowMs: number, ttlSeconds: number) {
  const encoded = encode({ ...payload, exp: Math.floor(nowMs / 1000) + ttlSeconds })
  return `${encoded}.${sign(encoded, secret)}`
}

function verifySignedToken(token: string, secret: string, nowMs: number): Record<string, unknown> | null {
  try {
    const [payload, signature, extra] = token.split(".")
    if (!payload || !signature || extra) return null
    const expected = Buffer.from(sign(payload, secret))
    const received = Buffer.from(signature)
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Record<string, unknown>
    return typeof value.exp === "number" && value.exp > Math.floor(nowMs / 1000) ? value : null
  } catch {
    return null
  }
}

export function getInternalAuthConfig() {
  const password = process.env.INTERNAL_BRIEFING_PASSWORD
  const secret = process.env.INTERNAL_SESSION_SECRET
  if (!password || !secret || secret.length < 32) throw new Error("Configuracao de acesso interno incompleta")
  return { password, secret }
}

export function createSessionToken(secret: string, nowMs = Date.now(), ttlSeconds = 8 * 60 * 60) {
  return createSignedToken({ scope: "internal-briefing" }, secret, nowMs, ttlSeconds)
}

export function verifySessionToken(token: string | undefined, secret: string, nowMs = Date.now()) {
  const value = token ? verifySignedToken(token, secret, nowMs) : null
  return value?.scope === "internal-briefing"
}

export function createProjectCapability(data: ProjectCapability, secret: string, nowMs = Date.now(), ttlSeconds = 8 * 60 * 60) {
  return createSignedToken({ ...data, scope: "jira-project" }, secret, nowMs, ttlSeconds)
}

export function verifyProjectCapability(token: string, secret: string, nowMs = Date.now()): ProjectCapability | null {
  const value = verifySignedToken(token, secret, nowMs)
  if (
    value?.scope !== "jira-project" ||
    typeof value.projectId !== "string" ||
    typeof value.issueTypeId !== "string" ||
    typeof value.createdDate !== "string"
  ) return null
  return { projectId: value.projectId, issueTypeId: value.issueTypeId, createdDate: value.createdDate }
}

export function readCookie(request: Request, name: string) {
  const raw = request.headers.get("cookie")
  return raw?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1)
}

export function isInternalRequestAuthenticated(request: Request) {
  const { secret } = getInternalAuthConfig()
  return verifySessionToken(readCookie(request, INTERNAL_SESSION_COOKIE), secret)
}
