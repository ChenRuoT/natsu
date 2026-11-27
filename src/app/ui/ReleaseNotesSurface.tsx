import { useLockOverscroll } from "../../shared/hooks/useLockOverscroll";
import { useT } from "../../shared/i18n/i18n";
import {
  releaseNotesMarkdown,
  type ReleaseNotesTabSource,
} from "../model/releaseNotes";
import { AgentMarkdown } from "../../features/sessions/ui/AgentMarkdown";

export function ReleaseNotesSurface({
  source,
}: {
  source: ReleaseNotesTabSource;
}) {
  const lockOverscroll = useLockOverscroll<HTMLDivElement>();
  const t = useT();
  const markdown = releaseNotesMarkdown(source);

  return (
    <div
      ref={lockOverscroll}
      className="h-full overflow-y-auto overscroll-none"
    >
      <article
        aria-label={t("shell.releaseNotesSurface.articleLabel")}
        className="mx-auto w-full max-w-3xl px-8 py-10"
      >
        {markdown ? (
          <AgentMarkdown text={markdown} streaming={false} />
        ) : (
          <p className="text-[13px] text-content/60">
            {t("shell.releaseNotesSurface.unavailable")}
          </p>
        )}
      </article>
    </div>
  );
}
