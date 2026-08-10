import assert from "node:assert/strict"
import test from "node:test"

import { createProjectCapability, createSessionToken, verifyProjectCapability, verifySessionToken } from "./auth.ts"

const secret = "uma-chave-de-teste-com-pelo-menos-32-caracteres"

test("sessao valida expira e rejeita adulteracao", () => {
  const token = createSessionToken(secret, 1_000, 60)
  assert.equal(verifySessionToken(token, secret, 30_000), true)
  assert.equal(verifySessionToken(token, secret, 62_000), false)
  assert.equal(verifySessionToken(`${token}x`, secret, 30_000), false)
})

test("capacidade vincula projeto, tipo e data", () => {
  const token = createProjectCapability({ projectId: "123", issueTypeId: "10001", createdDate: "2026-08-10" }, secret, 1_000, 60)
  assert.deepEqual(verifyProjectCapability(token, secret, 30_000), {
    projectId: "123",
    issueTypeId: "10001",
    createdDate: "2026-08-10",
  })
  assert.equal(verifyProjectCapability(token, secret, 62_000), null)
  assert.equal(verifyProjectCapability(`${token}x`, secret, 30_000), null)
})
