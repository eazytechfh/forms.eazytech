import assert from "node:assert/strict"
import test from "node:test"

import { calculateDueDate } from "./due-date.ts"

test("soma dias corridos a uma data ISO", () => {
  assert.equal(calculateDueDate("2026-08-10", 5), "2026-08-15")
})

test("move vencimento de sabado para a segunda seguinte", () => {
  assert.equal(calculateDueDate("2026-08-10", 5, true), "2026-08-17")
})

test("move vencimento de domingo para a segunda seguinte", () => {
  assert.equal(calculateDueDate("2026-08-10", 6, true), "2026-08-17")
})

test("mantem vencimento em dia util", () => {
  assert.equal(calculateDueDate("2026-08-10", 4, true), "2026-08-14")
})
