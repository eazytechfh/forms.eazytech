import { resolveTaskRule, type JiraTaskTemplateName } from "./task-rules.ts"

export type Executor = "felipe" | "jacqueline"
export type JiraAccountKey = "fernando" | "herbert" | Executor
export type JiraAccountIds = Record<JiraAccountKey, string>

export type BulkTaskInput = {
  title: string
  description: string
  dueDate: string
  assigneeKey?: JiraAccountKey
}

type BulkIssuePayloadInput = {
  projectId: string
  issueTypeId: string
  template: JiraTaskTemplateName
  executor: Executor
  accountIds: JiraAccountIds
  tasks: BulkTaskInput[]
}

function textToAdf(text: string) {
  return {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: text ? [{ type: "text", text }] : [],
      },
    ],
  }
}

export function buildBulkIssuePayload(input: BulkIssuePayloadInput) {
  return {
    issueUpdates: input.tasks.map((task) => {
      const rule = resolveTaskRule(task.title, input.template)
      const assigneeKey = task.assigneeKey ?? (rule.assignee === "executor" ? input.executor : rule.assignee)

      return {
        fields: {
          project: { id: input.projectId },
          issuetype: { id: input.issueTypeId },
          summary: task.title.trim(),
          description: textToAdf(task.description.trim()),
          duedate: task.dueDate,
          assignee: { accountId: input.accountIds[assigneeKey] },
        },
      }
    }),
  }
}
