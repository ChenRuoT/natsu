import { useCallback, useSyncExternalStore } from "react";
import { en, type MessageKey } from "./messages/en";
import { zhCN } from "./messages/zh-CN";

export type { MessageKey };
export type Locale = "en" | "zh-CN";
export type MessageParams = Record<string, string | number>;
export type TFunction = (key: MessageKey, params?: MessageParams) => string;

export const LOCALE_STORAGE_KEY = "natsu.language";
/** Fired on `window` after the language changes (detail: the new locale). */
export const LOCALE_CHANGE_EVENT = "natsu:languagechange";

/** Labels are endonyms on purpose: they must stay readable in any language. */
export const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh-CN", label: "简体中文" },
];

const CATALOGS: Record<Locale, Partial<Record<MessageKey, string>>> = {
  en,
  "zh-CN": zhCN,
};

export function isLocale(value: unknown): value is Locale {
  return LOCALE_OPTIONS.some((option) => option.value === value);
}

/** Maps a BCP 47 tag such as `zh-Hans-CN` or `en-GB` onto a supported locale. */
export function matchLocale(tag: string | null | undefined): Locale {
  return tag?.toLowerCase().startsWith("zh") ? "zh-CN" : "en";
}

function detectLocale(): Locale {
  return matchLocale(
    typeof navigator === "undefined" ? null : navigator.language,
  );
}

function readStoredLocale(): Locale | null {
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

// Holds the choice only while storage failed to keep it, so the switch still
// works for this window when localStorage is unavailable.
let unsaved: Locale | null = null;

export function getLocale(): Locale {
  return unsaved ?? readStoredLocale() ?? detectLocale();
}

export function setLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // private mode / quota
  }
  unsaved = readStoredLocale() === locale ? null : locale;
  applyDocumentLanguage(locale);
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<Locale>(LOCALE_CHANGE_EVENT, { detail: locale }),
  );
}

function applyDocumentLanguage(locale: Locale) {
  if (typeof document !== "undefined") document.documentElement.lang = locale;
}

/** Syncs `<html lang>` at boot and when another window changes the language. */
export function initI18n() {
  applyDocumentLanguage(getLocale());
  if (typeof window === "undefined") return;
  window.addEventListener("storage", (event) => {
    if (event.key !== LOCALE_STORAGE_KEY && event.key !== null) return;
    unsaved = null;
    applyDocumentLanguage(getLocale());
  });
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_STORAGE_KEY || event.key === null) onStoreChange();
  };
  window.addEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function translate(
  locale: Locale,
  key: MessageKey,
  params?: MessageParams,
): string {
  const template = CATALOGS[locale][key] ?? en[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/** For code outside React; components should use `useT` so they re-render. */
export function t(key: MessageKey, params?: MessageParams): string {
  return translate(getLocale(), key, params);
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getLocale, () => "en");
}

export function useT(): TFunction {
  const locale = useLocale();
  return useCallback<TFunction>(
    (key, params) => translate(locale, key, params),
    [locale],
  );
}
