import { t as tNow, type TFunction } from "../../../shared/i18n/i18n";
import {
  isProjectMuted,
  NOTIFICATION_MUTE_HOURS,
  type ProjectNotificationPreference,
} from "../model/notificationPreferences";

/** A single status label for the project rail, menus, and mute controls. */
export function notificationMuteStatus(
  preference: ProjectNotificationPreference | undefined,
  t: TFunction = tNow,
): string | null {
  if (!preference || !isProjectMuted(preference)) return null;
  return preference.mutedUntil === null
    ? t("notifications.muteActions.mutedUntilResumed")
    : t("notifications.muteActions.mutedUntil", {
        time: new Date(preference.mutedUntil!).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      });
}

/** The same preset IDs and durations are used by project and Inbox menus. */
const mutePresets: {
  kind: "item";
  id: string;
  label: (t: TFunction) => string;
  milliseconds?: number | null;
}[] = [
  ...NOTIFICATION_MUTE_HOURS.map((hours) => ({
    kind: "item" as const,
    id: `mute:${hours}`,
    label: (t: TFunction) =>
      t(
        hours === 1
          ? "notifications.muteActions.hours.one"
          : "notifications.muteActions.hours.other",
        { count: hours },
      ),
    milliseconds: hours * 3_600_000,
  })),
  {
    kind: "item" as const,
    id: "mute:indefinite",
    label: (t: TFunction) => t("notifications.muteActions.untilResumed"),
    milliseconds: null,
  },
  {
    kind: "item" as const,
    id: "mute:custom",
    label: (t: TFunction) => t("notifications.muteActions.customLabel"),
  },
];

export function notificationMuteActions(
  now = new Date(Date.now()),
  t: TFunction = tNow,
) {
  return mutePresets.map((action) => {
    const label = action.label(t);
    if (action.milliseconds == null)
      return {
        kind: action.kind,
        id: action.id,
        label,
        milliseconds: action.milliseconds,
      };
    const until = new Date(now.getTime() + action.milliseconds);
    const time = `${until.getHours()}:${String(until.getMinutes()).padStart(2, "0")}`;
    const sameDay = until.toDateString() === now.toDateString();
    return {
      kind: action.kind,
      id: action.id,
      milliseconds: action.milliseconds,
      label: sameDay
        ? t("notifications.muteActions.presetToday", { label, time })
        : t("notifications.muteActions.presetTomorrow", { label, time }),
    };
  });
}

export function notificationMuteDeadline(
  id: string,
): number | null | undefined {
  const action = mutePresets.find((item) => item.id === id);
  if (!action || action.milliseconds === undefined) return undefined;
  return action.milliseconds === null ? null : Date.now() + action.milliseconds;
}
