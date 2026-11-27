import { t as tNow, type TFunction } from "@/i18n/i18n";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Compact age label for list rows: "now", "5m", "3h", "2d".
export function relativeTime(timestamp: number, now = Date.now(), t: TFunction = tNow) {
  const elapsed = Math.max(0, now - timestamp);
  if (elapsed < MINUTE) return t("workspace.relativeTime.now");
  if (elapsed < HOUR)
    return t("workspace.relativeTime.minutes", { count: Math.floor(elapsed / MINUTE) });
  if (elapsed < DAY)
    return t("workspace.relativeTime.hours", { count: Math.floor(elapsed / HOUR) });
  return t("workspace.relativeTime.days", { count: Math.floor(elapsed / DAY) });
}

// Messages-style label for a conversation's last activity: the time today, then
// "Yesterday", the weekday within the past week, and the date after that.
export function chatTime(timestamp: number, now = Date.now(), t: TFunction = tNow) {
  const date = new Date(timestamp);
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  if (timestamp >= startOfToday) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  if (timestamp >= startOfToday - DAY) return t("workspace.relativeTime.yesterday");
  if (timestamp >= startOfToday - 6 * DAY) {
    return date.toLocaleDateString(undefined, { weekday: "long" });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
