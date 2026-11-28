import type { ExplorerMenuItem } from "../../files/ui/ExplorerMenu";
import { t as tNow, type TFunction } from "../../../shared/i18n/i18n";
import { reminderTime } from "../model/sessionReminders";

export function sessionReminderPresets(now = new Date(), t: TFunction = tNow) {
  const timeInHours = (hours: 1 | 3) => {
    const date = new Date(reminderTime(`reminder:${hours}h`, now)!);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return [
    {
      kind: "item",
      id: "reminder:1h",
      label: t("sessions.sessionReminderPresets.in1Hour", {
        time: timeInHours(1),
      }),
    },
    {
      kind: "item",
      id: "reminder:3h",
      label: t("sessions.sessionReminderPresets.in3Hours", {
        time: timeInHours(3),
      }),
    },
    {
      kind: "item",
      id: "reminder:evening",
      label: t("sessions.sessionReminderPresets.evening"),
      disabled: reminderTime("reminder:evening", now) == null,
    },
    {
      kind: "item",
      id: "reminder:tomorrow",
      label: t("sessions.sessionReminderPresets.tomorrow"),
    },
    {
      kind: "item",
      id: "reminder:next-week",
      label: t("sessions.sessionReminderPresets.nextWeek"),
    },
  ] satisfies ExplorerMenuItem[];
}
