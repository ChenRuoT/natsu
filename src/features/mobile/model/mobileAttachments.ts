import { attachmentsFromFiles } from "../../sessions/model/attachments";
import type { Attachment } from "../../sessions/model/session";
import { t as tNow } from "../../../shared/i18n/i18n";

/** As the phone's composer allows; bounds what one command can stage. */
const MAX_MOBILE_ATTACHMENTS = 10;

/** True when a phone command carries any files, before any are staged. */
export function hasMobileAttachments(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

/**
 * The files a phone sent with a message, as `{ name, mimeType, data }` in
 * base64. Staged as pasted files are here: vision images travel inline and
 * anything else is written to disk for the agent to read.
 */
export async function mobileAttachments(value: unknown): Promise<Attachment[]> {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_MOBILE_ATTACHMENTS)
    throw new Error(tNow("mobile.attachments.tooMany", { max: MAX_MOBILE_ATTACHMENTS }));
  const files = value.map((item: unknown) => {
    const { name, mimeType, data } = (item ?? {}) as Record<string, unknown>;
    if (typeof name !== "string" || !name.trim() || name.length > 255)
      throw new Error(tNow("mobile.attachments.missingName"));
    if (typeof data !== "string") throw new Error(tNow("mobile.attachments.noContents", { name }));
    const type = typeof mimeType === "string" ? mimeType : "";
    return new File([decodeBase64(data, name)], name, { type });
  });
  const staged = await attachmentsFromFiles(files);
  if (staged.length !== files.length) throw new Error(tNow("mobile.attachments.saveFailed"));
  return staged;
}

function decodeBase64(data: string, name: string): Uint8Array<ArrayBuffer> {
  let binary: string;
  try {
    binary = atob(data);
  } catch {
    throw new Error(tNow("mobile.attachments.unreadable", { name }));
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
