import type { MessageKey, TFunction } from "../../../shared/i18n/i18n";

/**
 * Natsu's built-in slash commands carry their English description on the
 * command object (it is also what tests and the model see). The UI looks the
 * translated text up here by invocation.
 */
const BUILTIN_DESCRIPTION_KEYS: Record<string, MessageKey> = {
  compact: "sessions.compact.description",
  btw: "sessions.btw.description",
  draft: "sessions.draftCommand.description",
  mcp: "skills.builtin.mcp",
  operator: "skills.builtin.operator",
  orchestrator: "skills.builtin.orchestrator",
  plan: "skills.builtin.plan",
  "add-to-folder": "skills.builtin.addToFolder",
};

/** The description to show for a command: translated for built-ins. */
export function commandDescription(
  command: { kind?: string; invocation: string; description: string },
  t: TFunction,
): string {
  const key =
    command.kind === "builtin"
      ? BUILTIN_DESCRIPTION_KEYS[command.invocation]
      : undefined;
  return key ? t(key) : command.description;
}
