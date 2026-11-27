import { useT } from "../../../shared/i18n/i18n";
import { MarkdownDocumentPreview } from "../../sessions/ui/MarkdownDocumentPreview";

/** Keep the skill's YAML header readable without interpreting it as Markdown. */
export function SkillDocumentPreview({ text }: { text: string }) {
  const t = useT();
  return (
    <MarkdownDocumentPreview
      text={text}
      metadataLabel={t("skills.skillDocumentPreview.metadataLabel")}
    />
  );
}
