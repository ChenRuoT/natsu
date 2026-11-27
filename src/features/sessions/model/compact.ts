import type { BuiltinSkill } from "../../skills/model/skills";
import type { MessageKey } from "../../../shared/i18n/i18n";

/** Translate with `t` when showing this command in a picker. */
export const COMPACT_DESCRIPTION_KEY: MessageKey =
  "sessions.compact.description";

export const COMPACT_COMMAND: BuiltinSkill = {
  kind: "builtin",
  name: "compact",
  invocation: "compact",
  description: "Summarize older conversation context to free space.",
  scope: "builtin",
  source: "natsu",
};

/** Match the standalone composer command without consuming ordinary prompt text. */
export function isCompactCommand(text: string): boolean {
  return /^\s*\/compact\s*$/i.test(text);
}
