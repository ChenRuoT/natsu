import type { Block } from "./session";
import {
  t as tNow,
  type MessageKey,
  type TFunction,
} from "../../../shared/i18n/i18n";

export type NatsuToolCall = {
  action: string;
  /** Translated when parsed, so it reads in the language active at that time. */
  label: string;
  command: string;
};

const ACTION_LABELS: Record<string, MessageKey> = {
  "models.list": "sessions.natsuToolCall.modelsList",
  "sessions.list": "sessions.natsuToolCall.sessionsList",
  "sessions.read": "sessions.natsuToolCall.sessionsRead",
  "sessions.send": "sessions.natsuToolCall.sessionsSend",
  "sessions.draft": "sessions.natsuToolCall.sessionsDraft",
  "sessions.start": "sessions.natsuToolCall.sessionsStart",
  "sessions.stop": "sessions.natsuToolCall.sessionsStop",
  "sessions.archive": "sessions.natsuToolCall.sessionsArchive",
  "sessions.delete": "sessions.natsuToolCall.sessionsDelete",
  "folders.list": "sessions.natsuToolCall.foldersList",
  "folders.move": "sessions.natsuToolCall.foldersMove",
  "notes.list": "sessions.natsuToolCall.notesList",
  "notes.read": "sessions.natsuToolCall.notesRead",
  "notes.write": "sessions.natsuToolCall.notesWrite",
  "artifacts.list": "sessions.natsuToolCall.artifactsList",
  "artifacts.read": "sessions.natsuToolCall.artifactsRead",
  "artifacts.write": "sessions.natsuToolCall.artifactsWrite",
};

/** Conservatively parse one shell invocation; compound commands use the shell row. */
function shellWords(command: string): string[] | undefined {
  const words: string[] = [];
  let word = "";
  let started = false;
  let quote: "'" | '"' | null = null;
  for (let index = 0; index < command.length; index += 1) {
    const char = command[index];
    if (quote === "'") {
      if (char === "'") quote = null;
      else word += char;
      continue;
    }
    if (char === "'" && !quote) {
      quote = "'";
      started = true;
      continue;
    }
    if (char === '"') {
      quote = quote === '"' ? null : '"';
      started = true;
      continue;
    }
    if (char === "\\") {
      const next = command[index + 1];
      if (!next) return undefined;
      // Preserve ordinary path separators, including quoted Windows paths.
      if (
        (quote === '"' && !/[\\"$`]/.test(next)) ||
        (!quote && !/[\s'"\\;&|<>()[\]{}$`#]/.test(next))
      ) {
        word += char;
      } else {
        word += next;
        index += 1;
      }
      started = true;
      continue;
    }
    if (char === "$" || char === "`") return undefined;
    if (!quote && /[\r\n;&|<>()[\]{}#]/.test(char)) return undefined;
    if (!quote && /\s/.test(char)) {
      if (started) words.push(word);
      word = "";
      started = false;
      continue;
    }
    word += char;
    started = true;
  }
  if (quote) return undefined;
  if (started) words.push(word);
  return words;
}

/** Recognize the actual app CLI command, not a mention of it in prose/output. */
export function natsuToolCall(block: Block): NatsuToolCall | undefined {
  if (block.role !== "tool" && block.role !== "approval") return undefined;
  // A shell preview retains the original command when the display title was
  // simplified. Never accept a shorter title in place of that command.
  const candidate =
    (block.tool?.preview?.kind === "shell"
      ? block.tool.preview.title
      : undefined) ??
    block.tool?.title ??
    block.text;
  const command = candidate?.trim().replace(/^Run(?:ning)?\s+command:\s*/i, "");
  if (!command) return undefined;
  const words = shellWords(command);
  if (!words || !/(?:^|[/\\])natsu(?:\.exe)?$/i.test(words[0] ?? ""))
    return undefined;
  if (words[1] !== "app") return undefined;
  const action = words[2] ?? "--help";
  if (action === "--help" || action === "help" || action === "-h") {
    return words.length > 3
      ? undefined
      : {
          action: "--help",
          label: tNow("sessions.natsuToolCall.viewCli"),
          command,
        };
  }
  if (!Object.prototype.hasOwnProperty.call(ACTION_LABELS, action))
    return undefined;
  for (let index = 3; index < words.length; index += 2) {
    if (
      !["--json", "--input", "--request-id"].includes(words[index]) ||
      !words[index + 1]
    )
      return undefined;
  }
  return { action, label: tNow(ACTION_LABELS[action]), command };
}

/** A group of only Natsu calls can be named for the app, not the shell. */
export function natsuWorkSummary(
  steps: Block[],
  live: boolean,
  t: TFunction = tNow,
): string | undefined {
  if (steps.some((block) => block.interjection || block.role === "system")) {
    return undefined;
  }
  const calls = steps.filter(
    (block) => block.role === "tool" || block.role === "approval",
  );
  if (calls.length === 0 || calls.some((block) => !natsuToolCall(block))) {
    return undefined;
  }
  return live
    ? t("sessions.natsuToolCall.using")
    : t("sessions.natsuToolCall.used");
}
