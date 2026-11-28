import type { MessageKey } from "@/i18n/i18n";
import type { IconName } from "@/ui/Icon";

import type { RuntimeMode } from "./types";

/**
 * The desktop's permission modes (RUNTIME_MODES with their labels and hints
 * in src/features/sessions/model/session.ts), with the AccessPicker's icons.
 * Their text is keyed: call `t(mode.labelKey)` and `t(mode.hintKey)`.
 */
export const ACCESS_MODES: {
  id: RuntimeMode;
  labelKey: MessageKey;
  hintKey: MessageKey;
  icon: IconName;
}[] = [
  {
    id: "supervised",
    labelKey: "app.access.supervisedLabel",
    hintKey: "app.access.supervisedHint",
    icon: "lock",
  },
  {
    id: "auto-accept-edits",
    labelKey: "app.access.autoAcceptEditsLabel",
    hintKey: "app.access.autoAcceptEditsHint",
    icon: "edit",
  },
  {
    id: "auto",
    labelKey: "app.access.autoLabel",
    hintKey: "app.access.autoHint",
    icon: "sparkle",
  },
  {
    id: "full-access",
    labelKey: "app.access.fullAccessLabel",
    hintKey: "app.access.fullAccessHint",
    icon: "shield",
  },
];

export const DEFAULT_ACCESS: RuntimeMode = "supervised";

export function accessMode(id: RuntimeMode | undefined) {
  return ACCESS_MODES.find((mode) => mode.id === id) ?? ACCESS_MODES[0];
}
