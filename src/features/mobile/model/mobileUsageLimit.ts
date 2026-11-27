import { t as tNow } from "../../../shared/i18n/i18n";
import type { Session } from "../../sessions/model/session";
import { validateMobileUsageLimit } from "../../sessions/model/usageLimit";

/** The command boundary holds the session lock until the desktop action accepts or fails. */
export async function recoverMobileUsage(options: {
  session: Session | undefined;
  token: unknown;
  automatic: boolean;
  enabled: unknown;
  pending: Set<string>;
  resume: (id: string) => Promise<boolean>;
  setAutomatic: (id: string, enabled: boolean) => void;
}): Promise<void> {
  const { session, automatic, pending } = options;
  if (!session || session.worktreeRemoved)
    throw new Error(tNow("mobile.usageLimit.sessionGone"));
  if (automatic && typeof options.enabled !== "boolean")
    throw new Error(tNow("mobile.usageLimit.chooseResume"));
  validateMobileUsageLimit(session, options.token, automatic);
  if (pending.has(session.id))
    throw new Error(tNow("mobile.usageLimit.inProgress"));
  pending.add(session.id);
  try {
    if (automatic) options.setAutomatic(session.id, options.enabled as boolean);
    else if (!(await options.resume(session.id)))
      throw new Error(tNow("mobile.usageLimit.continueFailed"));
  } finally {
    pending.delete(session.id);
  }
}
