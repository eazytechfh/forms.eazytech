# Direct Jira Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `/interno` n8n webhooks with server-side Jira project and issue creation, standard workflow statuses, fixed/dynamic assignees, and calendar-day due dates that never land on weekends.

**Architecture:** The browser calls same-origin Next.js route handlers. Pure Jira domain helpers generate project keys, resolve assignees and due dates, while a server-only client owns authentication and Jira REST calls. New company-managed projects receive a reusable workflow scheme before any issue is created, and the initial workflow transition points to `PROJETO EM ABERTO`.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Zod, Node 22 built-in test runner, Jira Cloud REST API v3.

## Global Constraints

- Preserve all five task templates currently exposed by `/interno`.
- Fernando and Herbert assignments are fixed; operational tasks use the Felipe/Jacqueline selection made at submission time.
- Due dates count calendar days and move Saturday/Sunday results to the following Monday.
- The first status for every created issue is `PROJETO EM ABERTO`.
- Jira credentials remain server-only and are never returned in API errors.
- Preserve unrelated user changes to `package.json` and `package-lock.json`.

---

### Task 1: Pure Jira domain rules

**Files:**
- Create: `lib/jira/project-key.ts`
- Create: `lib/jira/due-date.ts`
- Create: `lib/jira/task-rules.ts`
- Test: `lib/jira/project-key.test.ts`
- Test: `lib/jira/due-date.test.ts`
- Test: `lib/jira/task-rules.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `buildProjectKeyCandidates(name)`, `calculateDueDate(baseDate, offsetDays)`, `resolveTaskRule(title)`.
- Consumes: task titles from `app/interno/taskTemplates.ts`.

- [ ] **Step 1: Write failing tests** for stopword/accent removal, deterministic collision candidates, calendar offsets, weekend rollover, and Fernando/Herbert/executor task classification.
- [ ] **Step 2: Run `npm test`** and verify failures are caused by missing domain modules.
- [ ] **Step 3: Implement the pure functions** with no network or environment dependencies.
- [ ] **Step 4: Run `npm test`** and expect all domain tests to pass.

### Task 2: Jira client, validation, and workflow payloads

**Files:**
- Create: `lib/jira/config.ts`
- Create: `lib/jira/client.ts`
- Create: `lib/jira/workflow.ts`
- Create: `lib/jira/payloads.ts`
- Create: `lib/jira/payloads.test.ts`

**Interfaces:**
- Consumes: `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_LEAD_ACCOUNT_ID`, `JIRA_REPORTER_ACCOUNT_ID`.
- Produces: `jiraRequest()`, `ensureStandardWorkflow(projectId)`, `buildBulkIssuePayload()`.

- [ ] **Step 1: Write failing payload tests** asserting ADF descriptions, `duedate`, fixed account IDs, dynamic executor IDs, and reporter fields.
- [ ] **Step 2: Run `npm test`** and verify expected missing-module failures.
- [ ] **Step 3: Implement server-only configuration and Jira errors** that redact remote response details and credentials.
- [ ] **Step 4: Implement the standard workflow definition** with the twelve Jira status names observed on 19 MOTORS and an initial transition to `PROJETO EM ABERTO`.
- [ ] **Step 5: Run `npm test`** and expect all payload tests to pass.

### Task 3: Same-origin project route

**Files:**
- Create: `app/api/jira/projects/route.ts`
- Create: `lib/jira/schemas.ts`

**Interfaces:**
- Consumes: `{ nomeEmpresa: string }`.
- Produces: `{ projectId, projectKey, issueTypeId, createdDate }`.

- [ ] **Step 1: Define and test the project input schema** with trimmed length bounds.
- [ ] **Step 2: Generate and check project key candidates** until Jira reports an available key.
- [ ] **Step 3: Create a company-managed business project** using the configured lead account.
- [ ] **Step 4: Associate/verify the standard workflow before issues exist** and resolve the `Tarefa` issue type.
- [ ] **Step 5: Return sanitized errors** without Jira credentials or raw upstream bodies.

### Task 4: Same-origin bulk issue route

**Files:**
- Create: `app/api/jira/issues/bulk/route.ts`
- Modify: `lib/jira/schemas.ts`

**Interfaces:**
- Consumes: `{ projectId, issueTypeId, executor, baseDate, tarefas[] }`.
- Produces: `{ issues: Array<{ id, key, self }> }`.

- [ ] **Step 1: Define and test bounded Zod schemas** for IDs, executor choice, titles, descriptions, and due dates.
- [ ] **Step 2: Resolve every submitted task through the server-owned task rules** so the browser cannot forge account IDs.
- [ ] **Step 3: Build the Jira bulk payload** including ADF description, reporter, assignee, and due date.
- [ ] **Step 4: Submit to Jira and return only issue identifiers** with sanitized failure messages.

### Task 5: `/interno` user flow

**Files:**
- Modify: `app/interno/page.tsx`
- Modify: `app/interno/taskTemplates.ts`

**Interfaces:**
- Consumes: same-origin project and bulk issue routes.
- Produces: a reviewable task list with resolved responsible person and due date.

- [ ] **Step 1: Replace n8n project/task webhook constants** with same-origin API paths.
- [ ] **Step 2: Add a required Felipe/Jacqueline executor selection** and apply it only to operational tasks.
- [ ] **Step 3: Generate due dates from the project creation date** and show an editable date input per selected task.
- [ ] **Step 4: Keep Fernando/Herbert assignments fixed by default** while preserving explicit task selection and title editing.
- [ ] **Step 5: Display project and bulk issue API errors** without exposing server details.

### Task 6: Verification and deployment notes

**Files:**
- Create: `.env.example`
- Modify: `docs/superpowers/plans/2026-08-10-jira-direct-integration.md`

**Interfaces:**
- Consumes: completed implementation.
- Produces: repeatable local verification and required environment documentation.

- [ ] **Step 1: Run `npm test`** and require a clean pass.
- [ ] **Step 2: Run `npx tsc --noEmit`** and require no TypeScript errors.
- [ ] **Step 3: Run `npm run build`** and require a successful production build.
- [ ] **Step 4: Review `git diff`** to confirm no secret values or unrelated edits were introduced.
- [ ] **Step 5: Record the live-test limitation**: no Jira project is created during automated verification because that would mutate production data.

