// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  LOCALE_STORAGE_KEY,
  getLocale,
  matchLocale,
  setLocale,
  t,
  translate,
} from "./i18n";
import { en, enAreas } from "./messages/en";
import { zhCN, zhCNAreas } from "./messages/zh-CN";

afterEach(() => {
  localStorage.clear();
  setLocale("en");
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("i18n", () => {
  it("maps browser language tags onto supported locales", () => {
    expect(matchLocale("zh-CN")).toBe("zh-CN");
    expect(matchLocale("zh-Hans-CN")).toBe("zh-CN");
    expect(matchLocale("ZH-TW")).toBe("zh-CN");
    expect(matchLocale("en-GB")).toBe("en");
    expect(matchLocale("fr")).toBe("en");
    expect(matchLocale(undefined)).toBe("en");
  });

  it("falls back to the system language until a choice is saved", () => {
    vi.stubGlobal("navigator", { language: "zh-CN" });
    expect(getLocale()).toBe("zh-CN");
    localStorage.setItem(LOCALE_STORAGE_KEY, "en");
    expect(getLocale()).toBe("en");
  });

  it("ignores an unknown stored value", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "klingon");
    expect(getLocale()).toBe("en");
  });

  it("persists the choice and updates <html lang>", () => {
    setLocale("zh-CN");
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("zh-CN");
    expect(document.documentElement.lang).toBe("zh-CN");
    expect(t("settings.theme.dark")).toBe("深色");
  });

  it("notifies listeners when the language changes", () => {
    const listener = vi.fn();
    window.addEventListener("natsu:languagechange", listener);
    setLocale("zh-CN");
    window.removeEventListener("natsu:languagechange", listener);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps working when storage rejects writes", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    setLocale("zh-CN");
    expect(getLocale()).toBe("zh-CN");
    vi.restoreAllMocks();
  });

  it("interpolates placeholders and leaves unknown ones intact", () => {
    // Placeholder handling is exercised through `translate` with a synthetic
    // catalog entry, since the shipped messages have none yet.
    const key = "settings.language.title" as const;
    const original = en[key];
    (en as Record<string, string>)[key] = "Hello {name} {missing}";
    try {
      expect(translate("en", key, { name: "Natsu" })).toBe(
        "Hello Natsu {missing}",
      );
    } finally {
      (en as Record<string, string>)[key] = original;
    }
  });

  it("defines each key in exactly one area", () => {
    const total = Object.values(enAreas).reduce(
      (sum, area) => sum + Object.keys(area).length,
      0,
    );
    expect(Object.keys(en)).toHaveLength(total);
    expect(Object.keys(zhCNAreas)).toHaveLength(Object.keys(enAreas).length);
  });

  it("keeps placeholders identical across languages", () => {
    const names = (text: string) =>
      [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(names(zhCN[key]), key).toEqual(names(en[key]));
    }
  });

  it("ships a zh-CN translation for every English key", () => {
    expect(Object.keys(zhCN).sort()).toEqual(Object.keys(en).sort());
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(zhCN[key].trim()).not.toBe("");
    }
  });
});
