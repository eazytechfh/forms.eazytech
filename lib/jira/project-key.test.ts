import assert from "node:assert/strict"
import test from "node:test"

import { buildProjectKeyCandidates } from "./project-key.ts"

test("gera uma sigla sem stopwords, acentos ou simbolos", () => {
  const candidates = buildProjectKeyCandidates("Concessionária São José Ltda 🟢")

  assert.equal(candidates[0], "CSJ")
})

test("usa o nome abreviado quando a empresa tem uma unica palavra", () => {
  const candidates = buildProjectKeyCandidates("Redeemer")

  assert.equal(candidates[0], "REDEEMER")
})

test("gera alternativas deterministicas dentro do limite do Jira", () => {
  const candidates = buildProjectKeyCandidates("Top Car")

  assert.deepEqual(candidates.slice(0, 4), ["TC", "TC01", "TC02", "TC03"])
  assert.equal(candidates.length, 100)
  assert.ok(candidates.every((candidate) => candidate.length <= 10))
})
