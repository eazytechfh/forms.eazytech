const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function calculateDueDate(baseDate: string, offsetDays: number, avoidWeekends = false): string {
  if (!ISO_DATE.test(baseDate)) {
    throw new Error("Data-base invalida")
  }
  if (!Number.isInteger(offsetDays) || offsetDays < 0) {
    throw new Error("Intervalo de prazo invalido")
  }

  const date = new Date(`${baseDate}T12:00:00.000Z`)
  if (Number.isNaN(date.getTime())) {
    throw new Error("Data-base invalida")
  }

  date.setUTCDate(date.getUTCDate() + offsetDays)

  if (avoidWeekends) {
    if (date.getUTCDay() === 6) date.setUTCDate(date.getUTCDate() + 2)
    if (date.getUTCDay() === 0) date.setUTCDate(date.getUTCDate() + 1)
  }

  return date.toISOString().slice(0, 10)
}

export function todayInSaoPaulo(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}
