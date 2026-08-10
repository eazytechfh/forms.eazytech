const buckets = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(request: Request, scope: string, limit: number, windowMs: number) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"
  const key = `${scope}:${address}`
  const now = Date.now()
  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (current.count >= limit) return false
  current.count += 1
  return true
}
