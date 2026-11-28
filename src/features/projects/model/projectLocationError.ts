import { displayPath } from "../../../shared/lib/paths";
import { t as tNow } from "../../../shared/i18n/i18n";

/** Requires reconnecting the project before the user retries submission. */
export class ProjectNotFoundError extends Error {
  constructor(cwd: string) {
    super(tNow("projects.locationError.notFound", { path: displayPath(cwd) }));
    this.name = "ProjectNotFoundError";
  }
}
