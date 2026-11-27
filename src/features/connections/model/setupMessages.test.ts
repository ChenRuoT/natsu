import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { translate } from "../../../shared/i18n/i18n";
import { setupMessage } from "./setupMessages";

const en = (key: Parameters<typeof translate>[1]) => translate("en", key);
const zh = (key: Parameters<typeof translate>[1]) => translate("zh-CN", key);

describe("setupMessage", () => {
  it("translates every progress line the backend can send", () => {
    const rust = ["src-tauri/src/remote.rs", "src-tauri/src/remote_ssh.rs"]
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    const sent = [...rust.matchAll(/job\.message\("([^"]+)"\)/g)].map(
      (match) => match[1],
    );
    expect(sent.length).toBeGreaterThan(4);
    for (const message of sent) {
      expect(setupMessage(message, en), message).toBe(message);
      expect(setupMessage(message, zh), message).not.toBe(message);
    }
  });

  it("passes unknown text, such as an SSH prompt, through", () => {
    expect(setupMessage("Enter passphrase for key", zh)).toBe(
      "Enter passphrase for key",
    );
  });
});
