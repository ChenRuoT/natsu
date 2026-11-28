import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getLocale,
  matchLocale,
  setLanguagePreferenceState,
  t,
  translate,
} from "../src/i18n/i18n";
import { en, enAreas } from "../src/i18n/messages/en";
import { zhCN, zhCNAreas } from "../src/i18n/messages/zh-CN";

afterEach(() => {
  setLanguagePreferenceState("system");
  vi.restoreAllMocks();
});

describe("mobile i18n", () => {
  it("maps language tags onto supported locales", () => {
    expect(matchLocale("zh-Hans-CN")).toBe("zh-CN");
    expect(matchLocale("en-GB")).toBe("en");
    expect(matchLocale("fr")).toBe("en");
    expect(matchLocale(undefined)).toBe("en");
  });

  it("follows the phone until a language is chosen", () => {
    expect(getLocale()).toBe("en");
    vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
      locale: "zh-CN",
    } as Intl.ResolvedDateTimeFormatOptions);
    expect(getLocale()).toBe("zh-CN");
    setLanguagePreferenceState("en");
    expect(getLocale()).toBe("en");
  });

  it("translates, interpolates and falls back to English", () => {
    setLanguagePreferenceState("zh-CN");
    expect(t("settings.language.heading")).toBe("语言");
    expect(translate("en", "settings.language.heading")).toBe("Language");
  });

  it("defines each key in exactly one area", () => {
    const total = Object.values(enAreas as Record<string, object>).reduce(
      (sum, area) => sum + Object.keys(area).length,
      0,
    );
    expect(Object.keys(en)).toHaveLength(total);
    expect(Object.keys(zhCNAreas)).toHaveLength(Object.keys(enAreas).length);
  });

  it("ships a zh-CN translation with the same placeholders for every key", () => {
    const names = (text: string) =>
      [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
    expect(Object.keys(zhCN).sort()).toEqual(Object.keys(en).sort());
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(zhCN[key].trim(), key).not.toBe("");
      expect(names(zhCN[key]), key).toEqual(names(en[key]));
    }
  });

  it("has no message that no source file references", () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) return entry.name === "messages" ? [] : walk(path);
        return /\.tsx?$/.test(entry.name) ? [path] : [];
      });
    // Relative to this file, so it holds whichever directory vitest runs from.
    const source = walk(join(__dirname, "../src"))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    const unused = (Object.keys(en) as (keyof typeof en)[]).filter(
      (key) => !source.includes(`"${key}"`),
    );
    expect(unused).toEqual([]);
  });
});
