import { invoke, isTauri } from "@tauri-apps/api/core";
import {
  LOCALE_CHANGE_EVENT,
  LOCALE_STORAGE_KEY,
  getLocale,
} from "../../shared/i18n/i18n";
import { IS_MAC, IS_WIN } from "./platform";

/**
 * The webview owns the language setting, but some text lives in native menus
 * the backend builds: the Windows tray menu and the macOS menu bar. Reports
 * the language once at boot and again whenever it changes, here or in another
 * window. Linux has no native menu text, so there is nothing to tell.
 */
export function syncNativeLanguage(): void {
  if (!isTauri()) return;
  const command = IS_WIN
    ? "tray_set_language"
    : IS_MAC
      ? "menu_set_language"
      : null;
  if (!command) return;
  const send = () => {
    void invoke(command, { language: getLocale() }).catch(() => {});
  };
  send();
  window.addEventListener(LOCALE_CHANGE_EVENT, send);
  window.addEventListener("storage", (event) => {
    if (event.key === LOCALE_STORAGE_KEY || event.key === null) send();
  });
}
