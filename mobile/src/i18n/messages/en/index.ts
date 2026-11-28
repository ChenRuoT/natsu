import { app } from "./app";
import { core } from "./core";
import { sessions } from "./sessions";
import { workspace } from "./workspace";

/** One catalog file per area so features can be translated in parallel. */
export const enAreas = { core, sessions, workspace, app } as const;

export const en = {
  ...core,
  ...sessions,
  ...workspace,
  ...app,
} as const;

export type MessageKey = keyof typeof en;
