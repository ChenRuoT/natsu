import { useCallback, useSyncExternalStore } from "react";
import { en, type MessageKey } from "./messages/en";
import { zhCN } from "./messages/zh-CN";

export type { MessageKey };
export type Locale = "en" | "zh-CN";
/** What the user picked: a language, or whichever the phone is set to. */
export type LanguagePreference = "system" | Locale;
export type MessageParams = Record<string, string | number>;
export type TFunction = (key: MessageKey, params?: MessageParams) => string;

/** Labels are endonyms on purpose: they must stay readable in any language. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  "zh-CN": "简体中文",
};

const CATALOGS: Record<Locale, Partial<Record<MessageKey, string>>> = {
  en,
  "zh-CN": zhCN,
};

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh-CN";
}

export function isLanguagePreference(
  value: unknown,
): value is LanguagePreference {
  return value === "system" || isLocale(value);
}

/** Maps a BCP 47 tag such as `zh-Hans-CN` or `en-GB` onto a supported locale. */
export function matchLocale(tag: string | null | undefined): Locale {
  return tag?.toLowerCase().startsWith("zh") ? "zh-CN" : "en";
}

function systemLocale(): Locale {
  try {
    return matchLocale(Intl.DateTimeFormat().resolvedOptions().locale);
  } catch {
    return "en";
  }
}

// The preference lives here so every screen sees a change made on another.
// Persisting it is `features/settings/language.ts`'s job, which keeps this
// module free of native storage and easy to test.
let preference: LanguagePreference = "system";
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function getLanguagePreference(): LanguagePreference {
  return preference;
}

export function setLanguagePreferenceState(next: LanguagePreference) {
  if (next === preference) return;
  preference = next;
  listeners.forEach((listener) => listener());
}

export function getLocale(): Locale {
  return preference === "system" ? systemLocale() : preference;
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

export function useLanguagePreferenceState(): LanguagePreference {
  return useSyncExternalStore(subscribe, getLanguagePreference, () => "system");
}

export function useT(): TFunction {
  const locale = useLocale();
  return useCallback<TFunction>(
    (key, params) => translate(locale, key, params),
    [locale],
  );
}
