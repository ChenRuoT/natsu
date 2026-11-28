import { useEffect, useRef, useState } from "react";
import {
  Check,
  CornerDownRight,
  ListEnd,
  Pause,
  Pencil,
  Play,
  Trash2,
  X,
} from "../../../shared/ui/icons";
import { isImeComposition } from "../../../shared/lib/keyboard";
import { useT, type MessageKey } from "../../../shared/i18n/i18n";
import type { MessageQueueStatus, QueuedMessage } from "../model/session";

const COMPLETION_STATUS_KEYS = {
  completed: "sessions.messageQueue.statusCompleted",
  failed: "sessions.messageQueue.statusFailed",
  cancelled: "sessions.messageQueue.statusCancelled",
} as const satisfies Record<string, MessageKey>;

export function MessageQueue({
  messages,
  status,
  onDelete,
  onEdit,
  onEditingChange,
  onSteer,
  onResume,
  variant = "queue",
  sendingId,
}: {
  messages: QueuedMessage[];
  status?: MessageQueueStatus;
  onDelete?: (messageId: string) => void;
  onEdit?: (messageId: string, text: string) => void;
  onEditingChange?: (messageId?: string) => void;
  onSteer?: (messageId: string) => void;
  onResume?: () => void;
  variant?: "queue" | "messages";
  sendingId?: string;
}) {
  const t = useT();
  const [editingId, setEditingId] = useState<string>();
  const [editDraft, setEditDraft] = useState("");
  const onEditingChangeRef = useRef(onEditingChange);
  onEditingChangeRef.current = onEditingChange;
  const editingIdRef = useRef(editingId);
  editingIdRef.current = editingId;
  useEffect(() => {
    return () => {
      if (editingIdRef.current) onEditingChangeRef.current?.();
    };
  }, []);
  if (messages.length === 0) return null;
  const paused = status === "paused";
  const failed = messages.some((message) => message.error);

  const startEdit = (message: QueuedMessage) => {
    setEditingId(message.id);
    setEditDraft(message.text);
    onEditingChange?.(message.id);
  };
  const cancelEdit = () => {
    setEditingId(undefined);
    setEditDraft("");
    onEditingChange?.();
  };
  const saveEdit = (message: QueuedMessage) => {
    if (!editDraft.trim() && message.attachments.length === 0) return;
    onEdit?.(message.id, editDraft);
    setEditingId(undefined);
    setEditDraft("");
  };

  return (
    <div className="px-2 text-content/55" data-message-queue>
      <div
        className="relative z-0 rounded-t-[10px] border border-b-0 border-content/10 bg-content/3 px-2.5 py-0.5"
        data-message-queue-card
      >
        {paused ? (
          <div className="flex h-7 items-center gap-2 border-b border-stroke text-[12px]">
            <Pause className="size-3.5" />
            <span className="min-w-0 flex-1 truncate">
              {failed
                ? t("sessions.messageQueue.failed")
                : variant === "messages"
                  ? t("sessions.messageQueue.messagesPaused")
                  : t("sessions.messageQueue.queuePausedInterrupted")}
            </span>
            <button
              type="button"
              onClick={onResume}
              className="flex h-6 shrink-0 items-center gap-1.5 rounded-md px-1.5 hover:bg-content/10 hover:text-content"
            >
              <Play className="size-3.5" />
              {failed
                ? t("sessions.messageQueue.retry")
                : t("sessions.messageQueue.resume")}
            </button>
          </div>
        ) : null}
        {variant === "messages" && !paused ? (
          <div role="status" className="py-1 text-[11px] text-content/50">
            {sendingId
              ? t("sessions.messageQueue.sending")
              : t("sessions.messageQueue.waiting")}
          </div>
        ) : null}
        {messages.map((message, index) => {
          const sending = sendingId === message.id;
          const editing = editingId === message.id;
          const completion = message.monoSessionCompletion;
          const label =
            (completion
              ? completion.sessionCount
                ? t("sessions.messageQueue.monoCompletionCount", {
                    count: completion.sessionCount,
                  })
                : t("sessions.messageQueue.monoCompletionStatus", {
                    status: t(COMPLETION_STATUS_KEYS[completion.status]),
                    title: completion.title,
                  })
              : message.text.trim()) ||
            message.noteCard?.title ||
            message.handoffCard?.brief ||
            (message.attachments.length === 1
              ? t("sessions.messageQueue.attachmentCount.one", { count: 1 })
              : t("sessions.messageQueue.attachmentCount.other", {
                  count: message.attachments.length,
                }));
          return (
            <div
              key={message.id}
              className={`flex min-h-8 items-center gap-2.5 text-[12px] ${
                index > 0 ? "border-t border-content/5" : ""
              }`}
            >
              <ListEnd className="size-3.5 shrink-0 text-content/35" />
              {editing ? (
                <>
                  <textarea
                    autoFocus
                    aria-label={t("sessions.messageQueue.editLabel")}
                    value={editDraft}
                    rows={1}
                    onChange={(event) => setEditDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (isImeComposition(event.nativeEvent)) return;
                      if (event.key === "Escape") {
                        event.preventDefault();
                        cancelEdit();
                      } else if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        saveEdit(message);
                      }
                    }}
                    className="min-h-6 min-w-0 flex-1 resize-none rounded-md border border-content/15 bg-content/5 px-1.5 py-0.5 text-[12px] text-content outline-none focus:border-content/30"
                  />
                  <button
                    type="button"
                    title={t("sessions.messageQueue.saveLabel")}
                    aria-label={t("sessions.messageQueue.saveLabel")}
                    disabled={
                      !editDraft.trim() && message.attachments.length === 0
                    }
                    onClick={() => saveEdit(message)}
                    className="grid size-6 shrink-0 place-items-center rounded-md hover:bg-content/10 hover:text-content disabled:opacity-30"
                  >
                    <Check className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    title={t("sessions.messageQueue.cancelEditLabel")}
                    aria-label={t("sessions.messageQueue.cancelEditLabel")}
                    onClick={cancelEdit}
                    className="grid size-6 shrink-0 place-items-center rounded-md hover:bg-content/10 hover:text-content"
                  >
                    <X className="size-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <div className="min-w-0 flex-1 py-1">
                    <div className="truncate text-content/75" title={label}>
                      {label}
                    </div>
                    {message.error ? (
                      <p role="alert" className="text-red-400">
                        {message.error}
                      </p>
                    ) : null}
                  </div>
                  {onSteer && !message.monoSessionCompletion ? (
                    <button
                      type="button"
                      disabled={sending}
                      onClick={() => onSteer?.(message.id)}
                      className="flex h-6 shrink-0 items-center gap-1.5 rounded-md px-2 text-content/50 transition-colors hover:bg-content/8 hover:text-content/90 disabled:opacity-40"
                    >
                      <CornerDownRight className="size-3.5" />
                      {t("sessions.messageQueue.steer")}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    title={t("sessions.messageQueue.editLabel")}
                    aria-label={t("sessions.messageQueue.editLabel")}
                    disabled={sending || !!message.monoSessionCompletion}
                    onClick={() => startEdit(message)}
                    className="grid size-6 shrink-0 place-items-center rounded-md text-content/40 transition-colors hover:bg-content/8 hover:text-content/90 disabled:opacity-40"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    title={t("sessions.messageQueue.removeLabel")}
                    aria-label={t("sessions.messageQueue.removeLabel")}
                    disabled={sending}
                    onClick={() => onDelete?.(message.id)}
                    className="grid size-6 shrink-0 place-items-center rounded-md text-content/40 transition-colors hover:bg-content/8 hover:text-content/90 disabled:opacity-40"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
