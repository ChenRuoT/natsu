import { BottomSheet, RNHostView } from "@expo/ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { useRef, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Alert,
  type LayoutChangeEvent,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useT, type TFunction } from "@/i18n/i18n";
import { Icon, type IconName } from "@/ui/Icon";

import type { GitAction, GitStatus } from "@/features/connection/useProjectGit";
import { withAlpha, themedStyles, useColors, useScheme } from "@/ui/theme";

import { formatCount } from "./diffTheme";

/** Cards over the translucent sheet: a light wash, so the glass shows through. */
const BUTTON = 50;
const MESSAGE = 104;
const GAP = 10;
/** Clear of the drag indicator above the header. */
const TOP = 26;
const HEADER = 44;
/** Below the buttons, on top of the space the sheet keeps at its bottom edge
 *  itself, which already matches its side margin. */
const BOTTOM = 8;

type Busy = "generate" | "commit" | "sync" | "pr";

/**
 * Native bottom sheet for committing the staged changes, after the desktop's
 * Changes panel: a message the desktop can write and Commit, then Push,
 * Publish or Sync and Create or View PR once the branch has something for them.
 */
export function CommitSheet({
  isPresented,
  onDismiss,
  status,
  error,
  staged,
  changed,
  additions,
  deletions,
  run,
  onChanged,
}: {
  isPresented: boolean;
  onDismiss: () => void;
  status: GitStatus | null;
  error: string | null;
  /** Staged files, what a commit takes, and their lines added and removed. */
  staged: number;
  /** Every changed file, staged or not. */
  changed: number;
  additions: number;
  deletions: number;
  run: (action: GitAction) => Promise<{ message?: string; url?: string }>;
  /** After anything that changed the repository, to read it again. */
  onChanged: () => void;
}) {
  const t = useT();
  const scheme = useScheme();
  const colors = useColors();
  const styles = useStyles();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<Busy | null>(null);
  // What the sheet keeps of its height for itself (its bottom inset), measured
  // rather than assumed, so the content gets all the room it was sized for.
  const [chrome, setChrome] = useState(0);
  // Bumped to drop a generation in flight; the desktop finishes it unseen.
  const generation = useRef(0);

  const remote = !!status?.remote;
  const diverged = !!status && status.ahead > 0 && status.behind > 0;
  const onDefault = !!status?.branch && status.branch === status.defaultBranch;
  const hasFiles = staged > 0;
  const canCommit = !!status && hasFiles && message.trim().length > 0 && !busy;
  const canGenerate = !!status?.canGenerate && hasFiles && (!busy || busy === "generate");
  const canPublish = remote && !status?.upstream;
  const canSync = remote && !!status?.upstream && (status.ahead > 0 || status.behind > 0);
  const showPr = remote && !onDefault && !!status?.defaultBranch;
  const canCreatePr =
    showPr &&
    !status?.pr &&
    !diverged &&
    changed === 0 &&
    (status?.aheadOfDefault ?? 0) > 0 &&
    status?.behind === 0 &&
    !busy;

  const setText = setMessage;

  const fail = (title: string, reason: unknown) =>
    Alert.alert(title, reason instanceof Error ? reason.message : String(reason));

  // As the desktop asks before pushing to, or opening a PR from, the default branch.
  const confirmDefault = (kind: "push" | "pr") =>
    !onDefault
      ? Promise.resolve(true)
      : new Promise<boolean>((resolve) =>
          Alert.alert(
            kind === "pr"
              ? t("changes.commitSheet.confirmPr", { branch: status?.branch ?? "" })
              : t("changes.commitSheet.confirmPush", { branch: status?.branch ?? "" }),
            undefined,
            [
              {
                text: t("changes.commitSheet.cancel"),
                style: "cancel",
                onPress: () => resolve(false),
              },
              {
                text: kind === "pr" ? t("changes.commitSheet.createPr") : t("changes.commitSheet.push"),
                onPress: () => resolve(true),
              },
            ],
            { cancelable: true, onDismiss: () => resolve(false) },
          ),
        );

  const openPr = (url?: string) => {
    if (url) void Linking.openURL(url);
  };

  const generate = async () => {
    if (busy === "generate") {
      generation.current += 1;
      setBusy(null);
      return;
    }
    if (!canGenerate) return;
    const mine = ++generation.current;
    setBusy("generate");
    try {
      const result = await run({ action: "generate" });
      if (generation.current === mine && result.message) setText(result.message);
    } catch (reason) {
      if (generation.current === mine) fail(t("changes.commitSheet.writeFailed"), reason);
    } finally {
      if (generation.current === mine) setBusy(null);
    }
  };

  const commit = async () => {
    if (!canCommit) return;
    setBusy("commit");
    try {
      await run({ action: "commit", message });
      setText("");
    } catch (reason) {
      fail(t("changes.commitSheet.commitFailed"), reason);
    } finally {
      setBusy(null);
      onChanged();
    }
  };

  const sync = async () => {
    if (busy || !(canPublish || canSync)) return;
    setBusy("sync");
    try {
      await run({ action: "sync" });
    } catch (reason) {
      fail(canPublish ? t("changes.commitSheet.publishFailed") : t("changes.commitSheet.syncFailed"), reason);
    } finally {
      setBusy(null);
      onChanged();
    }
  };

  const createPr = async () => {
    if (!canCreatePr || !(await confirmDefault("pr"))) return;
    setBusy("pr");
    try {
      openPr((await run({ action: "pr" })).url);
    } catch (reason) {
      fail(t("changes.commitSheet.createPrFailed"), reason);
    } finally {
      setBusy(null);
      onChanged();
    }
  };

  // Only what the branch allows now, rather than a column of greyed buttons.
  const secondary: ReactNode[] = [];
  if (status && (canPublish || canSync))
    secondary.push(
      <Action
        key="sync"
        icon="send"
        label={canPublish ? t("changes.commitSheet.publishBranch") : syncLabel(status, t)}
        busy={busy === "sync"}
        disabled={!!busy}
        onPress={() => void sync()}
      />,
    );
  if (status?.pr)
    secondary.push(
      <Action
        key="pr"
        icon="branch"
        label={t("changes.commitSheet.viewPr", { number: status.pr.number })}
        onPress={() => openPr(status.pr?.url)}
      />,
    );
  else if (canCreatePr || busy === "pr")
    secondary.push(
      <Action
        key="pr"
        icon="branch"
        label={t("changes.commitSheet.createPr")}
        busy={busy === "pr"}
        disabled={!!busy}
        onPress={() => void createPr()}
      />,
    );

  // The sheet's height: what the content takes, and what the sheet keeps on
  // top of it. The hosted view fills the rest.
  const content =
    TOP +
    HEADER +
    GAP +
    (status ? MESSAGE + GAP + BUTTON + (secondary.length ? GAP + BUTTON : 0) : BUTTON) +
    BOTTOM;
  const height = content + chrome;

  const onBodyLayout = (event: LayoutChangeEvent) => {
    const kept = Math.round(height - event.nativeEvent.layout.height);
    if (kept > chrome) setChrome(kept);
  };

  return (
    <BottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      snapPoints={[{ height }]}
      contentPadding={0}
      // Fill the whole sheet, so the hosted view takes its real size and the
      // buttons rest on its bottom edge rather than where the content ends.
      modifiers={[
        frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: "topLeading" }),
      ]}
    >
      <RNHostView>
        <View style={styles.body} onLayout={onBodyLayout}>
          <View style={styles.header}>
            <Icon name="branch" size={18} color={colors.muted} />
            <View style={styles.headerText}>
              <Text style={styles.branch} numberOfLines={1}>
                {status?.branch || t("changes.commitSheet.changesFallback")}
                {status && (status.ahead > 0 || status.behind > 0) ? (
                  <Text style={styles.counts}>{"  " + counts(status)}</Text>
                ) : null}
              </Text>
              <Text style={styles.summary} numberOfLines={1}>
                {hasFiles
                  ? `${staged === 1
                      ? t("changes.commitSheet.stagedFiles.one", { count: formatCount(staged) })
                      : t("changes.commitSheet.stagedFiles.other", { count: formatCount(staged) })}  `
                  : changed > 0
                    ? t("changes.commitSheet.nothingStaged")
                    : t("changes.commitSheet.noUncommitted")}
                {hasFiles ? (
                  <>
                    <Text style={{ color: colors.additions }}>+{formatCount(additions)}</Text>{" "}
                    <Text style={{ color: colors.deletions }}>-{formatCount(deletions)}</Text>
                  </>
                ) : null}
              </Text>
            </View>
          </View>

          {!status ? (
            <View style={styles.loading}>
              {error ? null : <ActivityIndicator color={colors.muted} />}
              <Text style={styles.summary}>
                {error ? updateHint(error, t) : t("changes.commitSheet.readingBranch")}
              </Text>
            </View>
          ) : (
            <>
              <View style={[styles.message, !hasFiles && styles.dimmed]}>
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  editable={hasFiles && !busy}
                  multiline
                  placeholder={hasFiles ? t("changes.commitSheet.messagePlaceholder") : t("changes.commitSheet.nothingToCommit")}
                  placeholderTextColor={colors.muted}
                  keyboardAppearance={scheme}
                  cursorColor={colors.accent}
                  selectionColor={colors.accent}
                  style={styles.input}
                />
                {status.canGenerate ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={busy === "generate" ? t("changes.commitSheet.stopWriting") : t("changes.commitSheet.writeMessage")}
                    disabled={!canGenerate}
                    onPress={() => void generate()}
                    style={({ pressed }) => [
                      styles.generate,
                      !canGenerate && styles.dimmed,
                      pressed && styles.pressed,
                    ]}
                  >
                    {busy === "generate" ? (
                      <ActivityIndicator size="small" color={colors.content} />
                    ) : (
                      <Icon name="sparkle" size={17} />
                    )}
                  </Pressable>
                ) : null}
              </View>

              {/* Pinned to the sheet's bottom edge, whatever is above them. */}
              <View style={styles.footer}>
                <View style={styles.row}>
                  <Pressable
                    accessibilityRole="button"
                    disabled={!canCommit}
                    onPress={() => void commit()}
                    style={({ pressed }) => [
                      styles.button,
                      styles.primary,
                      !canCommit && busy !== "commit" && styles.dimmed,
                      pressed && styles.pressed,
                    ]}
                  >
                    {busy === "commit" ? (
                      <ActivityIndicator size="small" color={colors.inverse} />
                    ) : (
                      <Icon name="check" size={18} color={colors.inverse} />
                    )}
                    <Text style={[styles.label, styles.primaryLabel]}>{t("changes.commitSheet.commit")}</Text>
                  </Pressable>
                </View>

                {secondary.length ? <View style={styles.row}>{secondary}</View> : null}
              </View>
            </>
          )}
        </View>
      </RNHostView>
    </BottomSheet>
  );
}

