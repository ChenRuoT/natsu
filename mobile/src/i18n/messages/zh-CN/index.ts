import type { MessageKey } from "../en";
import { appZh } from "./app";
import { coreZh } from "./core";
import { sessionsZh } from "./sessions";
import { workspaceZh } from "./workspace";

export const zhCNAreas = { coreZh, sessionsZh, workspaceZh, appZh } as const;

export const zhCN: Record<MessageKey, string> = {
  ...coreZh,
  ...sessionsZh,
  ...workspaceZh,
  ...appZh,
};
