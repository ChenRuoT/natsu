import { appearance } from "./appearance";
import { general } from "./general";
import { chat } from "./chat";
import { keybindings } from "./keybindings";
import { providers } from "./providers";
import { inbox } from "./inbox";
import { notifications } from "./notifications";
import { archive } from "./archive";
import { monos } from "./monos";
import { worktrees } from "./worktrees";
import { widgets } from "./widgets";
import { mcp } from "./mcp";
import { skills } from "./skills";
import { connections } from "./connections";
import { mobile } from "./mobile";
import { shell } from "./shell";
import { sessionsA } from "./sessionsA";
import { sessionsB } from "./sessionsB";
import { sidebar } from "./sidebar";
import { app } from "./app";
import { inboxView } from "./inboxView";
import { monosUi } from "./monosUi";
import { sourceControl } from "./sourceControl";
import { automations } from "./automations";
import { workspace } from "./workspace";
import { files } from "./files";
import { misc } from "./misc";

/** One catalog file per area so features can be translated in parallel. */
export const enAreas = {
  appearance,
  general,
  chat,
  keybindings,
  providers,
  inbox,
  notifications,
  archive,
  monos,
  worktrees,
  widgets,
  mcp,
  skills,
  connections,
  mobile,
  shell,
  sessionsA,
  sessionsB,
  sidebar,
  app,
  inboxView,
  monosUi,
  sourceControl,
  automations,
  workspace,
  files,
  misc,
} as const;

export const en = {
  ...appearance,
  ...general,
  ...chat,
  ...keybindings,
  ...providers,
  ...inbox,
  ...notifications,
  ...archive,
  ...monos,
  ...worktrees,
  ...widgets,
  ...mcp,
  ...skills,
  ...connections,
  ...mobile,
  ...shell,
  ...sessionsA,
  ...sessionsB,
  ...sidebar,
  ...app,
  ...inboxView,
  ...monosUi,
  ...sourceControl,
  ...automations,
  ...workspace,
  ...files,
  ...misc,
} as const;

export type MessageKey = keyof typeof en;
