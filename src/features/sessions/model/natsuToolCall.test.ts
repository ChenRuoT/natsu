import { describe, expect, it } from "vitest";
import type { Block } from "./session";
import { natsuToolCall, natsuWorkSummary } from "./natsuToolCall";

function shell(text: string): Block {
  return { id: text, role: "tool", text, tool: { kind: "shell" } };
}

describe("Natsu CLI tool calls", () => {
  it("recognizes app actions with absolute, quoted, or bare executables", () => {
    expect(
      natsuToolCall(
        shell(
          "/repo/target/debug/Natsu.app/Contents/MacOS/natsu app notes.list --json '{}'",
        ),
      )?.label,
    ).toBe("List notes");
    expect(
      natsuToolCall(
        shell(
          "'/Applications/Natsu App/natsu' app folders.move --input -",
        ),
      )?.label,
    ).toBe("Move a session");
    expect(
      natsuToolCall(
        shell('"C:\\Program Files\\Natsu\\natsu.exe" app notes.list'),
      )?.label,
    ).toBe("List notes");
    expect(natsuToolCall(shell("natsu app --help"))?.label).toBe(
      "View CLI commands",
    );
    expect(
      natsuToolCall(shell("natsu app sessions.read --json '{}'"))?.label,
    ).toBe("Read a session");
    expect(
      natsuToolCall(shell("natsu app sessions.send --json '{}'"))?.label,
    ).toBe("Continue a session");
    expect(
      natsuToolCall(shell("natsu app sessions.draft --json '{}'"))?.label,
    ).toBe("Save a draft");
    for (const [action, label] of [
      ["sessions.stop", "Stop a session"],
      ["sessions.archive", "Archive a session"],
      ["sessions.delete", "Delete a session"],
    ]) {
      expect(
        natsuToolCall(shell(`natsu app ${action} --json '{}'`))?.label,
      ).toBe(label);
    }
    expect(
      natsuToolCall(shell("natsu app notes.write --input -"))?.label,
    ).toBe("Write a note");
    expect(
      natsuToolCall({
        id: "generic",
        role: "tool",
        text: "Run command:",
        tool: { kind: "other", title: "natsu app sessions.start" },
      })?.label,
    ).toBe("Start a session");
    expect(
      natsuToolCall({
        id: "codex-action",
        role: "tool",
        text: "List",
        tool: {
          kind: "execute",
          preview: { kind: "shell", title: "natsu app notes.list" },
        },
      })?.label,
    ).toBe("List notes");
  });

  it("does not restyle unrelated commands or text mentioning the CLI", () => {
    expect(
      natsuToolCall(shell("echo natsu app notes.list")),
    ).toBeUndefined();
    expect(natsuToolCall(shell("natsu control list"))).toBeUndefined();
    expect(
      natsuToolCall({
        id: "prose",
        role: "assistant",
        text: "natsu app notes.list",
      }),
    ).toBeUndefined();
  });

  it("does not compact compound shell commands or hide a longer shell preview", () => {
    for (const command of [
      "natsu app notes.list && echo extra",
      "natsu app notes.list; echo extra",
      "natsu app notes.list | cat",
      "natsu app notes.list\necho extra",
      "natsu app notes.list --json \"$(echo extra)\"",
    ]) {
      expect(natsuToolCall(shell(command))).toBeUndefined();
    }
    expect(
      natsuToolCall({
        id: "short-title",
        role: "tool",
        text: "natsu app notes.list",
        tool: {
          kind: "shell",
          title: "natsu app notes.list",
          preview: {
            kind: "shell",
            title: "natsu app notes.list && echo extra",
          },
        },
      }),
    ).toBeUndefined();
    expect(
      natsuToolCall(
        shell("natsu app sessions.send --json '{\"prompt\":\"a; b\"}'"),
      )?.command,
    ).toBe("natsu app sessions.send --json '{\"prompt\":\"a; b\"}'");
  });

  it("names a group only when all its tool calls use Natsu", () => {
    const calls = [
      shell("natsu app --help"),
      shell("natsu app notes.list"),
    ];
    expect(natsuWorkSummary(calls, true)).toBe("Using Natsu");
    expect(natsuWorkSummary(calls, false)).toBe("Used Natsu");
    expect(
      natsuWorkSummary([...calls, shell("git status")], true),
    ).toBeUndefined();
  });
});
