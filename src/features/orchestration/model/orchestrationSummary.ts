import type { OrchestrationRun, TaskStatus } from "./orchestration";
import { sessionNeedsInput, type HarnessId, type Session } from "../../sessions/model/session";
import { t as tNow, type MessageKey, type TFunction } from "../../../shared/i18n/i18n";

/** Small history projection; never includes prompts, results or credentials. */
export type OrchestrationSummary = {
  status: OrchestrationRun["status"];
  live?: boolean;
  tasks: {
    sessionId: string;
    title: string;
    harness: HarnessId;
    model: string;
    status: TaskStatus;
    needsInput?: boolean;
  }[];
};

export function summarizeOrchestration(
  run: OrchestrationRun,
  sessions: readonly Session[],
): OrchestrationSummary {
  const byId = new Map(sessions.map((session) => [session.id, session]));
  return {
    status: run.status,
    live: true,
    tasks: run.tasks.map(({ sessionId, title, harness, model, status }) => ({
      sessionId,
      title,
      harness,
      model,
      status,
      needsInput:
        !!byId.get(sessionId) && sessionNeedsInput(byId.get(sessionId)!),
    })),
  };
}

const TASK_STATUS_KEYS = {
  queued: "orchestration.summary.queued",
  running: "orchestration.summary.working",
  cancelling: "orchestration.summary.stopping",
  completed: "orchestration.summary.done",
  failed: "orchestration.summary.failed",
  blocked: "orchestration.summary.needsReview",
  interrupted: "orchestration.summary.interrupted",
  cancelled: "orchestration.summary.cancelled",
} as const satisfies Record<TaskStatus, MessageKey>;

export function orchestrationTaskLabel(
  task: OrchestrationSummary["tasks"][number],
  summary: OrchestrationSummary,
  t: TFunction = tNow,
): string {
  if (task.needsInput) return t("orchestration.summary.needsInput");
  if (
    !summary.live &&
    ["running", "cancelling", "queued"].includes(task.status)
  )
    return t("orchestration.summary.saved");
  if (summary.status === "paused" && task.status === "queued")
    return t("orchestration.summary.paused");
  return t(TASK_STATUS_KEYS[task.status]);
}