/** A secondary pill; two share a row. */
function Action({
  icon,
  label,
  busy = false,
  disabled = false,
  onPress,
}: {
  icon: IconName;
  label: string;
  busy?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles.secondary,
        disabled && !busy && styles.dimmed,
        pressed && styles.pressed,
      ]}
    >
      {busy ? (
        <ActivityIndicator size="small" color={colors.content} />
      ) : (
        <Icon name={icon} size={17} />
      )}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

/** How far the branch is ahead and behind its upstream, as the desktop's header shows. */
function counts(status: GitStatus) {
  return [status.ahead > 0 ? `↑${status.ahead}` : "", status.behind > 0 ? `↓${status.behind}` : ""]
    .filter(Boolean)
    .join(" ");
}

function syncLabel(status: GitStatus, t: TFunction) {
  if (status.ahead > 0 && status.behind > 0)
    return t("changes.commitSheet.syncBoth", { behind: status.behind, ahead: status.ahead });
  if (status.ahead > 0)
    return status.ahead === 1
      ? t("changes.commitSheet.push.one", { count: status.ahead })
      : t("changes.commitSheet.push.other", { count: status.ahead });
  return status.behind === 1
    ? t("changes.commitSheet.pull.one", { count: status.behind })
    : t("changes.commitSheet.pull.other", { count: status.behind });
}

