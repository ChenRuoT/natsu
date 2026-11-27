import type { MessageKey } from "../en";
import { appearanceZh } from "./appearance";
import { generalZh } from "./general";
import { chatZh } from "./chat";
import { keybindingsZh } from "./keybindings";
import { providersZh } from "./providers";
import { inboxZh } from "./inbox";
import { notificationsZh } from "./notifications";
import { archiveZh } from "./archive";
import { monosZh } from "./monos";
import { worktreesZh } from "./worktrees";
import { widgetsZh } from "./widgets";
import { mcpZh } from "./mcp";
import { skillsZh } from "./skills";
import { connectionsZh } from "./connections";
import { mobileZh } from "./mobile";
import { shellZh } from "./shell";
import { sessionsAZh } from "./sessionsA";
import { sessionsBZh } from "./sessionsB";
import { sidebarZh } from "./sidebar";
import { appZh } from "./app";
import { inboxViewZh } from "./inboxView";
import { monosUiZh } from "./monosUi";
import { sourceControlZh } from "./sourceControl";
import { automationsZh } from "./automations";
import { workspaceZh } from "./workspace";
import { filesZh } from "./files";
import { miscZh } from "./misc";

export const zhCNAreas = {
  appearanceZh,
  generalZh,
  chatZh,
  keybindingsZh,
  providersZh,
  inboxZh,
  notificationsZh,
  archiveZh,
  monosZh,
  worktreesZh,
  widgetsZh,
  mcpZh,
  skillsZh,
  connectionsZh,
  mobileZh,
  shellZh,
  sessionsAZh,
  sessionsBZh,
  sidebarZh,
  appZh,
  inboxViewZh,
  monosUiZh,
  sourceControlZh,
  automationsZh,
  workspaceZh,
  filesZh,
  miscZh,
} as const;

export const zhCN: Record<MessageKey, string> = {
  ...appearanceZh,
  ...generalZh,
  ...chatZh,
  ...keybindingsZh,
  ...providersZh,
  ...inboxZh,
  ...notificationsZh,
  ...archiveZh,
  ...monosZh,
  ...worktreesZh,
  ...widgetsZh,
  ...mcpZh,
  ...skillsZh,
  ...connectionsZh,
  ...mobileZh,
  ...shellZh,
  ...sessionsAZh,
  ...sessionsBZh,
  ...sidebarZh,
  ...appZh,
  ...inboxViewZh,
  ...monosUiZh,
  ...sourceControlZh,
  ...automationsZh,
  ...workspaceZh,
  ...filesZh,
  ...miscZh,
};
