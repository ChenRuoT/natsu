import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { en } from "./messages/en";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name === "messages" || entry.name === "node_modules"
        ? []
        : sourceFiles(path);
    }
    return /\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [path]
      : [];
  });
}

describe("message catalog usage", () => {
  it("has no message that no source file references", () => {
    const source = sourceFiles(fileURLToPath(new URL("../..", import.meta.url)))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    // A key missing here usually means an edit was lost or a string was
    // extracted but never wired up. Keys must appear as string literals.
    const unused = (Object.keys(en) as (keyof typeof en)[]).filter(
      (key) => !source.includes(`"${key}"`),
    );
    expect(unused).toEqual([]);
  });
});
