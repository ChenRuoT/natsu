import { describe, expect, it } from "vitest";
import { translate } from "../../../shared/i18n/i18n";
import { BTW_COMMAND } from "../../sessions/model/btw";
import { COMPACT_COMMAND } from "../../sessions/model/compact";
import { DRAFT_COMMAND } from "../../sessions/model/draftCommand";
import { MCP_COMMAND } from "../../sessions/model/mcpCommand";
import { OPERATOR_COMMAND } from "../../sessions/model/operatorCommand";
import { ORCHESTRATOR_COMMAND } from "../../sessions/model/orchestratorCommand";
import { PLAN_COMMAND } from "../../sessions/model/plan";
import { SESSION_FOLDER_COMMAND } from "../../sessions/model/sessionFolderCommand";
import { commandDescription } from "./builtinText";

const COMMANDS = [
  BTW_COMMAND,
  COMPACT_COMMAND,
  DRAFT_COMMAND,
  MCP_COMMAND,
  OPERATOR_COMMAND,
  ORCHESTRATOR_COMMAND,
  PLAN_COMMAND,
  SESSION_FOLDER_COMMAND,
];

const en = (key: Parameters<typeof translate>[1]) => translate("en", key);
const zh = (key: Parameters<typeof translate>[1]) => translate("zh-CN", key);

describe("commandDescription", () => {
  it("keeps the English catalog text identical to each built-in's description", () => {
    for (const command of COMMANDS) {
      expect(commandDescription(command, en), command.invocation).toBe(
        command.description,
      );
    }
  });

  it("translates every built-in command", () => {
    for (const command of COMMANDS) {
      const text = commandDescription(command, zh);
      expect(text, command.invocation).not.toBe(command.description);
      expect(text, command.invocation).toMatch(/[一-鿿]/);
    }
  });

  it("leaves user and project skills alone", () => {
    const skill = {
      kind: "file",
      invocation: "plan",
      description: "My own plan skill",
    };
    expect(commandDescription(skill, zh)).toBe("My own plan skill");
  });
});
