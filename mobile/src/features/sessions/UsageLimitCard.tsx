import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useConnection } from "@/features/connection/ConnectionProvider";
import type { UsageLimitState } from "@/features/workspace/types";
import { useWorkspace } from "@/features/workspace/WorkspaceProvider";
import { useT } from "@/i18n/i18n";
import { themedStyles } from "@/ui/theme";

/** Eligibility, reset wording and scheduling belong to the desktop. */
export function UsageLimitCard({
  conversationId,
  state,
}: {
  conversationId: string;
  state: UsageLimitState;
}) {
  const styles = useStyles();
  const t = useT();
  const { connected } = useConnection();
  const { recoverUsage } = useWorkspace();
  const pending = useRef(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (automatic?: boolean) => {
    if (pending.current) return;
    pending.current = true;
    setSending(true);
    setError(null);
    try {
      await recoverUsage(conversationId, state, automatic);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      pending.current = false;
      setSending(false);
    }
  };
  const disabled = sending || !connected;
  return (
    <View style={styles.card} accessibilityLiveRegion="polite">
      <Text style={styles.title}>{t("sessions.usageLimitCard.title")}</Text>
      <Text style={styles.text}>
        {t("sessions.usageLimitCard.saved", { resetLabel: state.resetLabel })}
      </Text>
      <Text style={styles.hint}>{state.limitation}</Text>
      {!connected ? (
        <Text style={styles.hint}>
          {t("sessions.usageLimitCard.reconnectHint")}
        </Text>
      ) : null}
      {error ? (
        <Text style={styles.error}>
          {t("sessions.usageLimitCard.errorRetry", { error })}
        </Text>
      ) : null}
      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          disabled={disabled || !state.canResume}
          onPress={() => void run()}
          style={disabled || !state.canResume ? styles.dimmed : undefined}
        >
          <Text style={styles.action}>
            {sending
              ? t("sessions.usageLimitCard.updating")
              : t("sessions.usageLimitCard.resume")}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{
            checked: state.resumeAtReset,
            disabled: disabled || !state.canAutoResume,
          }}
          disabled={disabled || !state.canAutoResume}
          onPress={() => void run(!state.resumeAtReset)}
          style={disabled || !state.canAutoResume ? styles.dimmed : undefined}
        >
          <Text style={styles.action}>
            {state.resumeAtReset
              ? t("sessions.usageLimitCard.cancelAutoResume")
              : t("sessions.usageLimitCard.resumeAtReset")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
const useStyles = themedStyles((colors) => ({
  card: {
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.fill,
    gap: 6,
  },
  title: { color: colors.content, fontSize: 14, fontWeight: "600" },
  text: { color: colors.content, fontSize: 13 },
  hint: { color: colors.muted, fontSize: 12 },
  error: { color: colors.content, fontSize: 13 },
  controls: { flexDirection: "row", flexWrap: "wrap", gap: 24, paddingTop: 6 },
  action: {
    color: colors.content,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 6,
  },
  dimmed: { opacity: 0.4 },
}));
