import { isReadTool } from "../../../integrations/harness/core/preview";
import type { Block } from "./session";
import {
  t as tNow,
  type MessageKey,
  type TFunction,
} from "../../../shared/i18n/i18n";
import {
  isProseBlock,
  isThinkingBlock,
  isToolBlock,
  needsApproval,
  subagentFailureSummary,
  toolCategory,
  workKind,
  workSummaryLine,
  type ActivityPhaseKind,
} from "./transcriptActivity";

const THINKING_LABELS: MessageKey[] = [
  "sessions.monoWorkStatus.thinking",
  "sessions.monoWorkStatus.pondering",
  "sessions.monoWorkStatus.considering",
  "sessions.monoWorkStatus.workingThrough",
];

export type MonoWorkStatus = {
  key: string;
  label: string;
  kind: ActivityPhaseKind;
  active: boolean;
};

/** A short status for the latest activity, stable across its streamed chunks. */
export function monoWorkStatus(
  blocks: Block[],
  active: boolean,
  t: TFunction = tNow,
): MonoWorkStatus {
  if (!active) {
    return {
      key: "summary",
      label: subagentFailureSummary(blocks) ?? workSummaryLine(blocks),
      kind: workKind(blocks),
      active: false,
    };
  }
  const waiting = blocks.find(needsApproval);
  if (waiting) {
    return {
      key: `approval:${waiting.id}`,
      label: t("sessions.monoWorkStatus.waitingApproval"),
      kind: toolCategory(waiting),
      active: true,
    };
  }
  let thought = -1;
  let latest: Block | undefined;
  for (const block of blocks) {
    if (isProseBlock(block) || isThinkingBlock(block)) {
      thought += 1;
      latest = block;
    } else if (isToolBlock(block)) {
      latest = block;
    }
  }
  if (!latest || !isToolBlock(latest)) {
    return {
      key: latest?.id ?? "thinking",
      label: t(THINKING_LABELS[Math.max(0, thought) % THINKING_LABELS.length]),
      kind: "think",
      active: true,
    };
  }
  const kind = toolCategory(latest);
  const label = t(
    {
      run: "sessions.monoWorkStatus.runningCommand",
      edit: "sessions.monoWorkStatus.editingFile",
      research: isReadTool(
        latest.tool?.kind,
        latest.text || latest.tool?.title,
        latest.tool?.preview,
      )
        ? "sessions.monoWorkStatus.readingFile"
        : "sessions.monoWorkStatus.exploringProject",
      agent: "sessions.monoWorkStatus.runningAgent",
      other: "sessions.monoWorkStatus.usingTool",
    }[kind] as MessageKey,
  );
  return { key: latest.id, label, kind, active: true };
}
