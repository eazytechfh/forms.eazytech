const STOPWORDS = new Set(["DE", "DA", "DO", "DAS", "DOS", "E", "LTDA", "ME", "EIRELI"])

function sanitizeWords(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !STOPWORDS.has(word))
}

export function buildProjectKeyCandidates(name: string): string[] {
  const words = sanitizeWords(name)
  const rawBase = words.length > 1 ? words.map((word) => word[0]).join("") : words[0] || "PJ"
  const base = (/^[A-Z]/.test(rawBase) ? rawBase : `P${rawBase}`).slice(0, 10) || "PJ"
  const candidates = [base]

  for (let suffix = 1; suffix <= 99; suffix += 1) {
    const formattedSuffix = suffix.toString().padStart(2, "0")
    candidates.push(`${base.slice(0, 10 - formattedSuffix.length)}${formattedSuffix}`)
  }

  return candidates
}
