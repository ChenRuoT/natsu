import Storage from "expo-sqlite/kv-store";

import {
  isLanguagePreference,
  setLanguagePreferenceState,
  useLanguagePreferenceState,
  type LanguagePreference,
} from "@/i18n/i18n";

const STORAGE_KEY = "language";

function load(): LanguagePreference {
  try {
    const stored = Storage.getItemSync(STORAGE_KEY);
    return isLanguagePreference(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

/** Applies the saved language; called once, before the app first draws. */
export function applySavedLanguage() {
  setLanguagePreferenceState(load());
}

/** The language set on this phone, and a setter that saves and applies it. */
export function useLanguagePreference() {
  const preference = useLanguagePreferenceState();
  const set = (next: LanguagePreference) => {
    setLanguagePreferenceState(next);
    void Storage.setItem(STORAGE_KEY, next);
  };
  return [preference, set] as const;
}
