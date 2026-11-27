import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { translate } from "../../../shared/i18n/i18n";
import { settingText } from "./models";
import {
  WORKSPACE_THEMES,
  workspaceThemeLabel,
} from "../../settings/model/workspaceThemes";

const zh = (key: Parameters<typeof translate>[1]) => translate("zh-CN", key);
const en = (key: Parameters<typeof translate>[1]) => translate("en", key);

/**
 * Names that stay as written: provider and product terms (Ultracode, Agent, the
 * Devin roles, tool verbs), and OpenCode's boolean form options, whose label is
 * also the answer sent back to OpenCode, so it is data, not interface text.
 */
const KEPT_AS_WRITTEN = new Set([
  "Yes",
  "No",
  "Ultracode",
  "Ultrathink",
  "Agent",
  "Lead",
  "Sidekick",
  "Pi",
  "Read",
  "High Effort",
]);

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sources(path);
    return /\.ts$/.test(entry.name) && !/\.test\.ts$/.test(entry.name)
      ? [path]
      : [];
  });
}

describe("model setting and option labels", () => {
  it("translates every effort level a provider can offer", () => {
    for (const label of [
      "None",
      "Minimal",
      "Low",
      "Medium",
      "High",
      "Extra High",
      "Max",
      "Off",
      "On",
      "Standard",
      "Default",
      "Auto",
    ]) {
      expect(settingText(label, en), label).toBe(label);
      expect(settingText(label, zh), label).not.toBe(label);
    }
  });

  it('covers every `label: "…"` the provider adapters declare, or names it as kept', () => {
    const root = fileURLToPath(new URL("../../..", import.meta.url));
    const files = [
      ...sources(join(root, "integrations")),
      join(root, "features/connections/model/remoteModels.ts"),
      join(root, "features/sessions/model/models.ts"),
    ];
    const untranslated = new Set<string>();
    for (const file of files) {
      for (const match of readFileSync(file, "utf8").matchAll(
        /\blabel: "([A-Z][A-Za-z ]+)"/g,
      )) {
        const label = match[1];
        if (KEPT_AS_WRITTEN.has(label)) continue;
        if (settingText(label, zh) === label) untranslated.add(label);
      }
    }
    expect([...untranslated]).toEqual([]);
  });
});

describe("workspace theme names", () => {
  it("translates every theme", () => {
    for (const theme of WORKSPACE_THEMES) {
      expect(workspaceThemeLabel(theme, en), theme.id).toBe(theme.label);
      expect(workspaceThemeLabel(theme, zh), theme.id).not.toBe(theme.label);
    }
  });
});