/** An older desktop doesn't know the commit sheet's requests; say what fixes it. */
function updateHint(error: string, t: TFunction) {
  return /unsupported/i.test(error)
    ? t("changes.commitSheet.updateDesktop")
    : error;
}

const useStyles = themedStyles((colors) => ({
  body: {
    flex: 1,
    paddingTop: TOP,
    paddingHorizontal: 16,
    paddingBottom: BOTTOM,
    gap: GAP,
  },
  footer: {
    marginTop: "auto",
    gap: GAP,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: HEADER,
    paddingHorizontal: 4,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  branch: {
    color: colors.content,
    fontSize: 17,
    fontWeight: "600",
  },
  counts: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "400",
    fontVariant: ["tabular-nums"],
  },
  summary: {
    color: colors.muted,
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: BUTTON,
    paddingHorizontal: 4,
  },
  // Takes whatever room the buttons leave, at least its own height, and no
  // more: a long message scrolls inside it rather than pushing them off.
  message: {
    flex: 1,
    minHeight: MESSAGE,
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 20,
    borderCurve: "continuous",
    backgroundColor: withAlpha(colors.content, 0.07),
  },
  input: {
    flex: 1,
    alignSelf: "stretch",
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 16,
    color: colors.content,
    fontSize: 16,
    lineHeight: 21,
    textAlignVertical: "top",
  },
  generate: {
    width: 36,
    height: 36,
    margin: 8,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: withAlpha(colors.content, 0.07),
  },
  row: {
    flexDirection: "row",
    gap: GAP,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: BUTTON,
    // More on the right than the left: the icon makes the label read right of
    // centre, so the pair sits a little left to look centred.
    paddingLeft: 16,
    paddingRight: 28,
    borderRadius: BUTTON / 2,
  },
  primary: {
    backgroundColor: colors.inverseSurface,
  },
  secondary: {
    backgroundColor: withAlpha(colors.content, 0.07),
  },
  label: {
    flexShrink: 1,
    color: colors.content,
    fontSize: 16,
    fontWeight: "600",
  },
  primaryLabel: {
    color: colors.inverse,
  },
  dimmed: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
}));
