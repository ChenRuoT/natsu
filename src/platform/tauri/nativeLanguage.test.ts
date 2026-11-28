// @vitest-environment happy-dom
import { invoke, isTauri } from "@tauri-apps/api/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLocale } from "../../shared/i18n/i18n";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(async () => undefined),
  isTauri: vi.fn(),
}));

beforeEach(() => {
  vi.resetModules();
  vi.mocked(invoke).mockClear();
  vi.stubGlobal("navigator", { platform: "Win32", language: "en-US" });
});

afterEach(() => {
  setLocale("en");
  vi.unstubAllGlobals();
});

async function load() {
  return (await import("./nativeLanguage")).syncNativeLanguage;
}

describe("syncNativeLanguage", () => {
  it("reports the language at boot and on every change", async () => {
    vi.mocked(isTauri).mockReturnValue(true);
    const { setLocale: set } = await import("../../shared/i18n/i18n");
    (await load())();
    expect(invoke).toHaveBeenLastCalledWith("tray_set_language", {
      language: "en",
    });
    set("zh-CN");
    expect(invoke).toHaveBeenLastCalledWith("tray_set_language", {
      language: "zh-CN",
    });
    expect(invoke).toHaveBeenCalledTimes(2);
  });

  it("does nothing outside the Tauri app", async () => {
    vi.mocked(isTauri).mockReturnValue(false);
    (await load())();
    expect(invoke).not.toHaveBeenCalled();
  });

  it("updates the menu bar on macOS", async () => {
    vi.mocked(isTauri).mockReturnValue(true);
    vi.stubGlobal("navigator", { platform: "MacIntel", language: "en-US" });
    (await load())();
    expect(invoke).toHaveBeenLastCalledWith("menu_set_language", {
      language: "en",
    });
  });

  it("does nothing on Linux, which has no native menu text", async () => {
    vi.mocked(isTauri).mockReturnValue(true);
    vi.stubGlobal("navigator", { platform: "Linux x86_64", language: "en-US" });
    (await load())();
    expect(invoke).not.toHaveBeenCalled();
  });
});
