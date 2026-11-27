import { formatReleaseDate, presentReleaseNotes } from "../model/releaseNotes";
import { AgentMarkdown } from "../../features/sessions/ui/AgentMarkdown";
import { useT } from "../../shared/i18n/i18n";
import { Modal } from "../../shared/ui/Modal";

type Props = {
  version: string;
  onClose: () => void;
};

export function WhatsNewBody({ version }: { version: string }) {
  const t = useT();
  const notes = presentReleaseNotes(version);

  return (
    <article
      aria-label={t("shell.whatsNew.articleLabel", { version })}
      className="px-5 py-4"
    >
      {notes?.markdown ? (
        <AgentMarkdown
          className="whats-new-md"
          text={notes.markdown}
          streaming={false}
        />
      ) : (
        <p className="text-[13px] text-content/60">
          {t("shell.whatsNew.unavailable")}
        </p>
      )}
    </article>
  );
}

export function WhatsNewDialog({ version, onClose }: Props) {
  const t = useT();
  const notes = presentReleaseNotes(version);
  const date = notes?.date ? formatReleaseDate(notes.date) : null;

  return (
    <Modal
      onClose={onClose}
      title={t("shell.whatsNew.title")}
      description={
        date
          ? t("shell.whatsNew.descriptionWithDate", { version, date })
          : t("shell.whatsNew.description", { version })
      }
      size="md"
      className="h-[min(72vh,640px)]"
    >
      <WhatsNewBody version={version} />
    </Modal>
  );
}
