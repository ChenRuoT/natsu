import { invoke } from "@tauri-apps/api/core";
import { createPortal } from "react-dom";
import { openUrl } from "@tauri-apps/plugin-opener";
import { ConnectionsSettings } from "../../connections/ui/ConnectionsSettings";
import { MobileSettings } from "../../mobile/ui/MobileSettings";
import { ask } from "@tauri-apps/plugin-dialog";
import {
  ArrowDownCircle,
  Check,
  ChevronDown,
  ExternalLink,
  FolderOpen,
  Globe,
  ImagePlus,
  Loader,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "../../../shared/ui/icons";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { HarnessIcon } from "../../sessions/ui/HarnessIcon";
import {
  ColorPickerPopover,
  ColorSwatchRow,
} from "../../../shared/ui/ColorPickerPopover";
import {
  LOCALE_OPTIONS,
  getLocale,
  isLocale,
  setLocale,
  useLocale,
  useT,
  type MessageKey,
  type TFunction,
} from "../../../shared/i18n/i18n";
import { Popover } from "../../../shared/ui/Popover";
import { SecondaryButton } from "../../../shared/ui/SecondaryButton";
import { JiraSettings } from "./JiraSettings";
import { GradientBlurBackground } from "./GradientBlurBackground";
import { McpSettings } from "./McpSettings";
import { InboxProviderMark } from "../../inbox/ui/InboxProviderMark";
import { RemoveProjectDialog } from "../../projects/ui/RemoveProjectDialog";
import { WindowControls } from "../../../app/shell/WindowControls";
import { useLockOverscroll } from "../../../shared/hooks/useLockOverscroll";
import { useColorScheme } from "../../../shared/hooks/useColorScheme";
import {
  WORKSPACE_THEMES,
  workspaceThemeLabel,
  WORKSPACE_THEME_DEFAULT,
  isWorkspaceThemeId,
  type WorkspacePalette,
  type WorkspaceThemeId,
} from "../model/workspaceThemes";
import {
  applyChatBackground,
  applyChatBackgroundEmptyOpacity,
  applyChatBackgroundSessionOpacity,
  applyChatBackgroundScope,
  applyDiffPalette,
  applyAccentColor,
  applyBodyGlass,
  applySidebarBlur,
  applySidebarOpacity,
  applyThemeDarkLightness,
  applyThemePreference,
  applyThemeTint,
  applyWorkspaceTheme,
  BODY_GLASS_DEFAULT,
  INSET_LAYOUT_DEFAULT,
  INSET_GLASS_DEFAULT,
  ACCENT_COLOR_DEFAULT,
  CHAT_BACKGROUND_EMPTY_OPACITY_DEFAULT,
  CHAT_BACKGROUND_OPACITY_MAX,
  CHAT_BACKGROUND_OPACITY_MIN,
  CHAT_BACKGROUND_SESSION_OPACITY_DEFAULT,
  CHAT_BACKGROUND_SCOPE_DEFAULT,
  THEME_PREFERENCE_DEFAULT,
  chatBackgroundSrc,
  loadBodyGlass,
  loadInsetLayout,
  loadInsetGlass,
  loadAccentColor,
  loadChatBackgroundEmptyOpacity,
  loadChatBackgroundPath,
  loadChatBackgroundSessionOpacity,
  loadChatBackgroundScope,
  loadDiffPalette,
  loadNewThreadBackgroundEffect,
  loadThemeDarkLightness,
  loadThemePreference,
  loadSidebarBlur,
  loadSidebarOpacity,
  loadThemeHue,
  loadThemeSaturation,
  loadWorkspaceTheme,
  loadTranscriptLayout,
  loadTranscriptAnchor,
  saveBodyGlass,
  saveInsetLayout,
  saveInsetGlass,
  subscribeInsetLayout,
  saveAccentColor,
  saveChatBackgroundEmptyOpacity,
  saveChatBackgroundPath,
  saveChatBackgroundSessionOpacity,
  saveChatBackgroundScope,
  saveDiffPalette,
  setNewThreadBackgroundEffect,
  saveThemeDarkLightness,
  saveThemePreference,
  saveSidebarBlur,
  saveSidebarOpacity,
  saveThemeHue,
  saveThemeSaturation,
  saveWorkspaceTheme,
  isLightScheme,
  saveTranscriptLayout,
  saveTranscriptAnchor,
  syncNativeGlass,
  TRANSCRIPT_ANCHOR_CHANGE_EVENT,
  loadShowExcludedFiles,
  saveShowExcludedFiles,
  SHOW_EXCLUDED_FILES_DEFAULT,
  SIDEBAR_BLUR_DEFAULT,
  SIDEBAR_BLUR_MAX,
  SIDEBAR_BLUR_MIN,
  SIDEBAR_OPACITY_DEFAULT,
  SIDEBAR_OPACITY_MAX,
  SIDEBAR_OPACITY_MIN,
  THEME_DARK_LIGHTNESS_DEFAULT,
  THEME_DARK_LIGHTNESS_MAX,
  THEME_DARK_LIGHTNESS_MIN,
  THEME_HUE_DEFAULT,
  THEME_HUE_MAX,
  THEME_HUE_MIN,
  THEME_SATURATION_DEFAULT,
  THEME_SATURATION_MAX,
  THEME_SATURATION_MIN,
  type ThemePreference,
  type ChatBackgroundScope,
  DIFF_PALETTE_DEFAULT,
  type DiffPalette,
  NEW_THREAD_BACKGROUND_EFFECTS,
  NEW_THREAD_BACKGROUND_EFFECT_LABEL_KEYS,
  NEW_THREAD_BACKGROUND_EFFECT_DESCRIPTION_KEYS,
  NEW_THREAD_BACKGROUND_EFFECT_DEFAULT,
  type NewThreadBackgroundEffect,
  type TranscriptLayout,
} from "../model/appearance";
import {
  pickAndSaveChatBackground,
  removeChatBackground,
} from "../../projects/model/chatBackground";
import {
  applyUiScale,
  loadUiScale,
  saveUiScale,
  subscribeUiScale,
  UI_SCALE_DEFAULT,
  UI_SCALE_PERCENTS,
} from "../model/uiScale";
import {
  getHarnessAvailabilitySnapshot,
  harnessUnavailableHint,
  isHarnessAvailable,
  probeHarnessAvailability,
  subscribeHarnessAvailability,
} from "../../../integrations/harness/core/availability";
import {
  inspectHarnessBinary,
  type HarnessBinaryInspection,
} from "../../../integrations/harness/core/child";
import {
  loadProviderBinaryPath,
  providerBinaryPathChangePending,
  saveProviderBinaryPath,
  type ConfigurableBinaryProvider,
} from "../../providers/model/providerBinaryPaths";
import {
  compareSemver,
  MINIMUM_OPENCODE_VERSION,
  parseOpenCodeVersion,
} from "../../../integrations/harness/providers/opencode/opencodeProtocol";
import {
  enforceHarnessIdleLimit,
  refreshHarnessCatalogs,
} from "../../../integrations/harness/core/registry";
import { loginHarness } from "../../../integrations/harness/core/auth";
import {
  defaultModelId,
  firstEnabledHarness,
  getModelSnapshot,
  hasLiveCatalog,
  loadDefaultModels,
  loadHiddenPickerProviders,
  loadLastModelChoice,
  modelsFor,
  resolveModel,
  saveDefaultModel,
  saveLastModelChoice,
  savePickerProviderVisible,
  subscribeModels,
} from "../../sessions/model/models";
import {
  pathKey,
  prettyCwd,
  projectKey,
  projectName,
} from "../../../shared/lib/paths";
import { revealPath } from "../../../platform/tauri/fs";
import { IS_LINUX, IS_MAC, IS_WIN } from "../../../platform/tauri/platform";
import {
  loadArchivedProjects,
  looksLikeProject,
  subscribeArchivedProjects,
  type ArchivedProject,
  type RecentProject,
} from "../../projects/model/recents";
import {
  HARNESSES,
  HARNESS_TITLE,
  sessionDisplayTitle,
  type HarnessId,
} from "../../sessions/model/session";
import {
  loadProjectProviderSettings,
  projectProvidersRevision,
  setProjectDefaultModel,
  setProjectDefaultProvider,
  setProjectProviderHidden,
  subscribeProjectProviders,
} from "../../sessions/model/projectProviders";
import {
  newProviderAccount,
  providerAccounts,
  PROVIDER_ACCOUNT_PROVIDERS,
  removeProviderAccount,
  renameProviderAccount,
  saveProviderAccount,
  subscribeProviderAccounts,
  supportsAccountProfiles,
  type ProviderAccount,
  type ProviderAccountProvider,
} from "../../providers/model/providerAccounts";
import { removeProviderAccountCredentials } from "../../providers/model/providerAccountCredentials";
import {
  identityKey,
  identityOrganizationTag,
  useProviderAccountIdentities,
} from "../../providers/model/providerAccountIdentity";
import { ProviderAccountSubtitle } from "../../providers/ui/ProviderAccountSubtitle";
import {
  saveComposerAutocorrect,
  savePacedReveal,
  usePacedReveal,
  saveMaskEmails,
  saveNewLayoutPromptDismissed,
  saveRailMonosPinned,
  saveShowRemainingUsage,
  useComposerAutocorrect,
  useMaskEmails,
  useRailMonosPinned,
  useShowRemainingUsage,
} from "../model/displayPrefs";
import {
  accountStatus,
  accountUsageKey,
  useProviderAccountUsage,
} from "../../providers/model/accountUsage";
import { clearCachedRateLimits } from "../../providers/model/rateLimitsCache";
import {
  AccountStatusLabel,
  AccountUsageMeters,
  AccountUsageRefresh,
} from "../../providers/ui/ProviderAccountUsage";
import {
  loadSessionSidebarFilters,
  saveSessionSidebarFilters,
} from "../../sessions/model/sessionFilters";
import type { SessionSummary } from "../../sessions/data/sessionStore";
import {
  clearInboxCache,
  githubStatus,
  type GithubStatus,
} from "../../inbox/model/githubTasks";
import {
  disconnectGitlab,
  gitlabConnected,
  saveGitlabConfig,
} from "../../inbox/model/gitlab";
import {
  azureDevOpsConnected,
  disconnectAzureDevOps,
  saveAzureDevOpsConfig,
} from "../../inbox/model/azureDevOps";
import {
  disconnectLinear,
  LINEAR_CHANGE_EVENT,
  linearConnected,
  listLinearTeams,
  loadHiddenLinearTeamIds,
  notifyLinearChange,
  saveHiddenLinearTeamIds,
  saveLinearToken,
  type LinearTeam,
} from "../../inbox/model/linear";
import {
  loadTabGroupColors,
  loadTabGroupCustomColors,
  loadTabGroupLabels,
  loadTabGroupMascots,
  resolveTabGroupColor,
  resolveTabGroupLabel,
  resolveTabGroupLogo,
  resolveTabGroupMascot,
} from "../../workspace/model/tabGroups";
import { useTabGroupLogos } from "../../projects/hooks/useTabGroupLogos";
import { ProjectLogoIcon } from "../../projects/ui/ProjectLogoIcon";
import { ProjectMascot } from "../../projects/ui/ProjectMascot";
import { PixelMascot } from "../../projects/ui/PixelMascot";
import {
  defaultMonoName,
  listMonos,
  monoLook,
  monoProjectsPhrase,
  monosSnapshot,
  subscribeMonos,
  updateMono,
  type Mono,
} from "../../monos/model/mono";
import { resetMonoDefaults } from "../../monos/model/monoFiles";
import { ConfirmReset } from "../../monos/ui/ConfirmReset";
import {
  filterKeybindings,
  currentKeybindings,
  loadClaudeHooks,
  loadIdleAgentLimit,
  loadCloseToTray,
  loadCollapsedProjectRailMode,
  loadComposerRunner,
  loadDiffViewer,
  loadFileTabMode,
  loadFollowUpBehavior,
  loadFormatOnSave,
  loadGridArcadeEnabled,
  loadLiveAgentsEnabled,
  loadModelControls,
  loadNotesEnabled,
  loadMonosEnabled,
  loadMonoMenuBarIcon,
  loadKeybindingOverrides,
  saveMonoMenuBarIcon,
  subscribeMonoMenuBarIcon,
  loadQuickComposerEnabled,
  loadQuickComposerShortcut,
  loadTabAnimationsEnabled,
  saveClaudeHooks,
  saveIdleAgentLimit,
  IDLE_AGENT_LIMITS,
  type IdleAgentLimit,
  saveCloseToTray,
  saveCollapsedProjectRailMode,
  saveComposerRunner,
  saveDiffViewer,
  saveFileTabMode,
  saveFollowUpBehavior,
  saveFormatOnSave,
  saveGridArcadeEnabled,
  saveLiveAgentsEnabled,
  saveModelControls,
  saveNotesEnabled,
  saveMonosEnabled,
  subscribeMonosEnabled,
  saveKeybindingOverride,
  validateKeybindingShortcut,
  saveQuickComposerEnabled,
  saveQuickComposerShortcut,
  subscribeKeybindings,
  type KeybindingOverride,
  saveTabAnimationsEnabled,
  searchSettings,
  CLASSIC_LAYOUT_HIDDEN_SETTINGS,
  INSET_LAYOUT_HIDDEN_SETTINGS,
  settingsSectionDescription,
  settingsSectionLabel,
  COLLAPSED_PROJECT_RAIL_MODE_DEFAULT,
  type CollapsedProjectRailMode,
  type DiffViewer,
  type FileTabMode,
  type FollowUpBehavior,
  type ModelControls,
  type SettingsSearchResult,
  type SettingsSectionId,
} from "../model/settings";
import { loadSoundsEnabled, playCue, saveSoundsEnabled } from "../model/sounds";
import { setQuickComposerShortcut } from "../../quick-composer/model/quickComposer";
import {
  isGlobalShortcut,
  QUICK_COMPOSER_DEFAULT_SHORTCUT,
  quickComposerShortcutLabel,
  quickComposerShortcutPreview,
  shortcutFromKeyEvent,
} from "../../quick-composer/model/quickComposerShortcut";
import {
  cachedNotificationPermission,
  loadNotificationsEnabled,
  openNotificationSettings,
  probeNotificationPermission,
  requestNotificationPermission,
  saveNotificationsEnabled,
  type NotificationPermission,
} from "../../notifications/model/notifications";
import {
  installPendingUpdate,
  packageManagedInstall,
  packageManagerHint,
  readAppVersion,
  runUpdateFlow,
  type UpdaterSnapshot,
} from "../../../app/model/updater";

import { SkillsPage } from "../../skills/ui/SkillsPage";
import { ProjectNotificationSettings } from "../../notifications/ui/ProjectNotificationSettings";
import { WorktreesPage } from "../../source-control/ui/WorktreesPage";
import {
  removeWorktree,
  type RemoveWorktree,
} from "../../source-control/model/worktrees";
import type { Session } from "../../sessions/model/session";

/**
 * The `data-setting-id` Settings should reveal when it opens: one of the ids in
 * `SETTINGS_INDEX`. Inbox integrations pass their provider id.
 */
export type SettingsAnchor = string;

const settingDomId = (id: string) => `setting-${id}`;

/** The row or group Settings just jumped to, so it can flash where you landed. */
const RevealedSetting = createContext<string | null>(null);

type Props = {
  section: SettingsSectionId;
  /** Card to scroll to; the General page is too long to land at the top. */
  anchor?: SettingsAnchor | null;
  /** Project to focus when opening notification settings from a quick action. */
  notificationProjectPath?: string | null;
  /** Changes for each quick action, including repeated requests for one project. */
  notificationSettingsRequest?: number;
  recents?: RecentProject[];
  cwd: string;
  sessions: SessionSummary[];
  liveSessions?: Session[];
  onRemoveWorktree?: RemoveWorktree;
  onCheckWorktreeRemoval?: RemoveWorktree;
  onDeleteWorktreeSessions?: (
    sessionIds: readonly string[],
  ) => Promise<boolean>;
  besideRail?: boolean;
  /**
   * The inset layout's title bar slot. When given, the breadcrumb and actions
   * render there in place of the tabs and the page drops its own header row;
   * `null` means the slot hasn't mounted yet, so neither shows for a frame.
   */
  headerHost?: HTMLElement | null;
  onClose: () => void;
  /** Lets search jump to a setting that lives on another page. */
  onSelectSection?: (section: SettingsSectionId) => void;
  onOpenSession: (sessionId: string) => void;
  onArchiveSession: (sessionId: string, archived: boolean) => void;
  onDeleteSession: (sessionId: string) => void;
  onRestoreProject?: (path: string) => void;
  onDeleteProject?: (path: string) => void;
  onOpenWhatsNew: (version: string) => void;
  collapsedProjectRailMode?: CollapsedProjectRailMode;
  onCollapsedProjectRailModeChange?: (mode: CollapsedProjectRailMode) => void;
};

export function SettingsView({
  section,
  anchor = null,
  notificationProjectPath = null,
  notificationSettingsRequest = 0,
  recents,
  cwd,
  sessions,
  liveSessions,
  onRemoveWorktree = removeWorktree,
  onCheckWorktreeRemoval,
  onDeleteWorktreeSessions,
  besideRail = false,
  headerHost,
  onClose,
  onSelectSection,
  onOpenSession,
  onArchiveSession,
  onDeleteSession,
  onRestoreProject,
  onDeleteProject,
  onOpenWhatsNew,
  collapsedProjectRailMode,
  onCollapsedProjectRailModeChange,
}: Props) {
  const t = useT();
  const lockOverscroll = useLockOverscroll<HTMLDivElement>();
  const [revealed, setRevealed] = useState<string | null>(anchor);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const appearance = useAppearanceSettings(
    collapsedProjectRailMode,
    onCollapsedProjectRailModeChange,
  );

  useEffect(() => setRevealed(anchor), [anchor, notificationSettingsRequest]);

  // Section is a dependency so a search result on another page scrolls once
  // that page has mounted the row.
  useEffect(() => {
    if (!revealed) return;
    // A project quick action lets the project card focus itself after discovery.
    if (!(revealed === "project-notifications" && notificationProjectPath)) {
      document
        .getElementById(settingDomId(revealed))
        ?.scrollIntoView?.({ block: "center" });
    }
    const timer = window.setTimeout(() => setRevealed(null), 1800);
    return () => window.clearTimeout(timer);
  }, [revealed, section, notificationProjectPath, notificationSettingsRequest]);

  const onReveal = useCallback(
    (next: SettingsSectionId, settingId: string | null) => {
      if (next !== section) onSelectSection?.(next);
      setRevealed(settingId);
    },
    [onSelectSection, section],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      event.stopPropagation();
      onCloseRef.current();
    };
    // Let dialogs and other Settings controls handle Escape first.
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The breadcrumb and page actions, in the page's own header row or the
  // inset title bar. There the bar already sits 6px past the rail, and the
  // card ends 6px short of the window, so the padding keeps both ends 10px
  // inside the card's edges.
  const inTitleBar = headerHost !== undefined;
  const settingsHeader = (
    <>
      <div
        className={`flex min-w-0 flex-1 items-center gap-2 text-[13px] ${
          inTitleBar ? "pr-3 pl-1" : "px-3"
        }`}
      >
        <span className="shrink-0 text-content/45">
          {t("settings.general.breadcrumbRoot")}
        </span>
        <span aria-hidden className="shrink-0 text-content/25">
          /
        </span>
        <span className="min-w-0 truncate text-content">
          {settingsSectionLabel(section)}
        </span>
      </div>
      <div
        className={`flex shrink-0 items-center gap-1.5 ${
          inTitleBar ? "pr-4" : "pr-2"
        }`}
        data-tauri-drag-region="false"
      >
        {section === "appearance" ? (
          <button
            type="button"
            onClick={appearance.restoreDefaults}
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-content/50 hover:bg-content/10 hover:text-content"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.75} />
            {t("settings.general.restoreDefaults")}
          </button>
        ) : null}
        <SettingsSearch onReveal={onReveal} />
      </div>
    </>
  );

  return (
    <div
      role="region"
      aria-label={t("settings.general.regionLabel")}
      data-app-settings
      className="flex min-h-0 min-w-0 flex-1 flex-col text-content"
    >
      {headerHost !== undefined ? (
        headerHost &&
        createPortal(
          <div className="flex h-full min-w-0 flex-1 items-center">
            {settingsHeader}
          </div>,
          headerHost,
        )
      ) : (
        <div
          className="flex h-10 shrink-0 select-none items-center border-b border-stroke"
          data-tauri-drag-region="deep"
        >
          {IS_MAC && !besideRail ? <div className="w-[78px] shrink-0" /> : null}
          {settingsHeader}
          {IS_MAC ? null : <WindowControls />}
        </div>
      )}

      {section === "skills" ? (
        <SkillsPage
          key={cwd}
          cwd={cwd}
          header={
            <PageHeader
              title={settingsSectionLabel(section)}
              description={settingsSectionDescription(section)}
            />
          }
        />
      ) : (
        <RevealedSetting.Provider value={revealed}>
          <div
            ref={lockOverscroll}
            className="@container/settings min-h-0 flex-1 overflow-y-auto overscroll-none"
          >
            <div className="mx-auto w-full max-w-5xl px-5 py-6 pb-16 @min-[560px]/settings:px-8 @min-[560px]/settings:py-8">
              <PageHeader
                title={settingsSectionLabel(section)}
                description={settingsSectionDescription(section)}
              />
              {section === "general" ? (
                <GeneralPage onOpenWhatsNew={onOpenWhatsNew} />
              ) : null}
              {section === "connections" ? (
                <div className="flex flex-col gap-10">
                  <ConnectionsSettings />
                  <MobileSettings />
                </div>
              ) : null}
              {section === "appearance" ? (
                <AppearancePage appearance={appearance} />
              ) : null}
              {section === "chat" ? <ChatPage /> : null}
              {section === "keybindings" ? <KeybindingsPage /> : null}
              {section === "monos" ? <MonosPage /> : null}
              {section === "mcp" ? (
                <McpSettings cwd={cwd} recents={recents} />
              ) : null}
              {section === "providers" ? (
                <ProvidersPage cwd={cwd} recents={recents} />
              ) : null}
              {section === "worktrees" ? (
                <WorktreesPage
                  cwd={cwd}
                  recents={recents}
                  liveSessions={liveSessions}
                  onRemove={onRemoveWorktree}
                  onCheckRemove={onCheckWorktreeRemoval}
                  onDeleteSessions={onDeleteWorktreeSessions}
                />
              ) : null}
              {section === "inbox" ? (
                <InboxPage
                  cwd={cwd}
                  recents={recents}
                  notificationProjectPath={notificationProjectPath}
                  notificationSettingsRequest={notificationSettingsRequest}
                />
              ) : null}
              {section === "archive" ? (
                <ArchivePage
                  cwd={cwd}
                  sessions={sessions}
                  onOpenSession={onOpenSession}
                  onArchiveSession={onArchiveSession}
                  onDeleteSession={onDeleteSession}
                  onRestoreProject={onRestoreProject}
                  onDeleteProject={onDeleteProject}
                />
              ) : null}
            </div>
          </div>
        </RevealedSetting.Provider>
      )}
    </div>
  );
}

/** Jumps to any setting by name, including ones on another page. */
function SettingsSearch({
  onReveal,
}: {
  onReveal: (section: SettingsSectionId, settingId: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const t = useT();
  const insetLayout = useSyncExternalStore(
    subscribeInsetLayout,
    loadInsetLayout,
    () => INSET_LAYOUT_DEFAULT,
  );
  const results = useMemo(
    () =>
      searchSettings(
        query,
        undefined,
        insetLayout
          ? INSET_LAYOUT_HIDDEN_SETTINGS
          : CLASSIC_LAYOUT_HIDDEN_SETTINGS,
      ),
    [query, insetLayout],
  );
  const open = query.trim().length > 0;

  useEffect(() => setActive(0), [query]);

  const go = (result: SettingsSearchResult | undefined) => {
    if (!result) return;
    onReveal(result.section, result.settingId);
    setQuery("");
    input.current?.blur();
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(results.length - 1, index + 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  };

  return (
    <div ref={root} className="relative shrink-0">
      <label className="flex h-7 w-48 items-center gap-2 rounded-md border border-content/10 px-2 text-content/45 focus-within:border-content/20">
        <Search className="size-3.5 shrink-0" strokeWidth={1.75} />
        <input
          ref={input}
          role="combobox"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t("settings.search.placeholder")}
          aria-label={t("settings.search.inputLabel")}
          aria-expanded={open}
          aria-controls={listId}
          spellCheck={false}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-[12px] text-content outline-none placeholder:text-content/35"
        />
        {query ? (
          <button
            type="button"
            aria-label={t("settings.search.clear")}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setQuery("");
              input.current?.focus();
            }}
            className="grid size-4 shrink-0 place-items-center rounded text-content/45 hover:text-content"
          >
            <X className="size-3" strokeWidth={2} />
          </button>
        ) : null}
      </label>
      {open ? (
        <Popover
          anchor={root}
          side="bottom"
          align="end"
          width={300}
          maxHeight={320}
          onDismiss={(reason) => {
            setQuery("");
            if (reason === "escape") input.current?.focus();
          }}
          id={listId}
          role="listbox"
          aria-label={t("settings.search.resultsLabel")}
          className="overflow-y-auto overscroll-contain p-1"
        >
          {results.length === 0 ? (
            <p className="px-2 py-1.5 text-[12px] text-content/45">
              {t("settings.search.empty")}
            </p>
          ) : (
            results.map((result, index) => (
              <button
                key={`${result.section}:${result.settingId ?? "*"}`}
                type="button"
                role="option"
                aria-selected={index === active}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => go(result)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] ${
                  index === active
                    ? "bg-selection text-content"
                    : "text-content hover:bg-content/5"
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{result.label}</span>
                <span className="shrink-0 text-[11px] text-content/40">
                  {result.settingId
                    ? result.sectionLabel
                    : t("settings.search.pageLabel")}
                </span>
              </button>
            ))
          )}
        </Popover>
      ) : null}
    </div>
  );
}

function GeneralPage({
  onOpenWhatsNew,
}: {
  onOpenWhatsNew: (version: string) => void;
}) {
  const t = useT();
  const [soundsEnabled, setSoundsEnabled] = useState(loadSoundsEnabled);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    loadNotificationsEnabled,
  );
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>(cachedNotificationPermission);
  const [notesEnabled, setNotesEnabled] = useState(loadNotesEnabled);
  const [liveAgentsEnabled, setLiveAgentsEnabled] = useState(
    loadLiveAgentsEnabled,
  );
  const [fileTabMode, setFileTabMode] = useState<FileTabMode>(loadFileTabMode);
  const [tabAnimationsEnabled, setTabAnimationsEnabled] = useState(
    loadTabAnimationsEnabled,
  );
  const [closeToTray, setCloseToTray] = useState(loadCloseToTray);
  const [quickComposerEnabled, setQuickComposerEnabled] = useState(
    loadQuickComposerEnabled,
  );
  const [quickComposerError, setQuickComposerError] = useState<string | null>(
    null,
  );

  // The user may flip the switch in System Settings and come back: re-read
  // the OS state whenever the window regains focus while the toggle is on.
  useEffect(() => {
    if (!notificationsEnabled) return;
    const refresh = () => {
      void probeNotificationPermission().then(setNotificationPermission);
    };
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [notificationsEnabled]);

  const onSoundsEnabled = (next: boolean) => {
    saveSoundsEnabled(next);
    setSoundsEnabled(next);
  };

  const onNotificationsEnabled = (next: boolean) => {
    saveNotificationsEnabled(next);
    setNotificationsEnabled(next);
    if (!next) return;
    void requestNotificationPermission().then(setNotificationPermission);
  };

  const onNotesEnabled = (next: boolean) => {
    saveNotesEnabled(next);
    setNotesEnabled(next);
  };

  const onQuickComposerEnabled = (next: boolean) => {
    saveQuickComposerEnabled(next);
    setQuickComposerEnabled(next);
    setQuickComposerError(null);
    void setQuickComposerShortcut(next).catch((error: unknown) => {
      // Another app already owns the combination. Leave the switch where the
      // user put it so the next launch tries again, but say why it is dead.
      setQuickComposerError(String(error));
    });
  };

  const onLiveAgentsEnabled = (next: boolean) => {
    saveLiveAgentsEnabled(next);
    setLiveAgentsEnabled(next);
  };

  const onFileTabMode = (next: FileTabMode) => {
    saveFileTabMode(next);
    setFileTabMode(next);
  };

  const onTabAnimationsEnabled = (next: boolean) => {
    saveTabAnimationsEnabled(next);
    setTabAnimationsEnabled(next);
  };

  const onCloseToTray = (next: boolean) => {
    saveCloseToTray(next);
    setCloseToTray(next);
  };

  return (
    <>
      <Group
        title={t("settings.general.alertsTitle")}
        description={t("settings.general.alertsDescription")}
      >
        <Row
          id="sounds"
          label={t("settings.general.soundsLabel")}
          description={t("settings.general.soundsDescription")}
        >
          <Toggle
            label={t("settings.general.soundsLabel")}
            on={soundsEnabled}
            onChange={onSoundsEnabled}
          />
        </Row>
        <Row
          id="notifications"
          label={t("settings.general.notificationsLabel")}
          description={t("settings.general.notificationsDescription")}
        >
          {notificationsEnabled && notificationPermission === "denied" ? (
            <NotificationsBlocked />
          ) : null}
          {notificationsEnabled && notificationPermission === "unsupported" ? (
            <span className="text-[12px] text-content/45">
              {t("settings.general.notificationsUnsupported")}
            </span>
          ) : null}
          <Toggle
            label={t("settings.general.notificationsLabel")}
            on={notificationsEnabled}
            onChange={onNotificationsEnabled}
          />
        </Row>
      </Group>

      <Group
        title={t("settings.general.workspaceTitle")}
        description={t("settings.general.workspaceDescription")}
      >
        <Row
          id="file-tabs"
          label={t("settings.general.fileTabsLabel")}
          description={t("settings.general.fileTabsDescription")}
        >
          <Segmented
            label={t("settings.general.fileTabsLabel")}
            value={fileTabMode}
            options={[
              { value: "pane", label: t("settings.general.fileTabsPane") },
              {
                value: "workspace",
                label: t("settings.general.fileTabsWorkspace"),
              },
            ]}
            onChange={onFileTabMode}
          />
        </Row>
        <Row
          id="tab-animations"
          label={t("settings.general.tabAnimationsLabel")}
          description={t("settings.general.tabAnimationsDescription")}
        >
          <Toggle
            label={t("settings.general.tabAnimationsLabel")}
            on={tabAnimationsEnabled}
            onChange={onTabAnimationsEnabled}
          />
        </Row>
        <Row
          id="notes"
          label={t("settings.general.notesLabel")}
          description={t("settings.general.notesDescription")}
        >
          <Toggle
            label={t("settings.general.notesLabel")}
            on={notesEnabled}
            onChange={onNotesEnabled}
          />
        </Row>
        {IS_MAC && (
          <Row
            id="quick-composer"
            label={t("settings.general.quickComposerLabel")}
            description={t("settings.general.quickComposerDescription", {
              shortcut: quickComposerShortcutLabel(loadQuickComposerShortcut()),
            })}
          >
            {quickComposerError ? (
              <span className="text-[12px] text-content/45">
                {quickComposerError}
              </span>
            ) : null}
            <Toggle
              label={t("settings.general.quickComposerLabel")}
              on={quickComposerEnabled}
              onChange={onQuickComposerEnabled}
            />
          </Row>
        )}
        <Row
          id="working-agents"
          label={t("settings.general.workingAgentsLabel")}
          description={t("settings.general.workingAgentsDescription")}
        >
          <Toggle
            label={t("settings.general.workingAgentsLabel")}
            on={liveAgentsEnabled}
            onChange={onLiveAgentsEnabled}
          />
        </Row>
        {IS_WIN && (
          <Row
            id="close-to-tray"
            label={t("settings.general.closeToTrayLabel")}
            description={t("settings.general.closeToTrayDescription")}
          >
            <Toggle
              label={t("settings.general.closeToTrayLabel")}
              on={closeToTray}
              onChange={onCloseToTray}
            />
          </Row>
        )}
      </Group>

      <Group title={t("settings.general.aboutTitle")}>
        <UpdateRow onOpenWhatsNew={onOpenWhatsNew} />
      </Group>
    </>
  );
}

function ChatPage() {
  const t = useT();
  const pacedReveal = usePacedReveal();
  const [transcriptLayout, setTranscriptLayout] =
    useState<TranscriptLayout>(loadTranscriptLayout);
  const [transcriptAnchor, setTranscriptAnchor] =
    useState(loadTranscriptAnchor);
  const [followUpBehavior, setFollowUpBehavior] =
    useState<FollowUpBehavior>(loadFollowUpBehavior);
  const [modelControls, setModelControls] =
    useState<ModelControls>(loadModelControls);
  const [diffViewer, setDiffViewer] = useState<DiffViewer>(loadDiffViewer);
  const [formatOnSave, setFormatOnSave] = useState(loadFormatOnSave);
  const [composerRunner, setComposerRunner] = useState(loadComposerRunner);
  const composerAutocorrect = useComposerAutocorrect();
  const [gridArcadeEnabled, setGridArcadeEnabled] = useState(
    loadGridArcadeEnabled,
  );

  useEffect(() => {
    const onAnchor = (event: Event) => {
      setTranscriptAnchor((event as CustomEvent<boolean>).detail === true);
    };
    window.addEventListener(TRANSCRIPT_ANCHOR_CHANGE_EVENT, onAnchor);
    return () => {
      window.removeEventListener(TRANSCRIPT_ANCHOR_CHANGE_EVENT, onAnchor);
    };
  }, []);

  const onTranscriptLayout = (next: TranscriptLayout) => {
    saveTranscriptLayout(next);
    setTranscriptLayout(next);
  };

  const onTranscriptAnchor = (next: boolean) => {
    saveTranscriptAnchor(next);
    setTranscriptAnchor(next);
  };

  const onFollowUpBehavior = (next: FollowUpBehavior) => {
    saveFollowUpBehavior(next);
    setFollowUpBehavior(next);
  };

  const onModelControls = (next: ModelControls) => {
    saveModelControls(next);
    setModelControls(next);
  };

  const onDiffViewer = (next: DiffViewer) => {
    saveDiffViewer(next);
    setDiffViewer(next);
  };

  const onFormatOnSave = (next: boolean) => {
    saveFormatOnSave(next);
    setFormatOnSave(next);
  };

  const onComposerRunner = (next: boolean) => {
    saveComposerRunner(next);
    setComposerRunner(next);
  };

  const onGridArcadeEnabled = (next: boolean) => {
    saveGridArcadeEnabled(next);
    setGridArcadeEnabled(next);
  };

  return (
    <>
      <Group
        title={t("settings.chat.transcriptGroup.title")}
        description={t("settings.chat.transcriptGroup.description")}
      >
        <Row
          id="transcript-layout"
          label={t("settings.chat.transcriptLayout.label")}
          description={t("settings.chat.transcriptLayout.description")}
        >
          <Segmented
            label={t("settings.chat.transcriptLayout.label")}
            value={transcriptLayout}
            options={[
              {
                value: "full",
                label: t("settings.chat.transcriptLayout.full"),
              },
              {
                value: "chat",
                label: t("settings.chat.transcriptLayout.chat"),
              },
            ]}
            onChange={onTranscriptLayout}
          />
        </Row>
        <Row
          id="anchor-prompts"
          label={t("settings.chat.anchorPrompts.label")}
          description={t("settings.chat.anchorPrompts.description")}
        >
          <Toggle
            label={t("settings.chat.anchorPrompts.label")}
            on={transcriptAnchor}
            onChange={onTranscriptAnchor}
          />
        </Row>
        <Row
          id="paced-reveal"
          label={t("settings.chat.smoothReveal.label")}
          description={t("settings.chat.smoothReveal.description")}
        >
          <Toggle
            label={t("settings.chat.smoothReveal.label")}
            on={pacedReveal}
            onChange={savePacedReveal}
          />
        </Row>
      </Group>

      <Group
        title={t("settings.chat.composerGroup.title")}
        description={t("settings.chat.composerGroup.description")}
      >
        <Row
          id="follow-up"
          label={t("settings.chat.followUp.label")}
          description={t("settings.chat.followUp.description")}
        >
          <Segmented
            label={t("settings.chat.followUp.label")}
            value={followUpBehavior}
            options={[
              { value: "queue", label: t("settings.chat.followUp.queue") },
              { value: "steer", label: t("settings.chat.followUp.steer") },
            ]}
            onChange={onFollowUpBehavior}
          />
        </Row>
        <Row
          id="model-controls"
          label={t("settings.chat.modelControls.label")}
          description={t("settings.chat.modelControls.description")}
        >
          <Segmented
            label={t("settings.chat.modelControls.label")}
            value={modelControls}
            options={[
              { value: "menu", label: t("settings.chat.modelControls.menu") },
              {
                value: "beside",
                label: t("settings.chat.modelControls.beside"),
              },
            ]}
            onChange={onModelControls}
          />
        </Row>
        <Row
          id="composer-autocorrect"
          label={t("settings.chat.autocorrect.label")}
          description={t("settings.chat.autocorrect.description")}
        >
          <Toggle
            label={t("settings.chat.autocorrect.label")}
            on={composerAutocorrect}
            onChange={saveComposerAutocorrect}
          />
        </Row>
      </Group>

      <Group
        title={t("settings.chat.editorGroup.title")}
        description={t("settings.chat.editorGroup.description")}
      >
        <Row
          id="format-on-save"
          label={t("settings.chat.formatOnSave.label")}
          description={t("settings.chat.formatOnSave.description")}
        >
          <Toggle
            label={t("settings.chat.formatOnSave.label")}
            on={formatOnSave}
            onChange={onFormatOnSave}
          />
        </Row>
      </Group>

      <Group
        title={t("settings.chat.reviewGroup.title")}
        description={t("settings.chat.reviewGroup.description")}
      >
        <Row
          id="diff-view"
          label={t("settings.chat.diffView.label")}
          description={t("settings.chat.diffView.description")}
        >
          <Segmented
            label={t("settings.chat.diffView.label")}
            value={diffViewer}
            options={[
              { value: "editor", label: t("settings.chat.diffView.editor") },
              { value: "unified", label: t("settings.chat.diffView.unified") },
            ]}
            onChange={onDiffViewer}
          />
        </Row>
      </Group>

      <Group
        title={t("settings.chat.extrasGroup.title")}
        description={t("settings.chat.extrasGroup.description")}
      >
        <Row
          id="composer-mascot"
          label={t("settings.chat.mascot.label")}
          description={t("settings.chat.mascot.description")}
        >
          <Toggle
            label={t("settings.chat.mascot.label")}
            on={composerRunner}
            onChange={onComposerRunner}
          />
        </Row>
        <Row
          id="empty-session-games"
          label={t("settings.chat.emptyGames.label")}
          description={t("settings.chat.emptyGames.description")}
        >
          <Toggle
            label={t("settings.chat.emptyGames.label")}
            on={gridArcadeEnabled}
            onChange={onGridArcadeEnabled}
          />
        </Row>
      </Group>
    </>
  );
}

function InboxPage({
  cwd,
  recents,
  notificationProjectPath,
  notificationSettingsRequest,
}: {
  cwd: string;
  recents?: RecentProject[];
  notificationProjectPath?: string | null;
  notificationSettingsRequest?: number;
}) {
  const t = useT();
  const revealed = useContext(RevealedSetting);
  return (
    <>
      <div
        id={settingDomId("project-notifications")}
        data-setting-id="project-notifications"
      >
        <ProjectNotificationSettings
          cwd={cwd}
          recents={recents}
          notificationProjectPath={notificationProjectPath}
          notificationSettingsRequest={notificationSettingsRequest}
          highlighted={revealed === "project-notifications"}
        />
      </div>
      <Group
        id="github"
        title={
          <span className="flex items-center gap-2">
            <InboxProviderMark provider="github" className="size-4 shrink-0" />
            GitHub
          </span>
        }
        description={t("settings.inbox.github.description")}
      >
        <GithubSettings />
      </Group>

      <Group
        id="gitlab"
        title={
          <span className="flex items-center gap-2">
            <InboxProviderMark provider="gitlab" className="size-4 shrink-0" />
            GitLab
          </span>
        }
        description={t("settings.inbox.gitlab.description")}
      >
        <GitlabSettings />
      </Group>

      <Group
        id="azuredevops"
        title={
          <span className="flex items-center gap-2">
            <InboxProviderMark
              provider="azuredevops"
              className="size-4 shrink-0"
            />
            ADO
          </span>
        }
        description={t("settings.inbox.azure.description")}
      >
        <AzureDevOpsSettings />
      </Group>

      <Group
        id="jira"
        title={
          <span className="flex items-center gap-2">
            <InboxProviderMark provider="jira" className="size-4 shrink-0" />
            Jira
          </span>
        }
        description={t("settings.inbox.jira.description")}
      >
        <JiraSettings />
      </Group>

      <Group
        id="linear"
        title={
          <span className="flex items-center gap-2">
            <InboxProviderMark provider="linear" className="size-4 shrink-0" />
            Linear
          </span>
        }
        description={t("settings.inbox.linear.description")}
      >
        <LinearSettings />
      </Group>
    </>
  );
}

function GithubSettings() {
  const t = useT();
  const [status, setStatus] = useState<GithubStatus | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const request = useRef(0);

  const checkStatus = useCallback(async () => {
    const generation = ++request.current;
    setChecking(true);
    setError(null);
    try {
      const next = await githubStatus();
      if (generation === request.current) setStatus(next);
    } catch (err: unknown) {
      if (generation === request.current) {
        setError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      if (generation === request.current) setChecking(false);
    }
  }, []);

  useEffect(() => {
    void checkStatus();
    return () => {
      request.current += 1;
    };
  }, [checkStatus]);

  const description = status?.connected
    ? t("settings.inbox.github.connectedHelp")
    : status?.installed
      ? t("settings.inbox.github.signInHelp")
      : t("settings.inbox.github.installHelp");
  const label = checking
    ? t("settings.inbox.github.checking")
    : status?.connected
      ? t("settings.inbox.github.connected")
      : status?.installed
        ? t("settings.inbox.github.signInRequired")
        : t("settings.inbox.github.notInstalled");

  return (
    <>
      <Row
        label={t("settings.inbox.github.connection")}
        description={description}
      >
        <span className="text-[12px] text-content/50">{label}</span>
        {!checking && !status?.installed ? (
          <SecondaryButton
            onClick={() => {
              void openUrl("https://cli.github.com/").catch(() => {});
            }}
          >
            {t("settings.inbox.github.installationGuide")}
          </SecondaryButton>
        ) : null}
        <SecondaryButton onClick={() => void checkStatus()} disabled={checking}>
          {checking
            ? t("settings.inbox.github.checking")
            : t("settings.inbox.github.checkAgain")}
        </SecondaryButton>
      </Row>
      {error ? (
        <p className="border-b border-content/5 px-4 pb-3 text-[12px] text-red-400/90 last:border-b-0">
          {error}
        </p>
      ) : null}
    </>
  );
}

function GitlabSettings() {
  const t = useT();
  const [url, setUrl] = useState("https://gitlab.com");
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void gitlabConnected()
      .then((status) => {
        if (cancelled) return;
        setConnected(status.connected);
        setUrl(status.url);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSave = async () => {
    if (!token.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const status = await saveGitlabConfig(url, token);
      setUrl(status.url);
      setToken("");
      setConnected(status.connected);
      clearInboxCache();
    } catch (err: unknown) {
      setConnected(false);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const onDisconnect = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const status = await disconnectGitlab(url);
      setConnected(false);
      setUrl(status.url);
      clearInboxCache();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Row
        label={t("settings.inbox.gitlab.connection")}
        description={t("settings.inbox.gitlab.connectionHelp")}
      >
        {connected ? (
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
            <span className="max-w-56 truncate text-[12px] text-content/50">
              {url}
            </span>
            <SecondaryButton
              onClick={() => void onDisconnect()}
              disabled={busy}
            >
              {t("settings.inbox.gitlab.disconnect")}
            </SecondaryButton>
          </div>
        ) : (
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
            <label className="flex h-7 w-52 max-w-full shrink-0 items-center rounded-md border border-content/10 px-2 focus-within:border-content/20">
              <input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://gitlab.com"
                aria-label={t("settings.inbox.gitlab.urlLabel")}
                autoComplete="url"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[12px] text-content outline-none placeholder:text-content/35"
              />
            </label>
            <label className="flex h-7 w-52 max-w-full shrink-0 items-center rounded-md border border-content/10 px-2 focus-within:border-content/20">
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void onSave();
                }}
                placeholder="glpat-…"
                aria-label={t("settings.inbox.gitlab.tokenLabel")}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[12px] text-content outline-none placeholder:text-content/35"
              />
            </label>
            <SecondaryButton
              onClick={() => void onSave()}
              disabled={busy || !token.trim()}
            >
              {busy
                ? t("settings.inbox.gitlab.saving")
                : t("settings.inbox.gitlab.connect")}
            </SecondaryButton>
          </div>
        )}
      </Row>
      {error ? (
        <p className="border-b border-content/5 px-4 pb-3 text-[12px] text-red-400/90 last:border-b-0">
          {error}
        </p>
      ) : null}
    </>
  );
}

function AzureDevOpsSettings() {
  const t = useT();
  const [url, setUrl] = useState("https://dev.azure.com/myorg");
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void azureDevOpsConnected()
      .then((status) => {
        if (cancelled) return;
        setConnected(status.connected);
        if (status.url) setUrl(status.url);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSave = async () => {
    if (!token.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const status = await saveAzureDevOpsConfig(url, token);
      setUrl(status.url);
      setToken("");
      setConnected(status.connected);
      clearInboxCache();
    } catch (err: unknown) {
      setConnected(false);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const onDisconnect = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const status = await disconnectAzureDevOps(url);
      setConnected(false);
      setUrl(status.url || url);
      clearInboxCache();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Row
        label={t("settings.inbox.azure.connection")}
        description={t("settings.inbox.azure.connectionHelp")}
      >
        {connected ? (
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
            <span className="max-w-56 truncate text-[12px] text-content/50">
              {url}
            </span>
            <SecondaryButton
              onClick={() => void onDisconnect()}
              disabled={busy}
            >
              {t("settings.inbox.azure.disconnect")}
            </SecondaryButton>
          </div>
        ) : (
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
            <label className="flex h-7 w-52 max-w-full shrink-0 items-center rounded-md border border-content/10 px-2 focus-within:border-content/20">
              <input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://dev.azure.com/myorg"
                aria-label={t("settings.inbox.azure.orgUrlLabel")}
                autoComplete="url"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[12px] text-content outline-none placeholder:text-content/35"
              />
            </label>
            <label className="flex h-7 w-52 max-w-full shrink-0 items-center rounded-md border border-content/10 px-2 focus-within:border-content/20">
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void onSave();
                }}
                placeholder="PAT…"
                aria-label={t("settings.inbox.azure.tokenLabel")}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[12px] text-content outline-none placeholder:text-content/35"
              />
            </label>
            <SecondaryButton
              onClick={() => void onSave()}
              disabled={busy || !token.trim()}
            >
              {busy
                ? t("settings.inbox.azure.saving")
                : t("settings.inbox.azure.connect")}
            </SecondaryButton>
          </div>
        )}
      </Row>
      {error ? (
        <p className="border-b border-content/5 px-4 pb-3 text-[12px] text-red-400/90 last:border-b-0">
          {error}
        </p>
      ) : null}
    </>
  );
}

function LinearSettings() {
  const t = useT();
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<LinearTeam[]>([]);
  const [hiddenTeamIds, setHiddenTeamIds] = useState(loadHiddenLinearTeamIds);

  const loadTeams = useCallback(async () => {
    try {
      const next = await listLinearTeams();
      setTeams(next);
    } catch {
      setTeams([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void linearConnected()
      .then((status) => {
        if (cancelled) return;
        setConnected(status.connected);
        if (status.connected) void loadTeams();
      })
      .catch(() => {
        if (!cancelled) setConnected(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadTeams]);

  // The inbox filter menu writes the same list, so follow it while both are mounted.
  useEffect(() => {
    const onChange = () => setHiddenTeamIds(loadHiddenLinearTeamIds());
    window.addEventListener(LINEAR_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(LINEAR_CHANGE_EVENT, onChange);
  }, []);

  const onSave = async () => {
    if (!token.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await saveLinearToken(token);
      setToken("");
      setConnected(true);
      clearInboxCache();
      notifyLinearChange();
      await loadTeams();
    } catch (err: unknown) {
      setConnected(false);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const onDisconnect = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await disconnectLinear();
      setConnected(false);
      setTeams([]);
      clearInboxCache();
      notifyLinearChange();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const toggleTeam = (id: string) => {
    const next = new Set(hiddenTeamIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    const ids = [...next];
    setHiddenTeamIds(ids);
    saveHiddenLinearTeamIds(ids);
    clearInboxCache();
  };

  return (
    <>
      <Row
        label={t("settings.inbox.linear.apiKey")}
        description={t("settings.inbox.linear.apiKeyHelp")}
      >
        {connected ? (
          <SecondaryButton onClick={() => void onDisconnect()} disabled={busy}>
            {t("settings.inbox.linear.disconnect")}
          </SecondaryButton>
        ) : (
          <div className="flex max-w-full flex-wrap items-center gap-2">
            <label className="flex h-7 w-52 max-w-full shrink-0 items-center rounded-md border border-content/10 px-2 focus-within:border-content/20">
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void onSave();
                }}
                placeholder="lin_api_…"
                aria-label={t("settings.inbox.linear.apiKeyLabel")}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[12px] text-content outline-none placeholder:text-content/35"
              />
            </label>
            <SecondaryButton
              onClick={() => void onSave()}
              disabled={busy || !token.trim()}
            >
              {busy
                ? t("settings.inbox.linear.saving")
                : t("settings.inbox.linear.connect")}
            </SecondaryButton>
          </div>
        )}
      </Row>
      {error ? (
        <p className="border-b border-content/5 px-4 pb-3 text-[12px] text-red-400/90 last:border-b-0">
          {error}
        </p>
      ) : null}
      {connected && teams.length > 0 ? (
        <div className="border-b border-content/5 px-4 py-3.5 last:border-b-0">
          <div className="text-[13px] font-medium text-content">
            {t("settings.inbox.linear.teams")}
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-content/45">
            {t("settings.inbox.linear.teamsHelp")}
          </p>
          <div className="-mx-2 mt-2 flex flex-col gap-0.5">
            {teams.map((team) => {
              const checked = !hiddenTeamIds.includes(team.id);
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => toggleTeam(team.id)}
                  className="flex h-7 items-center gap-2 rounded-md px-2 text-left text-[13px] text-content hover:bg-content/5"
                >
                  <span className="min-w-0 flex-1 truncate">
                    {team.name}
                    {team.key ? (
                      <span className="ml-1.5 text-content/40">{team.key}</span>
                    ) : null}
                  </span>
                  {checked ? (
                    <Check className="size-3.5 shrink-0" strokeWidth={2.25} />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

function UpdateRow({
  onOpenWhatsNew,
}: {
  onOpenWhatsNew: (version: string) => void;
}) {
  const [snapshot, setSnapshot] = useState<UpdaterSnapshot>({
    phase: "idle",
    currentVersion: "…",
  });
  const t = useT();

  useEffect(() => {
    let cancelled = false;
    void Promise.all([readAppVersion(), packageManagedInstall()]).then(
      ([currentVersion, packageManaged]) => {
        if (cancelled) return;
        setSnapshot((current) => ({
          ...current,
          currentVersion,
          packageManaged: packageManaged ?? undefined,
        }));
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const busy =
    snapshot.phase === "checking" || snapshot.phase === "downloading";
  const hasUpdate = snapshot.phase === "available";

  const onClick = async () => {
    if (busy) return;
    if (hasUpdate) {
      await installPendingUpdate(setSnapshot);
      return;
    }
    await runUpdateFlow(true, setSnapshot);
  };

  const status =
    snapshot.phase === "available"
      ? t("settings.general.updateAvailable", {
          version: String(snapshot.availableVersion),
        })
      : snapshot.phase === "downloading"
        ? snapshot.progress != null
          ? t("settings.general.updateDownloadingPercent", {
              percent: snapshot.progress,
            })
          : t("settings.general.updateDownloading")
        : snapshot.phase === "checking"
          ? t("settings.general.updateChecking")
          : snapshot.phase === "current"
            ? t("settings.general.updateCurrent")
            : snapshot.phase === "error"
              ? (snapshot.error ?? t("settings.general.updateFailed"))
              : snapshot.packageManaged
                ? packageManagerHint(snapshot.packageManaged, t)
                : t("settings.general.updateSelfManaged");

  return (
    <Row
      id="update"
      label={
        <span className="flex items-baseline gap-2">
          {t("settings.general.version")}
          <span className="font-mono text-[12px] text-content/45">
            {snapshot.currentVersion}
          </span>
        </span>
      }
      description={status}
    >
      <div className="flex items-center gap-2">
        <SecondaryButton
          onClick={() => onOpenWhatsNew(snapshot.currentVersion)}
          disabled={snapshot.currentVersion === "…"}
        >
          {t("settings.general.whatsNew")}
        </SecondaryButton>
        <SecondaryButton onClick={() => void onClick()} disabled={busy}>
          {busy ? (
            <Loader className="size-3.5 animate-spin" aria-hidden />
          ) : hasUpdate ? (
            <ArrowDownCircle className="size-3.5 text-accent" aria-hidden />
          ) : (
            <RefreshCw className="size-3.5" strokeWidth={1.75} aria-hidden />
          )}
          {hasUpdate
            ? t("settings.general.updateDownload")
            : t("settings.general.updateCheck")}
        </SecondaryButton>
      </div>
    </Row>
  );
}

type AppearanceSettings = ReturnType<typeof useAppearanceSettings>;

function useAppearanceSettings(
  controlledCollapsedProjectRailMode?: CollapsedProjectRailMode,
  onControlledCollapsedProjectRailModeChange?: (
    mode: CollapsedProjectRailMode,
  ) => void,
) {
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(loadThemePreference);
  const [accentColor, setAccentColor] = useState(loadAccentColor);
  const [workspaceTheme, setWorkspaceTheme] =
    useState<WorkspaceThemeId>(loadWorkspaceTheme);
  const [opacity, setOpacity] = useState(loadSidebarOpacity);
  const [blur, setBlur] = useState(loadSidebarBlur);
  const [themeHue, setThemeHue] = useState(loadThemeHue);
  const [themeSaturation, setThemeSaturation] = useState(loadThemeSaturation);
  const [themeDarkLightness, setThemeDarkLightness] = useState(
    loadThemeDarkLightness,
  );
  const [bodyGlass, setBodyGlass] = useState(loadBodyGlass);
  const [insetGlass, setInsetGlass] = useState(loadInsetGlass);
  const insetLayout = useSyncExternalStore(
    subscribeInsetLayout,
    loadInsetLayout,
    () => INSET_LAYOUT_DEFAULT,
  );
  const [showExcludedFiles, setShowExcludedFiles] = useState(
    loadShowExcludedFiles,
  );
  const [chatBackgroundPath, setChatBackgroundPath] = useState(
    loadChatBackgroundPath,
  );
  const [chatBackgroundEmptyOpacity, setChatBackgroundEmptyOpacity] = useState(
    loadChatBackgroundEmptyOpacity,
  );
  const [chatBackgroundSessionOpacity, setChatBackgroundSessionOpacity] =
    useState(loadChatBackgroundSessionOpacity);
  const [chatBackgroundScope, setChatBackgroundScope] =
    useState<ChatBackgroundScope>(loadChatBackgroundScope);
  const [diffPalette, setDiffPalette] = useState<DiffPalette>(loadDiffPalette);
  const [newThreadBackgroundEffect, setBackgroundEffect] =
    useState<NewThreadBackgroundEffect>(loadNewThreadBackgroundEffect);
  const [chatBackgroundBusy, setChatBackgroundBusy] = useState(false);
  const [chatBackgroundError, setChatBackgroundError] = useState<string | null>(
    null,
  );
  const [uiScale, setUiScale] = useState(loadUiScale);
  const [storedCollapsedProjectRailMode, setStoredCollapsedProjectRailMode] =
    useState<CollapsedProjectRailMode>(loadCollapsedProjectRailMode);
  const collapsedProjectRailMode =
    controlledCollapsedProjectRailMode ?? storedCollapsedProjectRailMode;

  useEffect(() => subscribeUiScale(() => setUiScale(loadUiScale())), []);

  const onThemePreference = useCallback((next: ThemePreference) => {
    applyThemePreference(next);
    saveThemePreference(next);
    setThemePreference(next);
  }, []);

  const onAccentColor = useCallback((value: string | null) => {
    const next = applyAccentColor(value);
    saveAccentColor(next);
    setAccentColor(next);
  }, []);

  const onWorkspaceTheme = useCallback((value: WorkspaceThemeId) => {
    const next = applyWorkspaceTheme(value);
    saveWorkspaceTheme(next);
    setWorkspaceTheme(next);
  }, []);

  const onOpacity = useCallback((percent: number) => {
    const next = applySidebarOpacity(percent / 100);
    saveSidebarOpacity(next);
    setOpacity(next);
  }, []);

  const onBlur = useCallback((radius: number) => {
    const next = applySidebarBlur(radius);
    saveSidebarBlur(next);
    setBlur(next);
  }, []);

  const onTint = useCallback((hue: number, saturation: number) => {
    const next = applyThemeTint(hue, saturation);
    saveThemeHue(next.hue);
    saveThemeSaturation(next.saturation);
    setThemeHue(next.hue);
    setThemeSaturation(next.saturation);
  }, []);

  const onDarkLightness = useCallback((value: number) => {
    const next = applyThemeDarkLightness(value);
    saveThemeDarkLightness(next);
    setThemeDarkLightness(next);
  }, []);

  const onBodyGlass = useCallback((next: boolean) => {
    applyBodyGlass(next);
    saveBodyGlass(next);
    setBodyGlass(next);
    if (IS_LINUX) syncNativeGlass(isLightScheme() ? "light" : "dark");
  }, []);

  const onInsetLayout = useCallback((next: boolean) => {
    saveNewLayoutPromptDismissed(true);
    saveInsetLayout(next);
  }, []);

  const onInsetGlass = useCallback((next: boolean) => {
    saveInsetGlass(next);
    setInsetGlass(next);
    syncNativeGlass(isLightScheme() ? "light" : "dark");
  }, []);

  const onShowExcludedFiles = useCallback((next: boolean) => {
    saveShowExcludedFiles(next);
    setShowExcludedFiles(next);
  }, []);

  const onChooseChatBackground = useCallback(async () => {
    setChatBackgroundBusy(true);
    setChatBackgroundError(null);
    try {
      const path = await pickAndSaveChatBackground();
      if (!path) return;
      saveChatBackgroundPath(path);
      applyChatBackground(path);
      setChatBackgroundPath(path);
    } catch (error) {
      setChatBackgroundError(
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setChatBackgroundBusy(false);
    }
  }, []);

  const onClearChatBackground = useCallback(async () => {
    setChatBackgroundBusy(true);
    setChatBackgroundError(null);
    try {
      await removeChatBackground();
      saveChatBackgroundPath(null);
      applyChatBackground(null);
      setChatBackgroundPath(null);
    } catch (error) {
      setChatBackgroundError(
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setChatBackgroundBusy(false);
    }
  }, []);

  const onChatBackgroundEmptyOpacity = useCallback((percent: number) => {
    const next = applyChatBackgroundEmptyOpacity(percent / 100);
    saveChatBackgroundEmptyOpacity(next);
    setChatBackgroundEmptyOpacity(next);
  }, []);

  const onChatBackgroundSessionOpacity = useCallback((percent: number) => {
    const next = applyChatBackgroundSessionOpacity(percent / 100);
    saveChatBackgroundSessionOpacity(next);
    setChatBackgroundSessionOpacity(next);
  }, []);

  const onChatBackgroundScope = useCallback((next: ChatBackgroundScope) => {
    applyChatBackgroundScope(next);
    saveChatBackgroundScope(next);
    setChatBackgroundScope(next);
  }, []);

  const onDiffPalette = useCallback((next: DiffPalette) => {
    applyDiffPalette(next);
    saveDiffPalette(next);
    setDiffPalette(next);
  }, []);

  const onNewThreadBackgroundEffect = useCallback(
    (next: NewThreadBackgroundEffect) => {
      setNewThreadBackgroundEffect(next);
      setBackgroundEffect(next);
    },
    [],
  );

  const onUiScale = useCallback((percent: number) => {
    const next = saveUiScale(percent / 100);
    setUiScale(next);
    void applyUiScale(next);
  }, []);

  const onCollapsedProjectRailMode = useCallback(
    (next: CollapsedProjectRailMode) => {
      saveCollapsedProjectRailMode(next);
      setStoredCollapsedProjectRailMode(next);
      onControlledCollapsedProjectRailModeChange?.(next);
    },
    [onControlledCollapsedProjectRailModeChange],
  );

  const restoreDefaults = useCallback(() => {
    onThemePreference(THEME_PREFERENCE_DEFAULT);
    onAccentColor(ACCENT_COLOR_DEFAULT);
    onWorkspaceTheme(WORKSPACE_THEME_DEFAULT);
    onOpacity(Math.round(SIDEBAR_OPACITY_DEFAULT * 100));
    onBlur(SIDEBAR_BLUR_DEFAULT);
    onTint(THEME_HUE_DEFAULT, THEME_SATURATION_DEFAULT);
    onDarkLightness(THEME_DARK_LIGHTNESS_DEFAULT);
    onBodyGlass(BODY_GLASS_DEFAULT);
    onInsetLayout(INSET_LAYOUT_DEFAULT);
    onInsetGlass(INSET_GLASS_DEFAULT);
    onShowExcludedFiles(SHOW_EXCLUDED_FILES_DEFAULT);
    onChatBackgroundEmptyOpacity(
      Math.round(CHAT_BACKGROUND_EMPTY_OPACITY_DEFAULT * 100),
    );
    onChatBackgroundSessionOpacity(
      Math.round(CHAT_BACKGROUND_SESSION_OPACITY_DEFAULT * 100),
    );
    onChatBackgroundScope(CHAT_BACKGROUND_SCOPE_DEFAULT);
    onDiffPalette(DIFF_PALETTE_DEFAULT);
    onNewThreadBackgroundEffect(NEW_THREAD_BACKGROUND_EFFECT_DEFAULT);
    if (chatBackgroundPath) void onClearChatBackground();
    onUiScale(Math.round(UI_SCALE_DEFAULT * 100));
    onCollapsedProjectRailMode(COLLAPSED_PROJECT_RAIL_MODE_DEFAULT);
  }, [
    chatBackgroundPath,
    onBlur,
    onBodyGlass,
    onInsetLayout,
    onInsetGlass,
    onChatBackgroundEmptyOpacity,
    onChatBackgroundSessionOpacity,
    onChatBackgroundScope,
    onDiffPalette,
    onNewThreadBackgroundEffect,
    onClearChatBackground,
    onAccentColor,
    onWorkspaceTheme,
    onShowExcludedFiles,
    onThemePreference,
    onOpacity,
    onTint,
    onDarkLightness,
    onUiScale,
    onCollapsedProjectRailMode,
  ]);

  return {
    themePreference,
    accentColor,
    workspaceTheme,
    opacity,
    blur,
    themeHue,
    themeSaturation,
    themeDarkLightness,
    bodyGlass,
    insetGlass,
    insetLayout,
    showExcludedFiles,
    chatBackgroundPath,
    chatBackgroundEmptyOpacity,
    chatBackgroundSessionOpacity,
    chatBackgroundScope,
    diffPalette,
    newThreadBackgroundEffect,
    chatBackgroundBusy,
    chatBackgroundError,
    uiScale,
    collapsedProjectRailMode,
    onThemePreference,
    onAccentColor,
    onWorkspaceTheme,
    onOpacity,
    onBlur,
    onTint,
    onDarkLightness,
    onBodyGlass,
    onInsetLayout,
    onInsetGlass,
    onShowExcludedFiles,
    onChooseChatBackground,
    onClearChatBackground,
    onChatBackgroundEmptyOpacity,
    onChatBackgroundSessionOpacity,
    onChatBackgroundScope,
    onDiffPalette,
    onNewThreadBackgroundEffect,
    onUiScale,
    onCollapsedProjectRailMode,
    restoreDefaults,
  };
}

function AppearancePage({ appearance }: { appearance: AppearanceSettings }) {
  const percent = Math.round(appearance.opacity * 100);
  const glassDisabled = useColorScheme() === "light";
  // The inset workspace takes its colours from the workspace theme and has a
  // fixed tint and blur, so the tint and translucency groups only belong to
  // the classic layout. Its one glass switch lives with the theme instead.
  const inset = appearance.insetLayout;
  const t = useT();
  const locale = useLocale();

  return (
    <>
      <Group
        title={t("settings.language.title")}
        description={t("settings.language.description")}
      >
        <Row
          id="language"
          label={t("settings.language.label")}
          description={t("settings.language.rowDescription")}
        >
          <Segmented
            label={t("settings.language.label")}
            value={locale}
            options={LOCALE_OPTIONS}
            onChange={(value) => {
              if (isLocale(value)) setLocale(value);
            }}
            optionIdPrefix="language"
          />
        </Row>
      </Group>

      <Group
        title={t("settings.theme.title")}
        description={
          inset
            ? t("settings.theme.descriptionInset")
            : t("settings.theme.descriptionClassic")
        }
      >
        <Row
          id="theme"
          label={t("settings.theme.title")}
          description={t("settings.theme.description")}
        >
          <Segmented
            label={t("settings.theme.title")}
            value={appearance.themePreference}
            options={[
              { value: "system", label: t("settings.theme.system") },
              { value: "dark", label: t("settings.theme.dark") },
              { value: "light", label: t("settings.theme.light") },
            ]}
            onChange={appearance.onThemePreference}
          />
        </Row>
        {inset ? (
          <Row
            id="workspace-theme"
            label={t("settings.appearance.workspaceTheme.label")}
            description={t("settings.appearance.workspaceTheme.description")}
          >
            <div className="w-48">
              <Select
                label={t("settings.appearance.workspaceTheme.label")}
                value={appearance.workspaceTheme}
                options={WORKSPACE_THEMES.map((theme) => ({
                  value: theme.id,
                  label: workspaceThemeLabel(theme, t),
                  icon: (
                    <WorkspaceThemeSwatch
                      palette={glassDisabled ? theme.light : theme.dark}
                    />
                  ),
                }))}
                onChange={(value) => {
                  if (isWorkspaceThemeId(value))
                    appearance.onWorkspaceTheme(value);
                }}
              />
            </div>
          </Row>
        ) : null}
        {inset ? (
          <Row
            id="inset-glass"
            label={t("settings.appearance.transparentWindow.label")}
            description={
              IS_LINUX
                ? t("settings.appearance.transparentWindow.descriptionLinux")
                : glassDisabled
                  ? t(
                      "settings.appearance.transparentWindow.descriptionLightMode",
                    )
                  : t("settings.appearance.transparentWindow.description")
            }
          >
            <Toggle
              label={t("settings.appearance.transparentWindow.label")}
              on={appearance.insetGlass}
              onChange={appearance.onInsetGlass}
              disabled={glassDisabled || IS_LINUX}
            />
          </Row>
        ) : null}
        <Row
          id="accent-color"
          label={t("settings.appearance.accentColor.label")}
          description={t("settings.appearance.accentColor.description")}
        >
          <AccentColorPicker
            value={appearance.accentColor}
            onChange={appearance.onAccentColor}
          />
        </Row>
        <Row
          id="diff-colors"
          label={t("settings.appearance.diffColors.label")}
          description={t("settings.appearance.diffColors.description")}
        >
          <Segmented
            label={t("settings.appearance.diffColors.label")}
            value={appearance.diffPalette}
            options={[
              {
                value: "default",
                label: t("settings.appearance.diffColors.default"),
              },
              {
                value: "colorblind",
                label: t("settings.appearance.diffColors.colorblind"),
              },
              {
                value: "high-contrast",
                label: t("settings.appearance.diffColors.highContrast"),
              },
            ]}
            onChange={appearance.onDiffPalette}
          />
        </Row>
      </Group>

      {inset ? null : (
        <>
          <Group
            title={t("settings.appearance.color.title")}
            description={t("settings.appearance.color.description")}
          >
            <Row
              id="hue"
              label={t("settings.appearance.hue.label")}
              description={t("settings.appearance.hue.description")}
            >
              <Slider
                label={t("settings.appearance.hue.label")}
                value={appearance.themeHue}
                display={`${appearance.themeHue}°`}
                min={THEME_HUE_MIN}
                max={THEME_HUE_MAX}
                onChange={(value) =>
                  appearance.onTint(value, appearance.themeSaturation)
                }
              />
            </Row>
            <Row
              id="saturation"
              label={t("settings.appearance.saturation.label")}
              description={t("settings.appearance.saturation.description")}
            >
              <Slider
                label={t("settings.appearance.saturation.label")}
                value={appearance.themeSaturation}
                display={`${appearance.themeSaturation}%`}
                min={THEME_SATURATION_MIN}
                max={THEME_SATURATION_MAX}
                onChange={(value) =>
                  appearance.onTint(appearance.themeHue, value)
                }
              />
            </Row>
            <Row
              id="dark-lightness"
              label={t("settings.appearance.darkLightness.label")}
              description={
                glassDisabled
                  ? t("settings.appearance.darkLightness.descriptionLightMode")
                  : t("settings.appearance.darkLightness.description")
              }
            >
              <Slider
                label={t("settings.appearance.darkLightness.label")}
                value={appearance.themeDarkLightness}
                display={`${appearance.themeDarkLightness}%`}
                min={THEME_DARK_LIGHTNESS_MIN}
                max={THEME_DARK_LIGHTNESS_MAX}
                onChange={appearance.onDarkLightness}
                disabled={glassDisabled}
              />
            </Row>
          </Group>

          <Group
            title={t("settings.appearance.translucency.title")}
            description={
              glassDisabled
                ? t("settings.appearance.translucency.descriptionLightMode")
                : t("settings.appearance.translucency.description")
            }
          >
            <Row
              id="sidebar-opacity"
              label={t("settings.appearance.sidebarOpacity.label")}
              description={t("settings.appearance.sidebarOpacity.description")}
            >
              <Slider
                label={t("settings.appearance.sidebarOpacity.label")}
                value={percent}
                display={`${percent}%`}
                min={Math.round(SIDEBAR_OPACITY_MIN * 100)}
                max={Math.round(SIDEBAR_OPACITY_MAX * 100)}
                onChange={appearance.onOpacity}
                disabled={glassDisabled}
              />
            </Row>
            <Row
              id="blur"
              label={t("settings.appearance.blur.label")}
              description={t("settings.appearance.blur.description")}
            >
              <Slider
                label={t("settings.appearance.blur.label")}
                value={appearance.blur}
                display={String(appearance.blur)}
                min={SIDEBAR_BLUR_MIN}
                max={SIDEBAR_BLUR_MAX}
                onChange={appearance.onBlur}
                disabled={glassDisabled}
              />
            </Row>
            <Row
              id="main-pane-glass"
              label={t("settings.appearance.mainPaneGlass.label")}
              description={t("settings.appearance.mainPaneGlass.description")}
            >
              <Toggle
                label={t("settings.appearance.mainPaneGlass.label")}
                on={appearance.bodyGlass}
                onChange={appearance.onBodyGlass}
                disabled={glassDisabled}
              />
            </Row>
          </Group>
        </>
      )}

      <ChatBackgroundCard appearance={appearance} />

      <Group title={t("settings.appearance.layout.title")}>
        <Row
          id="inset-layout"
          label={t("settings.appearance.layout.label")}
          description={t("settings.appearance.layout.description")}
        >
          <Segmented
            label={t("settings.appearance.layout.label")}
            value={appearance.insetLayout ? "focused" : "classic"}
            options={[
              {
                value: "classic",
                label: t("settings.appearance.layout.classic"),
              },
              {
                value: "focused",
                label: t("settings.appearance.layout.focused"),
              },
            ]}
            onChange={(value) => appearance.onInsetLayout(value === "focused")}
          />
        </Row>
        <Row
          id="collapsed-project-rail"
          label={t("settings.appearance.projectRail.label")}
          description={t("settings.appearance.projectRail.description")}
        >
          <Segmented
            label={t("settings.appearance.projectRail.label")}
            value={appearance.collapsedProjectRailMode}
            options={[
              {
                value: "compact",
                label: t("settings.appearance.projectRail.compact"),
              },
              {
                value: "hidden",
                label: t("settings.appearance.projectRail.hidden"),
              },
            ]}
            onChange={appearance.onCollapsedProjectRailMode}
          />
        </Row>
        <Row
          id="interface-scale"
          label={t("settings.appearance.uiScale.label")}
          description={t("settings.appearance.uiScale.description")}
        >
          <Select
            label={t("settings.appearance.uiScale.label")}
            value={String(Math.round(appearance.uiScale * 100))}
            options={UI_SCALE_PERCENTS.map((percent) => ({
              value: String(percent),
              label: `${percent}%`,
            }))}
            onChange={(value) => appearance.onUiScale(Number(value))}
          />
        </Row>
        <Row
          id="show-excluded-files"
          label={t("settings.appearance.excludedFiles.label")}
          description={t("settings.appearance.excludedFiles.description")}
        >
          <Toggle
            label={t("settings.appearance.excludedFiles.label")}
            on={appearance.showExcludedFiles}
            onChange={appearance.onShowExcludedFiles}
          />
        </Row>
      </Group>
    </>
  );
}

function ChatBackgroundCard({
  appearance,
}: {
  appearance: AppearanceSettings;
}) {
  const src = chatBackgroundSrc(appearance.chatBackgroundPath);
  const hasImage = Boolean(appearance.chatBackgroundPath && src);
  const emptyVisibility = Math.round(
    appearance.chatBackgroundEmptyOpacity * 100,
  );
  const sessionVisibility = Math.round(
    appearance.chatBackgroundSessionOpacity * 100,
  );
  const busy = appearance.chatBackgroundBusy;
  const t = useT();

  return (
    <Group
      id="chat-background"
      title={t("settings.appearance.chatBackground.title")}
      description={t("settings.appearance.chatBackground.description")}
    >
      <div className="border-b border-content/5 p-4 last:border-b-0">
        <div className="overflow-hidden rounded-lg border border-content/10">
          {hasImage ? (
            <div
              className={`relative h-36 ${appearance.newThreadBackgroundEffect === "gradient-blur" ? "bg-background-base" : ""}`}
            >
              {appearance.newThreadBackgroundEffect === "gradient-blur" ? (
                <GradientBlurBackground
                  className="gradient-blur-preview absolute inset-0"
                  style={{ opacity: appearance.chatBackgroundEmptyOpacity }}
                />
              ) : (
                <div
                  aria-hidden
                  className="chat-background-fade size-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "var(--chat-background-image)",
                    opacity: appearance.chatBackgroundEmptyOpacity,
                  }}
                />
              )}
              <span className="pointer-events-none absolute bottom-2 left-2 text-[11px] text-content/40">
                {t("settings.appearance.chatBackground.preview", {
                  percent: emptyVisibility,
                })}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void appearance.onChooseChatBackground()}
              disabled={busy}
              className="flex h-36 w-full flex-col items-center justify-center gap-2 text-content/40 hover:bg-content/5 hover:text-content/70 disabled:cursor-default disabled:opacity-40"
            >
              {busy ? (
                <Loader className="size-5 animate-spin" aria-hidden />
              ) : (
                <ImagePlus className="size-5" aria-hidden />
              )}
              <span className="text-[12px]">
                {t("settings.appearance.chatBackground.choose")}
              </span>
            </button>
          )}
        </div>
        {hasImage ? (
          <div className="mt-3 flex items-center justify-end gap-2">
            <SecondaryButton
              onClick={() => void appearance.onChooseChatBackground()}
              disabled={busy}
            >
              {busy ? (
                <Loader className="size-3.5 animate-spin" aria-hidden />
              ) : null}
              {t("settings.appearance.chatBackground.change")}
            </SecondaryButton>
            <SecondaryButton
              onClick={() => void appearance.onClearChatBackground()}
              disabled={busy}
              danger
            >
              {t("settings.appearance.chatBackground.remove")}
            </SecondaryButton>
          </div>
        ) : null}
        {appearance.chatBackgroundError ? (
          <p className="mt-2 text-[12px] text-red-400">
            {appearance.chatBackgroundError}
          </p>
        ) : null}
      </div>
      {hasImage ? (
        <>
          <Row
            label={t("settings.appearance.chatBackground.effect.label")}
            description={t(
              NEW_THREAD_BACKGROUND_EFFECT_DESCRIPTION_KEYS[
                appearance.newThreadBackgroundEffect
              ],
            )}
          >
            <Segmented
              label={t("settings.appearance.chatBackground.effect.label")}
              value={appearance.newThreadBackgroundEffect}
              options={NEW_THREAD_BACKGROUND_EFFECTS.map((effect) => ({
                value: effect,
                label: t(NEW_THREAD_BACKGROUND_EFFECT_LABEL_KEYS[effect]),
              }))}
              onChange={appearance.onNewThreadBackgroundEffect}
              optionIdPrefix="new-thread-background-effect"
            />
          </Row>
          <Row
            label={t("settings.appearance.chatBackground.scope.label")}
            description={t(
              "settings.appearance.chatBackground.scope.description",
            )}
          >
            <Segmented
              label={t("settings.appearance.chatBackground.scope.ariaLabel")}
              value={appearance.chatBackgroundScope}
              options={[
                {
                  value: "empty",
                  label: t("settings.appearance.chatBackground.scope.empty"),
                },
                {
                  value: "all",
                  label: t("settings.appearance.chatBackground.scope.all"),
                },
              ]}
              onChange={appearance.onChatBackgroundScope}
            />
          </Row>
          <Row
            label={t(
              "settings.appearance.chatBackground.emptyVisibility.label",
            )}
            description={t(
              "settings.appearance.chatBackground.emptyVisibility.description",
            )}
          >
            <Slider
              label={t(
                "settings.appearance.chatBackground.emptyVisibility.sliderLabel",
              )}
              value={emptyVisibility}
              display={`${emptyVisibility}%`}
              min={Math.round(CHAT_BACKGROUND_OPACITY_MIN * 100)}
              max={Math.round(CHAT_BACKGROUND_OPACITY_MAX * 100)}
              onChange={appearance.onChatBackgroundEmptyOpacity}
            />
          </Row>
          <Row
            label={t(
              "settings.appearance.chatBackground.sessionVisibility.label",
            )}
            description={t(
              "settings.appearance.chatBackground.sessionVisibility.description",
            )}
          >
            <Slider
              label={t(
                "settings.appearance.chatBackground.sessionVisibility.sliderLabel",
              )}
              value={sessionVisibility}
              display={`${sessionVisibility}%`}
              min={Math.round(CHAT_BACKGROUND_OPACITY_MIN * 100)}
              max={Math.round(CHAT_BACKGROUND_OPACITY_MAX * 100)}
              onChange={appearance.onChatBackgroundSessionOpacity}
            />
          </Row>
        </>
      ) : null}
    </Group>
  );
}

type ShortcutModifier = "metaKey" | "ctrlKey" | "altKey" | "shiftKey";

function shortcutModifier(event: KeyboardEvent): ShortcutModifier | null {
  if (event.key === "Meta" || event.code.startsWith("Meta")) return "metaKey";
  if (event.key === "Control" || event.code.startsWith("Control"))
    return "ctrlKey";
  if (event.key === "Alt" || event.code.startsWith("Alt")) return "altKey";
  if (event.key === "Shift" || event.code.startsWith("Shift"))
    return "shiftKey";
  return null;
}

function ShortcutEditor({
  name,
  display,
  resetVisible,
  onApply,
  onDisable,
  onReset,
}: {
  name: string;
  display: string | null;
  resetVisible: boolean;
  onApply: (shortcut: string) => void | Promise<void>;
  onDisable: () => void | Promise<void>;
  onReset: () => void | Promise<void>;
}) {
  const t = useT();
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState("");
  const held = useRef({
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
  });

  const run = async (action: () => void | Promise<void>) => {
    setRecording(false);
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (reason) {
      setError(String(reason));
    } finally {
      setBusy(false);
    }
  };

  const beginRecording = () => {
    held.current = {
      metaKey: false,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
    };
    setPreview("");
    setError(null);
    setRecording(true);
  };

  useEffect(() => {
    if (!recording) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const bare =
        !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
      // An unmodified Tab leaves the recorder instead of trapping focus.
      if (bare && event.code === "Tab") {
        setRecording(false);
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.code === "Escape") {
        setRecording(false);
        setError(null);
        return;
      }
      // Delete disables, but only on its own so Cmd+Delete still records.
      if (bare && (event.code === "Backspace" || event.code === "Delete")) {
        void run(onDisable);
        return;
      }
      const modifier = shortcutModifier(event);
      if (modifier) held.current[modifier] = true;
      const modifiers = {
        metaKey: event.metaKey || held.current.metaKey,
        ctrlKey: event.ctrlKey || held.current.ctrlKey,
        altKey: event.altKey || held.current.altKey,
        shiftKey: event.shiftKey || held.current.shiftKey,
      };
      setPreview(
        quickComposerShortcutPreview(
          modifiers,
          modifier ? undefined : event.code,
          event.key,
        ),
      );
      if (modifier) return;
      const next = shortcutFromKeyEvent({ ...modifiers, code: event.code });
      if (next) void run(() => onApply(next));
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const modifier = shortcutModifier(event);
      if (!modifier) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      held.current[modifier] = false;
      const modifiers = {
        metaKey: event.metaKey || held.current.metaKey,
        ctrlKey: event.ctrlKey || held.current.ctrlKey,
        altKey: event.altKey || held.current.altKey,
        shiftKey: event.shiftKey || held.current.shiftKey,
      };
      modifiers[modifier] = false;
      setPreview(quickComposerShortcutPreview(modifiers));
    };
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
    };
  }, [onApply, onDisable, recording]);

  return (
    <div className="relative w-40 shrink-0">
      <div className="flex items-center gap-0.5">
        <input
          type="text"
          readOnly
          aria-label={t("settings.keybindings.changeLabel", { name })}
          data-shortcut-recorder-active={recording ? "true" : undefined}
          aria-busy={busy || undefined}
          value={
            recording || busy
              ? preview || t("settings.keybindings.recordPlaceholder")
              : (display ?? t("settings.keybindings.disabled"))
          }
          onFocus={beginRecording}
          onClick={beginRecording}
          onBlur={() => setRecording(false)}
          className={`h-6 w-28 shrink-0 truncate rounded-md border bg-transparent px-1.5 py-0 font-mono text-[11px] leading-none outline-none focus:border-accent ${
            busy ? "opacity-50" : ""
          } ${
            display === null
              ? "border-dashed border-content/15 text-content/35"
              : "border-content/15 text-content/80 hover:bg-content/10"
          }`}
        />
        {resetVisible ? (
          <button
            type="button"
            aria-label={t("settings.keybindings.resetLabel", { name })}
            disabled={busy}
            onClick={() => void run(onReset)}
            className="rounded-md px-1 py-1 text-content/35 hover:bg-content/10 hover:text-content disabled:opacity-50"
          >
            <RotateCcw className="size-3.5" />
          </button>
        ) : null}
      </div>
      {recording ? (
        <p
          className="pointer-events-none absolute top-1/2 right-full z-40 mr-3 -translate-y-1/2 text-[10px] whitespace-nowrap text-content/50"
          aria-live="polite"
        >
          {t("settings.keybindings.recordHint")}
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="absolute top-full left-0 z-40 mt-1.5 w-max max-w-64 rounded-md border border-content/10 bg-background-base/95 px-2 py-1 text-[11px] whitespace-nowrap text-red-400 shadow-lg"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function QuickComposerShortcutEditor() {
  const [shortcut, setShortcut] = useState(loadQuickComposerShortcut);
  const [enabled, setEnabled] = useState(loadQuickComposerEnabled);
  const t = useT();
  const apply = async (next: string) => {
    if (!isGlobalShortcut(next))
      throw new Error(t("settings.keybindings.quickComposerNeedsModifier"));
    // Validate before the native call: a rejected chord must not leave the OS
    // holding a registered global hotkey that settings does not know about.
    validateKeybindingShortcut("App: Quick Composer", next);
    // Recording while the feature is off must not silently switch it back on.
    if (enabled) await setQuickComposerShortcut(true, next);
    saveQuickComposerShortcut(next);
    setShortcut(next);
  };
  const reset = async () => {
    // Reset restores the whole default state, including the enabled flag.
    validateKeybindingShortcut(
      "App: Quick Composer",
      QUICK_COMPOSER_DEFAULT_SHORTCUT,
    );
    await setQuickComposerShortcut(true, QUICK_COMPOSER_DEFAULT_SHORTCUT);
    saveQuickComposerEnabled(true);
    saveQuickComposerShortcut(QUICK_COMPOSER_DEFAULT_SHORTCUT);
    setShortcut(QUICK_COMPOSER_DEFAULT_SHORTCUT);
    setEnabled(true);
  };
  return (
    <ShortcutEditor
      name={t("settings.keybindings.quickComposerName")}
      display={enabled ? quickComposerShortcutLabel(shortcut) : null}
      resetVisible={
        enabled !== true || shortcut !== QUICK_COMPOSER_DEFAULT_SHORTCUT
      }
      onApply={apply}
      onDisable={async () => {
        await setQuickComposerShortcut(false);
        saveQuickComposerEnabled(false);
        setEnabled(false);
      }}
      onReset={reset}
    />
  );
}

// Command ids stay English in storage and code; only the shown label is translated.
const KEYBINDING_COMMAND_KEYS: Record<string, MessageKey> = {
  "App: Command Palette": "settings.keybindings.command.appCommandPalette",
  "App: Find in Files": "settings.keybindings.command.appFindInFiles",
  "App: Go to File": "settings.keybindings.command.appGoToFile",
  "App: New Window": "settings.keybindings.command.appNewWindow",
  "App: Open Project": "settings.keybindings.command.appOpenProject",
  "App: Quick Composer": "settings.keybindings.command.appQuickComposer",
  "App: Search": "settings.keybindings.command.appSearch",
  "App: Settings": "settings.keybindings.command.appSettings",
  "App: Switch Model": "settings.keybindings.command.appSwitchModel",
  "App: Toggle Mono": "settings.keybindings.command.appToggleMono",
  "App: Toggle Session Sidebar":
    "settings.keybindings.command.appToggleSessionSidebar",
  "App: Toggle Sidebar": "settings.keybindings.command.appToggleSidebar",
  "Composer: Toggle Workspace":
    "settings.keybindings.command.composerToggleWorkspace",
  "Editor: Find": "settings.keybindings.command.editorFind",
  "Editor: Replace": "settings.keybindings.command.editorReplace",
  "Pane: Close": "settings.keybindings.command.paneClose",
  "Pane: Focus Down": "settings.keybindings.command.paneFocusDown",
  "Pane: Focus Left": "settings.keybindings.command.paneFocusLeft",
  "Pane: Focus Right": "settings.keybindings.command.paneFocusRight",
  "Pane: Focus Up": "settings.keybindings.command.paneFocusUp",
  "Pane: Split Down": "settings.keybindings.command.paneSplitDown",
  "Pane: Split Right": "settings.keybindings.command.paneSplitRight",
  "Project: Next": "settings.keybindings.command.projectNext",
  "Project: Previous": "settings.keybindings.command.projectPrevious",
  "Session: Archive": "settings.keybindings.command.sessionArchive",
  "Session: Next": "settings.keybindings.command.sessionNext",
  "Session: Next in Current Tab":
    "settings.keybindings.command.sessionNextInCurrentTab",
  "Session: Previous": "settings.keybindings.command.sessionPrevious",
  "Session: Previous in Current Tab":
    "settings.keybindings.command.sessionPreviousInCurrentTab",
  "Session: Stop": "settings.keybindings.command.sessionStop",
  "Tab: Activate 1–8": "settings.keybindings.command.tabActivate1to8",
  "Tab: Activate Last": "settings.keybindings.command.tabActivateLast",
  "Tab: Back": "settings.keybindings.command.tabBack",
  "Tab: Close All": "settings.keybindings.command.tabCloseAll",
  "Tab: Close Others": "settings.keybindings.command.tabCloseOthers",
  "Tab: Cycle Next": "settings.keybindings.command.tabCycleNext",
  "Tab: Cycle Previous": "settings.keybindings.command.tabCyclePrevious",
  "Tab: Forward": "settings.keybindings.command.tabForward",
  "Tab: New": "settings.keybindings.command.tabNew",
  "Tab: Next": "settings.keybindings.command.tabNext",
  "Tab: Previous": "settings.keybindings.command.tabPrevious",
  "Terminal: New": "settings.keybindings.command.terminalNew",
  "Terminal: New Tab": "settings.keybindings.command.terminalNewTab",
  "Terminal: Toggle Dock": "settings.keybindings.command.terminalToggleDock",
  "View: Reload": "settings.keybindings.command.viewReload",
  "View: Reset Zoom": "settings.keybindings.command.viewResetZoom",
  "View: Zoom In": "settings.keybindings.command.viewZoomIn",
  "View: Zoom Out": "settings.keybindings.command.viewZoomOut",
};

const KEYBINDING_WHEN_KEYS: Record<string, MessageKey> = {
  Always: "settings.keybindings.when.always",
  Anywhere: "settings.keybindings.when.anywhere",
  "Draft session composer": "settings.keybindings.when.draftComposer",
  "Project with a mono": "settings.keybindings.when.projectWithMono",
  "sessionFocus && !overlay": "settings.keybindings.when.sessionFocusNoOverlay",
  "sessionBusy && !terminalFocus":
    "settings.keybindings.when.sessionBusyNoTerminal",
  "!overlay && (!textFocus || emptyComposer)":
    "settings.keybindings.when.idleTextOrEmptyComposer",
  "!editorFocus": "settings.keybindings.when.notEditorFocus",
  editorFocus: "settings.keybindings.when.editorFocus",
};

/** Display text for a command id or when-clause; unknown values pass through. */
function keybindingText(
  value: string,
  keys: Record<string, MessageKey>,
  t: TFunction,
): string {
  return Object.prototype.hasOwnProperty.call(keys, value)
    ? t(keys[value])
    : value;
}

function KeybindingShortcutEditor({
  command,
  display,
  modified,
  onSave,
}: {
  command: string;
  display: string | null;
  modified: boolean;
  onSave: (
    command: string,
    override: KeybindingOverride,
  ) => void | Promise<void>;
}) {
  const t = useT();
  return (
    <ShortcutEditor
      name={keybindingText(command, KEYBINDING_COMMAND_KEYS, t)}
      display={display}
      resetVisible={modified}
      onApply={(shortcut) => onSave(command, { shortcut })}
      onDisable={() => onSave(command, { disabled: true })}
      onReset={() => onSave(command, {})}
    />
  );
}

function KeybindingsPage() {
  const t = useT();
  const [query, setQuery] = useState("");
  const [overrides, setOverrides] = useState(loadKeybindingOverrides);
  useEffect(
    () => subscribeKeybindings(() => setOverrides(loadKeybindingOverrides())),
    [],
  );
  const rows = useMemo(
    () => filterKeybindings(currentKeybindings(), query),
    [query, overrides],
  );

  const save = async (command: string, override: KeybindingOverride) => {
    const next = saveKeybindingOverride(command, override);
    if (IS_MAC) await invoke("keybindings_set_overrides", { overrides: next });
  };

  return (
    <Group
      title={t("settings.keybindings.group.title")}
      description={t("settings.keybindings.group.description")}
      action={
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-[12px] text-content/40 tabular-nums">
            {t(
              rows.length === 1
                ? "settings.keybindings.bindingCount.one"
                : "settings.keybindings.bindingCount.other",
              { count: rows.length },
            )}
          </span>
          <label className="flex h-7 w-44 shrink-0 items-center gap-2 rounded-md border border-content/10 px-2 text-content/45 focus-within:border-content/20">
            <Search className="size-3.5 shrink-0" strokeWidth={1.75} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("settings.keybindings.filterPlaceholder")}
              aria-label={t("settings.keybindings.filterLabel")}
              spellCheck={false}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-[12px] text-content outline-none placeholder:text-content/35"
            />
          </label>
        </div>
      }
    >
      <div className="flex items-center border-b border-stroke bg-content/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-content/40">
        <span className="min-w-0 flex-1">
          {t("settings.keybindings.columnCommand")}
        </span>
        <span className="w-40 shrink-0">
          {t("settings.keybindings.columnKeybinding")}
        </span>
        <span className="w-28 shrink-0">
          {t("settings.keybindings.columnWhen")}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-3 text-[12px] text-content/45">
          {t("settings.keybindings.noMatches")}
        </p>
      ) : (
        rows.map((row) => {
          const override = overrides[row.command];
          const disabled = override?.disabled === true;
          return (
            <div
              key={row.command}
              className="flex h-11 items-center border-b border-content/5 px-4 text-[12px] last:border-b-0"
            >
              <span
                className={`min-w-0 flex-1 truncate ${disabled ? "text-content/45" : ""}`}
              >
                {keybindingText(row.command, KEYBINDING_COMMAND_KEYS, t)}
              </span>
              {row.fixed ? (
                <span className="w-40 shrink-0">
                  <span className="inline-block h-6 w-28 truncate rounded-md border border-content/10 px-1.5 font-mono text-[11px] leading-6 text-content/60">
                    {row.keys}
                  </span>
                </span>
              ) : row.command === "App: Quick Composer" ? (
                <QuickComposerShortcutEditor />
              ) : (
                <KeybindingShortcutEditor
                  command={row.command}
                  display={disabled ? null : row.keys}
                  modified={Boolean(override)}
                  onSave={save}
                />
              )}
              <span className="w-28 shrink-0 font-mono text-[11px] text-content/40">
                {keybindingText(row.when, KEYBINDING_WHEN_KEYS, t)}
              </span>
            </div>
          );
        })
      )}
    </Group>
  );
}

const GLOBAL_PROVIDER_SCOPE = "global";

function binaryInspectionError(
  provider: ConfigurableBinaryProvider,
  inspection: HarnessBinaryInspection,
  t: TFunction,
): string | null {
  if (inspection.error) return inspection.error;
  if (
    provider === "codex" &&
    !/^codex-cli\s+\d+\.\d+\.\d+/.test(inspection.version ?? "")
  ) {
    return t("settings.providers.binary.invalidCodexVersion");
  }
  if (provider === "opencode") {
    const version = parseOpenCodeVersion(inspection.version ?? "");
    if (!version) return t("settings.providers.binary.invalidOpenCodeVersion");
    if (compareSemver(version, MINIMUM_OPENCODE_VERSION) < 0) {
      return t("settings.providers.binary.openCodeTooOld", {
        version,
        minimum: MINIMUM_OPENCODE_VERSION,
      });
    }
  }
  return null;
}

function ProviderBinaryControl({
  provider,
}: {
  provider: ConfigurableBinaryProvider;
}) {
  const t = useT();
  const root = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const editInput = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(
    () => loadProviderBinaryPath(provider) ?? "",
  );
  const [overridden, setOverridden] = useState(() =>
    Boolean(loadProviderBinaryPath(provider)),
  );
  const [inspection, setInspection] = useState<
    HarnessBinaryInspection & { overridden: boolean }
  >();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealError, setRevealError] = useState<string | null>(null);

  const inspect = useCallback(
    async (binaryPath?: string | null) => {
      setWorking(true);
      setInspection(undefined);
      setError(null);
      setRevealError(null);
      try {
        const next = await inspectHarnessBinary(provider, binaryPath);
        setInspection({
          ...next,
          overridden: Boolean(binaryPath?.trim()),
        });
        setError(binaryInspectionError(provider, next, t));
        return next;
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : String(cause);
        setError(message);
        return null;
      } finally {
        setWorking(false);
      }
    },
    [provider, t],
  );

  useEffect(() => {
    if (editing) editInput.current?.focus();
  }, [editing]);

  const dismiss = (restoreFocus = false) => {
    setOpen(false);
    setEditing(false);
    if (restoreFocus) queueMicrotask(() => trigger.current?.focus());
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (working) return;
    const value = draft.trim();
    if (!value) {
      await useAuto();
      return;
    }
    const next = await inspect(value);
    if (!next) return;
    const validationError = binaryInspectionError(provider, next, t);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!saveProviderBinaryPath(provider, value)) {
      setInspection(undefined);
      setError(t("settings.providers.binary.saveFailed"));
      return;
    }
    setOverridden(true);
    dismiss(true);
  };

  const useAuto = async () => {
    if (working) return;
    const next = await inspect(null);
    if (!next || binaryInspectionError(provider, next, t)) return;
    if (!saveProviderBinaryPath(provider, null)) {
      setInspection(undefined);
      setError(t("settings.providers.binary.saveFailed"));
      return;
    }
    setDraft("");
    setOverridden(false);
    dismiss(true);
  };

  const title = HARNESS_TITLE[provider];
  const restartRequired = providerBinaryPathChangePending(provider);

  return (
    <span ref={root} className="inline-flex align-middle">
      <button
        ref={trigger}
        type="button"
        aria-label={
          restartRequired
            ? t("settings.providers.binary.toggleLabelRestart", {
                provider: title,
              })
            : t("settings.providers.binary.toggleLabel", { provider: title })
        }
        aria-expanded={open}
        aria-controls={`${provider}-binary-popover`}
        aria-haspopup="dialog"
        title={
          restartRequired
            ? t("settings.providers.binary.toggleTitleRestart", {
                provider: title,
              })
            : t("settings.providers.binary.toggleTitle", { provider: title })
        }
        onClick={() => {
          if (!open && !inspection && !working && !error) {
            void inspect(loadProviderBinaryPath(provider));
          }
          setOpen((value) => !value);
          setEditing(false);
        }}
        className={`grid size-6 place-items-center rounded hover:bg-content/10 focus-visible:outline-2 focus-visible:outline-accent ${
          restartRequired
            ? "text-amber-300"
            : "text-content/35 hover:text-content"
        }`}
      >
        <FolderOpen className="size-3.5" strokeWidth={1.75} />
      </button>
      {open ? (
        <Popover
          id={`${provider}-binary-popover`}
          role="dialog"
          aria-label={t("settings.providers.binary.dialogLabel", {
            provider: title,
          })}
          aria-busy={working}
          tabIndex={-1}
          anchor={root}
          side="bottom"
          align="start"
          width={440}
          className="p-3"
          autoFocus
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const focusable = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>(
                'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
              ),
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!first || !last) return;
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }}
          onDismiss={(reason) => dismiss(reason === "escape")}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-medium text-content">
              {t("settings.providers.binary.heading", { provider: title })}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-content/10 px-1.5 py-0.5 text-[10px] text-content/50">
                {t("settings.providers.binary.globalPathBadge")}
              </span>
              <span className="rounded-full bg-content/10 px-1.5 py-0.5 text-[10px] text-content/50">
                {error
                  ? t("settings.providers.binary.needsAttentionBadge")
                  : restartRequired
                    ? t("settings.providers.binary.restartRequiredBadge")
                    : overridden
                      ? t("settings.providers.binary.configuredBadge")
                      : t("settings.providers.binary.autoDetectedBadge")}
              </span>
            </div>
          </div>
          {editing ? (
            <form className="mt-2" onSubmit={submit}>
              <label
                htmlFor={`${provider}-binary-path`}
                className="text-[11px] text-content/50"
              >
                {t("settings.providers.binary.pathLabel")}
              </label>
              <input
                id={`${provider}-binary-path`}
                ref={editInput}
                type="text"
                value={draft}
                placeholder={
                  inspection?.path ??
                  t("settings.providers.binary.autoDetectedPlaceholder")
                }
                disabled={working}
                autoFocus
                onChange={(event) => setDraft(event.target.value)}
                className="mt-1.5 h-8 w-full rounded-md border border-content/10 bg-content/[0.04] px-2 font-mono text-[11px] text-content outline-none placeholder:font-sans placeholder:text-content/35 focus:border-accent/45 disabled:opacity-50"
              />
              <p className="mt-1.5 text-[10px] text-content/40">
                {t("settings.providers.binary.pathHelp")}
              </p>
              {error ? (
                <span
                  role="alert"
                  className="mt-1.5 block text-[11px] text-red-400"
                >
                  {error}
                </span>
              ) : null}
              <div className="mt-3 flex justify-end gap-2">
                <SecondaryButton
                  disabled={working}
                  onClick={() => {
                    setDraft(loadProviderBinaryPath(provider) ?? "");
                    setEditing(false);
                    queueMicrotask(() => trigger.current?.focus());
                  }}
                >
                  {t("settings.providers.common.cancelButton")}
                </SecondaryButton>
                {overridden ? (
                  <SecondaryButton
                    disabled={working}
                    onClick={() => void useAuto()}
                  >
                    {t("settings.providers.binary.useAutoDetectedButton")}
                  </SecondaryButton>
                ) : null}
                <SecondaryButton type="submit" disabled={working}>
                  {t("settings.providers.binary.savePathButton")}
                </SecondaryButton>
              </div>
            </form>
          ) : (
            <>
              <div className="mt-2 rounded-md border border-content/10 bg-content/[0.03] px-2.5 py-2">
                <span className="block max-h-12 overflow-y-auto whitespace-pre-wrap break-all font-mono text-[10px] text-content/65">
                  {inspection?.path ??
                    (error
                      ? t("settings.providers.binary.unresolved")
                      : t("settings.providers.binary.checkingSelected"))}
                </span>
                <span className="mt-1 block max-h-10 overflow-y-auto whitespace-pre-wrap break-words text-[10px] text-content/40">
                  {inspection?.version ??
                    (error
                      ? t("settings.providers.binary.retryToCheck")
                      : t("settings.providers.binary.checkingVersion"))}
                </span>
              </div>
              {error ? (
                <span
                  role="alert"
                  title={error}
                  className="mt-1.5 block max-h-20 overflow-y-auto whitespace-pre-wrap break-words text-[10px] leading-4 text-red-400"
                >
                  {error}
                </span>
              ) : null}
              {revealError ? (
                <span
                  role="alert"
                  className="mt-1.5 block max-h-20 overflow-y-auto whitespace-pre-wrap break-words text-[10px] leading-4 text-red-400"
                >
                  {t("settings.providers.binary.revealFailed", {
                    error: revealError,
                  })}
                </span>
              ) : null}
              <div className="mt-3 flex justify-end gap-2">
                {error ? (
                  <SecondaryButton
                    disabled={working}
                    aria-label={
                      overridden
                        ? t("settings.providers.binary.retryConfiguredLabel", {
                            provider: title,
                          })
                        : t("settings.providers.binary.retryAutoLabel", {
                            provider: title,
                          })
                    }
                    onClick={() =>
                      void inspect(overridden ? draft.trim() || null : null)
                    }
                  >
                    <RefreshCw className="size-3.5" strokeWidth={1.75} />
                    {overridden
                      ? t("settings.providers.binary.retryConfiguredButton")
                      : t("settings.providers.binary.retryAutoButton")}
                  </SecondaryButton>
                ) : null}
                <SecondaryButton
                  aria-label={t("settings.providers.binary.openLocationLabel", {
                    provider: title,
                  })}
                  disabled={!inspection}
                  onClick={() => {
                    if (inspection) {
                      void revealPath(inspection.path).catch((cause) => {
                        setRevealError(
                          cause instanceof Error
                            ? cause.message
                            : String(cause),
                        );
                      });
                    }
                  }}
                >
                  <ExternalLink className="size-3.5" strokeWidth={1.75} />
                  {t("settings.providers.binary.openLocationButton")}
                </SecondaryButton>
                <SecondaryButton
                  aria-label={t("settings.providers.binary.editPathLabel", {
                    provider: title,
                  })}
                  disabled={working}
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="size-3.5" strokeWidth={1.75} />
                  {t("settings.providers.binary.editPathButton")}
                </SecondaryButton>
              </div>
            </>
          )}
        </Popover>
      ) : null}
    </span>
  );
}

function ProvidersPage({
  cwd,
  recents,
}: {
  cwd?: string;
  recents?: RecentProject[];
}) {
  const t = useT();
  useSyncExternalStore(subscribeModels, getModelSnapshot, getModelSnapshot);
  useSyncExternalStore(
    subscribeHarnessAvailability,
    getHarnessAvailabilitySnapshot,
    getHarnessAvailabilitySnapshot,
  );
  const providersRevision = useSyncExternalStore(
    subscribeProjectProviders,
    projectProvidersRevision,
    projectProvidersRevision,
  );
  void providersRevision;
  const [choice, setChoice] = useState(loadLastModelChoice);
  const [defaultModels, setDefaultModels] = useState(loadDefaultModels);
  const [claudeHooks, setClaudeHooks] = useState(loadClaudeHooks);
  const [idleAgentLimit, setIdleAgentLimit] =
    useState<IdleAgentLimit>(loadIdleAgentLimit);
  const [scope, setScope] = useState<string>(GLOBAL_PROVIDER_SCOPE);
  const [hiddenGlobally, setHiddenGlobally] = useState(
    loadHiddenPickerProviders,
  );

  const scopeOptions = useMemo(() => {
    const options: { value: string; label: string; icon?: ReactNode }[] = [
      {
        value: GLOBAL_PROVIDER_SCOPE,
        label: t("settings.providers.page.scopeGlobal"),
        icon: (
          <Globe
            className="size-3.5 shrink-0 text-content/60"
            strokeWidth={1.75}
          />
        ),
      },
    ];
    const seen = new Set<string>();
    for (const path of [cwd, ...(recents ?? []).map((entry) => entry.path)]) {
      if (!path || !looksLikeProject(path)) continue;
      const key = pathKey(path);
      if (seen.has(key)) continue;
      seen.add(key);
      options.push({
        value: path,
        label: projectName(path),
        icon: <ProjectScopeIcon path={path} />,
      });
    }
    return options;
  }, [cwd, recents, t]);

  const project = scope === GLOBAL_PROVIDER_SCOPE ? null : scope;
  const projectSettings = project ? loadProjectProviderSettings(project) : {};
  // A project without overrides inherits the global default provider, the same
  // way `defaultSessionChoice` resolves it for new conversations.
  const effectiveDefaultHarness = project
    ? firstEnabledHarness(
        project,
        projectSettings.defaultHarness ?? choice?.harness ?? "cursor",
      )
    : (choice?.harness ?? null);

  useEffect(() => {
    void probeHarnessAvailability();
  }, []);

  useEffect(() => {
    if (!scopeOptions.some((option) => option.value === scope)) {
      setScope(GLOBAL_PROVIDER_SCOPE);
    }
  }, [scope, scopeOptions]);

  const onClaudeHooks = (next: boolean) => {
    saveClaudeHooks(next);
    setClaudeHooks(next);
  };

  const onIdleAgentLimit = (next: string) => {
    const limit = Number(next) as IdleAgentLimit;
    saveIdleAgentLimit(limit);
    setIdleAgentLimit(limit);
    // A lower limit takes effect now, not at the next finished turn.
    enforceHarnessIdleLimit();
  };

  const onModelChange = (harness: HarnessId, model: string) => {
    if (project) {
      setProjectDefaultModel(project, harness, model);
      return;
    }
    saveDefaultModel(harness, model);
    setDefaultModels((prev) => ({ ...prev, [harness]: model }));
    if (choice?.harness === harness) {
      saveLastModelChoice(harness, model);
      setChoice({ harness, model });
    }
  };

  const onDefault = (harness: HarnessId, model: string) => {
    if (project) {
      setProjectDefaultProvider(project, harness, model);
      return;
    }
    saveLastModelChoice(harness, model);
    setDefaultModels((prev) => ({ ...prev, [harness]: model }));
    setChoice({ harness, model });
  };

  const onPickerVisible = (harness: HarnessId, visible: boolean) => {
    if (project) {
      setProjectProviderHidden(project, harness, !visible);
      return;
    }
    savePickerProviderVisible(harness, visible);
    setHiddenGlobally((prev) =>
      visible
        ? prev.filter((id) => id !== harness)
        : [...new Set([...prev, harness])],
    );
  };

  return (
    <>
      <ProviderAccountsSettings />

      <UsageDisplaySettings />

      <Group
        id="agent-clis"
        title={t("settings.providers.page.agentClisTitle")}
        action={
          <Select
            label={t("settings.providers.page.scopeLabel")}
            value={scope}
            options={scopeOptions}
            onChange={setScope}
          />
        }
        description={
          project
            ? t("settings.providers.page.scopeNoteProject", {
                project: projectName(project),
              })
            : t("settings.providers.page.scopeNoteGlobal")
        }
      >
        {HARNESSES.map((harness) => {
          const inPicker = project
            ? !(projectSettings.hidden ?? []).includes(harness) &&
              !hiddenGlobally.includes(harness)
            : !hiddenGlobally.includes(harness);
          // A globally hidden provider stays out of every project's picker, so
          // the project toggle is shown locked rather than appearing to work.
          const pickerLocked =
            project != null && hiddenGlobally.includes(harness);
          const selectedModel = project
            ? (projectSettings.models?.[harness] ??
              (projectSettings.defaultHarness === harness
                ? projectSettings.defaultModel
                : undefined) ??
              defaultModels[harness] ??
              (choice?.harness === harness
                ? choice.model
                : defaultModelId(harness)))
            : (defaultModels[harness] ??
              (choice?.harness === harness
                ? choice.model
                : defaultModelId(harness)));
          const isDefault = project
            ? effectiveDefaultHarness === harness
            : choice?.harness === harness;
          return (
            <ProviderRow
              key={harness}
              harness={harness}
              selectedModel={selectedModel}
              isDefault={isDefault}
              inPicker={inPicker}
              pickerLocked={pickerLocked}
              onDefault={onDefault}
              onModelChange={onModelChange}
              onPickerVisible={(visible) => onPickerVisible(harness, visible)}
            />
          );
        })}
      </Group>

      <Group title={t("settings.providers.page.advancedTitle")}>
        <Row
          id="idle-agents"
          label={t("settings.providers.page.idleAgentsLabel")}
          description={t("settings.providers.page.idleAgentsHelp")}
        >
          <Segmented
            label={t("settings.providers.page.idleAgentsLabel")}
            value={String(idleAgentLimit)}
            options={IDLE_AGENT_LIMITS.map((limit) => ({
              value: String(limit),
              label:
                limit === 0
                  ? t("settings.providers.page.idleAgentsNone")
                  : String(limit),
            }))}
            onChange={onIdleAgentLimit}
          />
        </Row>
        <Row
          id="claude-hooks"
          label={t("settings.providers.page.claudeHooksLabel")}
          description={t("settings.providers.page.claudeHooksHelp")}
        >
          <Toggle
            label={t("settings.providers.page.claudeHooksLabel")}
            on={claudeHooks}
            onChange={onClaudeHooks}
          />
        </Row>
      </Group>
    </>
  );
}

function UsageDisplaySettings() {
  const t = useT();
  const showRemainingUsage = useShowRemainingUsage();
  const maskEmails = useMaskEmails();
  return (
    <Group title={t("settings.providers.usage.groupTitle")}>
      <Row
        id="show-remaining-usage"
        label={t("settings.providers.usage.remainingLabel")}
        description={t("settings.providers.usage.remainingHelp")}
      >
        <Toggle
          label={t("settings.providers.usage.remainingLabel")}
          on={showRemainingUsage}
          onChange={saveShowRemainingUsage}
        />
      </Row>
      <Row
        id="mask-emails"
        label={t("settings.providers.usage.maskEmailsLabel")}
        description={t("settings.providers.usage.maskEmailsHelp")}
      >
        <Toggle
          label={t("settings.providers.usage.maskEmailsLabel")}
          on={maskEmails}
          onChange={saveMaskEmails}
        />
      </Row>
    </Group>
  );
}

type AccountEditor = {
  provider: ProviderAccountProvider;
  accountId?: string;
  label: string;
};

function ProviderAccountsSettings() {
  const t = useT();
  const [version, setVersion] = useState(0);
  const [editor, setEditor] = useState<AccountEditor | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () => subscribeProviderAccounts(() => setVersion((value) => value + 1)),
    [],
  );

  const startAdd = (provider: ProviderAccountProvider) => {
    setError(null);
    setEditor({ provider, label: "" });
  };

  const startRename = (account: ProviderAccount) => {
    setError(null);
    setEditor({
      provider: account.provider,
      accountId: account.id,
      label: account.label,
    });
  };

  const submitEditor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editor || !editor.label.trim() || working) return;
    const key = editor.accountId
      ? `rename:${editor.provider}:${editor.accountId}`
      : `add:${editor.provider}`;
    setWorking(key);
    setError(null);
    try {
      if (editor.accountId) {
        renameProviderAccount(editor.provider, editor.accountId, editor.label);
      } else {
        const account = newProviderAccount(editor.provider, editor.label);
        await loginHarness(editor.provider, account.id);
        saveProviderAccount(account);
      }
      setEditor(null);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : t("settings.providers.accounts.saveFailed"),
      );
    } finally {
      setWorking(null);
    }
  };

  const removeAccount = async (account: ProviderAccount) => {
    if (account.isDefault || working) return;
    const confirmed = await ask(
      t("settings.providers.accounts.removeConfirmMessage", {
        name: account.label,
      }),
      {
        title: t("settings.providers.accounts.removeConfirmTitle", {
          provider: HARNESS_TITLE[account.provider],
        }),
        kind: "warning",
        okLabel: t("settings.providers.accounts.removeConfirmOk"),
        cancelLabel: t("settings.providers.accounts.removeConfirmCancel"),
      },
    );
    if (!confirmed) return;
    const key = `remove:${account.provider}:${account.id}`;
    setWorking(key);
    setError(null);
    try {
      await removeProviderAccountCredentials(account.provider, account.id);
      removeProviderAccount(account.provider, account.id);
      clearCachedRateLimits(account.provider, account.id);
      if (
        editor?.provider === account.provider &&
        editor.accountId === account.id
      ) {
        setEditor(null);
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : t("settings.providers.accounts.removeFailed"),
      );
    } finally {
      setWorking(null);
    }
  };

  const identities = useProviderAccountIdentities(
    PROVIDER_ACCOUNT_PROVIDERS.flatMap(providerAccounts),
    version,
  );
  const usage = useProviderAccountUsage(version);

  return (
    <Group
      id="provider-accounts"
      title={t("settings.providers.accounts.groupTitle")}
      description={t("settings.providers.accounts.groupDescription")}
      action={<AccountUsageRefresh usage={usage} />}
    >
      {PROVIDER_ACCOUNT_PROVIDERS.map((provider) => {
        const accounts = providerAccounts(provider);
        const adding = editor?.provider === provider && !editor.accountId;
        return (
          <div
            key={provider}
            className="border-b border-content/5 last:border-b-0"
          >
            <div className="flex items-center gap-4 px-4 py-3.5">
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-content/[0.05] ring-1 ring-inset ring-content/[0.06]">
                  <HarnessIcon harness={provider} className="size-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-content">
                    {HARNESS_TITLE[provider]}
                  </div>
                  <div className="mt-0.5 text-[11px] text-content/40">
                    {t(
                      accounts.length === 1
                        ? "settings.providers.accounts.count.one"
                        : "settings.providers.accounts.count.other",
                      { count: accounts.length },
                    )}
                  </div>
                </div>
              </div>
              {supportsAccountProfiles(provider) ? (
                <button
                  type="button"
                  disabled={Boolean(working)}
                  onClick={() => startAdd(provider)}
                  className="flex shrink-0 items-center gap-1.5 rounded-md border border-content/10 px-2.5 py-1 text-[12px] text-content/70 transition-transform duration-150 hover:bg-content/10 hover:text-content active:scale-[0.97] disabled:cursor-default disabled:opacity-40"
                >
                  <Plus className="size-3.5" strokeWidth={1.75} aria-hidden />
                  {t("settings.providers.accounts.addButton")}
                </button>
              ) : null}
            </div>
            <div className="border-t border-content/5 bg-content/[0.015] pl-10">
              {accounts.map((account) => {
                const editing =
                  editor?.provider === provider &&
                  editor.accountId === account.id;
                const removing = working === `remove:${provider}:${account.id}`;
                const identity = identities[identityKey(account)];
                const orgTag = identityOrganizationTag(identity);
                const limits = usage.usage[accountUsageKey(account)];
                return editing ? (
                  <ProviderAccountEditor
                    key={account.id}
                    editor={editor}
                    working={Boolean(working)}
                    onLabel={(label) =>
                      setEditor((current) =>
                        current ? { ...current, label } : current,
                      )
                    }
                    onCancel={() => setEditor(null)}
                    onSubmit={submitEditor}
                  />
                ) : (
                  <div
                    key={account.id}
                    className="flex h-12 items-center gap-3 border-b border-content/5 px-4 py-2 last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate text-[12px] text-content/85">
                          {account.label}
                        </span>
                        {orgTag ? (
                          <span className="max-w-[8rem] shrink-0 truncate rounded bg-content/[0.07] px-1 text-[9px] leading-4 text-content/50">
                            {orgTag}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-0.5 flex min-w-0 items-center gap-2.5 text-[10px]">
                        <AccountStatusLabel
                          status={accountStatus(limits, usage.now, t)}
                          className="shrink-0"
                        />
                        <ProviderAccountSubtitle
                          identity={identity}
                          fallback={
                            account.isDefault
                              ? t("settings.providers.accounts.providerProfile")
                              : t("settings.providers.accounts.isolatedProfile")
                          }
                          className="truncate text-content/30"
                        />
                      </div>
                    </div>
                    <AccountUsageMeters limits={limits} now={usage.now} />
                    <div className="flex w-24 shrink-0 items-center justify-end gap-1">
                      {account.isDefault ? (
                        <span className="mr-1 text-[10px] font-medium uppercase tracking-wide text-content/30">
                          {t("settings.providers.accounts.defaultBadge")}
                        </span>
                      ) : null}
                      <button
                        type="button"
                        disabled={Boolean(working)}
                        aria-label={t(
                          "settings.providers.accounts.renameLabel",
                          {
                            name: account.label,
                          },
                        )}
                        title={t("settings.providers.accounts.renameTitle")}
                        onClick={() => startRename(account)}
                        className="grid size-7 place-items-center rounded-md text-content/40 transition-transform duration-150 hover:bg-content/10 hover:text-content active:scale-[0.96] disabled:opacity-35"
                      >
                        <Pencil className="size-3.5" strokeWidth={1.75} />
                      </button>
                      {!account.isDefault ? (
                        <button
                          type="button"
                          disabled={Boolean(working)}
                          aria-label={t(
                            "settings.providers.accounts.removeLabel",
                            {
                              name: account.label,
                            },
                          )}
                          title={t("settings.providers.accounts.removeTitle")}
                          onClick={() => void removeAccount(account)}
                          className="grid size-7 place-items-center rounded-md text-content/35 transition-transform duration-150 hover:bg-red-400/10 hover:text-red-400 active:scale-[0.96] disabled:opacity-35"
                        >
                          {removing ? (
                            <Loader className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" strokeWidth={1.75} />
                          )}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              {adding && editor ? (
                <ProviderAccountEditor
                  editor={editor}
                  working={Boolean(working)}
                  onLabel={(label) =>
                    setEditor((current) =>
                      current ? { ...current, label } : current,
                    )
                  }
                  onCancel={() => setEditor(null)}
                  onSubmit={submitEditor}
                />
              ) : null}
            </div>
          </div>
        );
      })}
      {error ? (
        <p
          className="border-t border-content/5 px-4 py-2.5 text-[11px] leading-4 text-red-400"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </Group>
  );
}

function ProviderAccountEditor({
  editor,
  working,
  onLabel,
  onCancel,
  onSubmit,
}: {
  editor: AccountEditor;
  working: boolean;
  onLabel: (label: string) => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const t = useT();
  const adding = !editor.accountId;
  return (
    <form
      className="flex h-12 items-center border-b border-content/5 px-4 py-2 last:border-b-0"
      onSubmit={onSubmit}
    >
      <div
        data-provider-account-editor-field
        className="flex items-center pr-1 h-8 min-w-0 flex-1 overflow-hidden rounded-md border border-content/10 bg-content/[0.04] focus-within:border-accent/45"
      >
        <label className="h-full min-w-0 flex-1">
          <span className="sr-only">
            {t("settings.providers.editor.accountNameLabel")}
          </span>
          <input
            autoFocus
            type="text"
            maxLength={48}
            value={editor.label}
            disabled={working}
            placeholder={t("settings.providers.editor.placeholder")}
            aria-label={t(
              adding
                ? "settings.providers.editor.newAriaLabel"
                : "settings.providers.editor.renameAriaLabel",
              { provider: HARNESS_TITLE[editor.provider] },
            )}
            onChange={(event) => onLabel(event.target.value)}
            className="h-full w-full bg-transparent px-2.5 text-[12px] text-content outline-none placeholder:text-content/25 disabled:opacity-50"
          />
        </label>
        <button
          type="button"
          disabled={working}
          onClick={onCancel}
          className="flex h-6 shrink-0 items-center rounded-[4.5px] bg-content/[0.05] px-2.5 text-[11px] text-content/45 transition-transform duration-150 hover:bg-content/10 hover:text-content active:scale-[0.97] disabled:opacity-40"
        >
          {t("settings.providers.common.cancelButton")}
        </button>
        <button
          type="submit"
          disabled={working || !editor.label.trim()}
          className="ml-1 flex h-6 shrink-0 items-center gap-1.5 rounded-[4.5px] bg-content px-2.5 text-[11px] font-medium text-background-base transition-transform duration-150 hover:bg-content/85 active:scale-[0.97] disabled:cursor-default disabled:opacity-40"
        >
          {working ? <Loader className="size-3 animate-spin" /> : null}
          {adding
            ? working
              ? t("settings.providers.editor.waitingForBrowser")
              : t("settings.providers.editor.signInAndAddButton")
            : t("settings.providers.common.saveButton")}
        </button>
      </div>
    </form>
  );
}

/** The icon the project rail shows: custom logo, else the project mascot. */
function ProjectScopeIcon({ path }: { path: string }) {
  const logos = useTabGroupLogos();
  const [colors] = useState(loadTabGroupColors);
  const [customColors] = useState(loadTabGroupCustomColors);
  const [mascots] = useState(loadTabGroupMascots);
  const key = projectKey(path);
  const name = projectName(path);
  const logoPath = resolveTabGroupLogo(key, logos);
  if (logoPath) {
    return (
      <ProjectLogoIcon
        path={logoPath}
        className="size-4 rounded-sm"
        imageClassName="size-4"
      />
    );
  }
  return (
    <ProjectMascot
      project={name}
      color={resolveTabGroupColor(key, colors, customColors, name)}
      name={resolveTabGroupMascot(key, mascots)}
      className="size-3.5"
    />
  );
}

function ProviderRow({
  harness,
  selectedModel,
  isDefault,
  inPicker,
  pickerLocked = false,
  onDefault,
  onModelChange,
  onPickerVisible,
}: {
  harness: HarnessId;
  selectedModel: string;
  isDefault: boolean;
  inPicker: boolean;
  /** Globally hidden providers cannot be turned on per project. */
  pickerLocked?: boolean;
  onDefault: (harness: HarnessId, model: string) => void;
  onModelChange: (harness: HarnessId, model: string) => void;
  onPickerVisible: (visible: boolean) => void;
}) {
  const t = useT();
  const models = modelsFor(harness);
  const available = isHarnessAvailable(harness);
  const current =
    models.length > 0 ? resolveModel(harness, selectedModel) : null;

  useEffect(() => {
    if (!available || hasLiveCatalog(harness)) return;
    void refreshHarnessCatalogs([harness]);
  }, [available, harness]);

  return (
    <Row
      label={
        <span className="flex items-center gap-2">
          <HarnessIcon harness={harness} className="size-4 shrink-0" />
          {HARNESS_TITLE[harness]}
          <ProviderBinaryControl provider={harness} />
          {isDefault ? (
            <span className="rounded-full bg-content/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-content/60">
              {t("settings.providers.row.defaultBadge")}
            </span>
          ) : null}
        </span>
      }
      description={
        available
          ? t(
              models.length === 1
                ? "settings.providers.row.modelsAvailable.one"
                : "settings.providers.row.modelsAvailable.other",
              { count: models.length },
            )
          : harnessUnavailableHint(harness)
      }
    >
      {current ? (
        <Select
          label={t("settings.providers.row.modelSelectLabel", {
            provider: HARNESS_TITLE[harness],
          })}
          value={current.id}
          onChange={(next) => onModelChange(harness, next)}
          onOpen={() => {
            // Opening the dropdown is an explicit refresh: fallbacks keep
            // `models` non-empty, and routine refreshes skip once a live
            // catalog exists, so force this one past that skip.
            if (available) {
              void refreshHarnessCatalogs([harness], { force: true });
            }
          }}
          options={models.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
      ) : null}
      <SecondaryButton
        onClick={() => current && onDefault(harness, current.id)}
        disabled={isDefault || !current}
      >
        {isDefault
          ? t("settings.providers.row.defaultButton")
          : t("settings.providers.row.useByDefaultButton")}
      </SecondaryButton>
      {available ? (
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-content/50">
            {pickerLocked
              ? t("settings.providers.row.hiddenGlobally")
              : t("settings.providers.row.showInPicker")}
          </span>
          <Toggle
            label={t("settings.providers.row.pickerToggleLabel", {
              provider: HARNESS_TITLE[harness],
            })}
            on={inPicker}
            onChange={onPickerVisible}
            disabled={pickerLocked}
          />
        </div>
      ) : null}
    </Row>
  );
}

function useArchivedProjects(): ArchivedProject[] {
  const [items, setItems] = useState(loadArchivedProjects);
  useEffect(
    () => subscribeArchivedProjects(() => setItems(loadArchivedProjects())),
    [],
  );
  return items;
}

function archivedProjectLabel(path: string): string {
  return resolveTabGroupLabel(
    projectKey(path),
    loadTabGroupLabels(),
    projectName(path),
  );
}

function ArchivePage({
  cwd,
  sessions,
  onOpenSession,
  onArchiveSession,
  onDeleteSession,
  onRestoreProject,
  onDeleteProject,
}: {
  cwd: string;
  sessions: SessionSummary[];
  onOpenSession: (sessionId: string) => void;
  onArchiveSession: (sessionId: string, archived: boolean) => void;
  onDeleteSession: (sessionId: string) => void;
  onRestoreProject?: (path: string) => void;
  onDeleteProject?: (path: string) => void;
}) {
  const [filters, setFilters] = useState(loadSessionSidebarFilters);
  const [deleting, setDeleting] = useState<ArchivedProject | null>(null);
  const t = useT();
  const archivedProjects = useArchivedProjects();
  const archived = useMemo(
    () =>
      sessions
        .filter((session) => session.archived)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [sessions],
  );

  const onShowArchived = (showArchived: boolean) => {
    const next = { ...filters, showArchived };
    saveSessionSidebarFilters(next);
    setFilters(next);
  };

  return (
    <>
      <Group
        title={t("settings.archive.projectsTitle")}
        description={t("settings.archive.projectsDescription")}
      >
        {archivedProjects.length === 0 ? (
          <p className="px-4 py-3.5 text-[12px] text-content/45">
            {t("settings.archive.noProjects")}
          </p>
        ) : (
          archivedProjects.map((project) => (
            <div
              key={project.path}
              className="flex items-center gap-3 border-b border-content/5 px-4 py-2.5 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px]">
                  {archivedProjectLabel(project.path)}
                </div>
                <div className="truncate text-[11px] text-content/40">
                  {prettyCwd(project.path)}
                </div>
              </div>
              {onRestoreProject ? (
                <SecondaryButton onClick={() => onRestoreProject(project.path)}>
                  {t("settings.archive.restoreButton")}
                </SecondaryButton>
              ) : null}
              {onDeleteProject ? (
                <SecondaryButton danger onClick={() => setDeleting(project)}>
                  {t("settings.archive.deleteButton")}
                </SecondaryButton>
              ) : null}
            </div>
          ))
        )}
      </Group>

      <Group
        title={
          looksLikeProject(cwd)
            ? t("settings.archive.inProjectTitle", { name: projectName(cwd) })
            : t("settings.archive.conversationsTitle")
        }
      >
        <Row
          id="show-archived"
          label={t("settings.archive.showArchivedLabel")}
          description={t("settings.archive.showArchivedDescription")}
        >
          <Toggle
            label={t("settings.archive.showArchivedLabel")}
            on={filters.showArchived}
            onChange={onShowArchived}
          />
        </Row>
        {!looksLikeProject(cwd) ? (
          <p className="px-4 py-3.5 text-[12px] text-content/45">
            {t("settings.archive.openProjectHint")}
          </p>
        ) : archived.length === 0 ? (
          <p className="px-4 py-3.5 text-[12px] text-content/45">
            {t("settings.archive.noConversations")}
          </p>
        ) : (
          archived.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-3 border-b border-content/5 px-4 py-2.5 last:border-b-0"
            >
              <HarnessIcon
                harness={session.harness}
                className="size-3.5 shrink-0"
              />
              <button
                type="button"
                onClick={() => onOpenSession(session.id)}
                className="min-w-0 flex-1 truncate text-left text-[13px] hover:text-content"
              >
                {sessionDisplayTitle(session.title, session.harness)}
              </button>
              <span className="shrink-0 text-[11px] text-content/35 tabular-nums">
                {formatDate(session.updatedAt)}
              </span>
              <SecondaryButton
                onClick={() => onArchiveSession(session.id, false)}
              >
                {t("settings.archive.unarchiveButton")}
              </SecondaryButton>
              <SecondaryButton
                danger
                onClick={() => onDeleteSession(session.id)}
              >
                {t("settings.archive.deleteButton")}
              </SecondaryButton>
            </div>
          ))
        )}
      </Group>

      {deleting ? (
        <RemoveProjectDialog
          name={archivedProjectLabel(deleting.path)}
          path={deleting.path}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            onDeleteProject?.(deleting.path);
            setDeleting(null);
          }}
        />
      ) : null}
    </>
  );
}

function formatDate(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  try {
    return new Intl.DateTimeFormat(getLocale(), {
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

/** Monos on or off, and each Mono the user has. */
function MonosPage() {
  const enabled = useSyncExternalStore(
    subscribeMonosEnabled,
    loadMonosEnabled,
    () => true,
  );
  const menuBarIcon = useSyncExternalStore(
    subscribeMonoMenuBarIcon,
    loadMonoMenuBarIcon,
    () => true,
  );
  const railPinned = useRailMonosPinned();
  const snapshot = useSyncExternalStore(subscribeMonos, monosSnapshot);
  const monos = useMemo(() => listMonos(), [snapshot]);
  const t = useT();

  return (
    <>
      <Group title={t("settings.monos.title")}>
        <Row
          id="monos-enabled"
          label={t("settings.monos.showLabel")}
          description={t("settings.monos.showDescription")}
        >
          <Toggle
            label={t("settings.monos.showLabel")}
            on={enabled}
            onChange={saveMonosEnabled}
          />
        </Row>
        <Row
          id="rail-monos-pinned"
          label={t("settings.monos.pinLabel")}
          description={t("settings.monos.pinDescription")}
        >
          <Toggle
            label={t("settings.monos.pinLabel")}
            on={railPinned}
            onChange={saveRailMonosPinned}
            disabled={!enabled}
          />
        </Row>
        {IS_MAC && (
          <Row
            id="mono-menu-bar-icon"
            label={t("settings.monos.menuBarLabel")}
            description={t("settings.monos.menuBarDescription")}
          >
            <Toggle
              label={t("settings.monos.menuBarLabel")}
              on={menuBarIcon}
              onChange={saveMonoMenuBarIcon}
            />
          </Row>
        )}
      </Group>
      <Group
        id="mono-list"
        title={t("settings.monos.listTitle")}
        description={t("settings.monos.listDescription")}
      >
        {monos.length ? (
          monos.map((mono) => <MonoRow key={mono.id} mono={mono} />)
        ) : (
          <p className="px-4 py-3.5 text-[12px] text-content/45">
            {t("settings.monos.noMonos")}
          </p>
        )}
      </Group>
    </>
  );
}

function MonoRow({ mono }: { mono: Mono }) {
  const look = monoLook(mono);
  const t = useT();
  return (
    <Row
      label={
        <span className="flex min-w-0 items-center gap-2">
          <PixelMascot
            name={look.mascot}
            color={look.color}
            still
            className="size-4 shrink-0"
          />
          <span className="truncate">{look.name}</span>
        </span>
      }
      description={
        look.projects.length
          ? t("settings.monos.worksOn", {
              projects: monoProjectsPhrase(look.projects),
            })
          : t("settings.monos.noProjects")
      }
    >
      <span className="text-[12px] leading-5 text-content/50">
        {t("settings.monos.sessionVisibilityHint")}
      </span>
      <Toggle
        label={t("settings.monos.sessionVisibilityLabel", { name: look.name })}
        on={mono.showStartedSessionsInSidebar === true}
        onChange={(on) =>
          updateMono(mono.id, (entry) => ({
            ...entry,
            showStartedSessionsInSidebar: on,
          }))
        }
      />
      <ConfirmReset
        label={t("settings.monos.resetLabel")}
        title={t("settings.monos.resetTitle", { name: look.name })}
        body={t("settings.monos.resetBody", {
          defaultName: defaultMonoName(look.mascot),
        })}
        kept={t("settings.monos.resetKept")}
        failure={t("settings.monos.resetFailure")}
        onConfirm={() => resetMonoDefaults(mono.id)}
      >
        {(open, ref) => (
          <button
            ref={ref}
            type="button"
            title={t("settings.monos.resetButtonTitle")}
            aria-label={t("settings.monos.resetButtonLabel", {
              name: look.name,
            })}
            onClick={open}
            className="grid size-7 place-items-center rounded-md text-content/40 transition-transform duration-150 hover:bg-content/10 hover:text-content active:scale-[0.96]"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.75} />
          </button>
        )}
      </ConfirmReset>
    </Row>
  );
}

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="pb-4">
      <h1 className="text-[20px] font-semibold leading-tight text-content">
        {title}
      </h1>
      {description ? (
        <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-content/45">
          {description}
        </p>
      ) : null}
    </header>
  );
}

/**
 * A titled card of related settings. Everything on a page lives in one, so a
 * page reads as a handful of topics instead of one long list of switches.
 */
function Group({
  id,
  title,
  description,
  action,
  children,
}: {
  /** Matches a `SETTINGS_INDEX` id when the whole card is the search target. */
  id?: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const revealed = useContext(RevealedSetting);
  const flash = id != null && revealed === id;

  return (
    <section
      id={id ? settingDomId(id) : undefined}
      data-setting-id={id}
      className="pt-8 first:pt-0"
    >
      <div className="flex items-end gap-4 pb-2.5">
        <div className="min-w-0 flex-1">
          <h2 className="text-[13px] font-semibold text-content">{title}</h2>
          {description ? (
            <p className="mt-1 text-[12px] leading-relaxed text-content/45">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0 pb-0.5">{action}</div> : null}
      </div>
      <div
        className={`overflow-hidden rounded-xl border bg-content/3 transition-colors ${
          flash ? "border-accent/60" : "border-content/10"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

function Row({
  id,
  label,
  description,
  children,
}: {
  /** Matches a `SETTINGS_INDEX` id so search can scroll here. */
  id?: string;
  label: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  const revealed = useContext(RevealedSetting);
  const flash = id != null && revealed === id;

  return (
    <div
      id={id ? settingDomId(id) : undefined}
      data-setting-id={id}
      className={`settings-row flex items-start gap-6 border-b border-content/5 px-4 py-3.5 transition-colors last:border-b-0 ${
        flash ? "bg-accent/10" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-content">{label}</div>
        {description ? (
          <p className="mt-1 text-[12px] leading-relaxed text-content/45">
            {description}
          </p>
        ) : null}
      </div>
      <div className="settings-row-control flex min-w-0 max-w-[60%] shrink-0 flex-wrap items-center justify-end gap-2">
        {children}
      </div>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  optionIdPrefix,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  optionIdPrefix?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-grid max-w-full shrink-0 gap-0.5 rounded-md border border-content/10 p-0.5 text-[12px]"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      {options.map((option) => (
        <button
          id={
            optionIdPrefix
              ? `${optionIdPrefix}-${option.value.toLowerCase()}`
              : undefined
          }
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`min-w-0 rounded-[5px] px-2.5 py-1 ${
            value === option.value
              ? "bg-selection text-content"
              : "text-content/50 hover:text-content"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex w-56 max-w-full items-center gap-3 ${disabled ? "opacity-40" : ""}`}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        disabled={disabled}
        className="sidebar-opacity-slider min-w-0 flex-1 disabled:cursor-not-allowed"
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="w-10 shrink-0 text-right text-[12px] text-content tabular-nums">
        {display}
      </span>
    </div>
  );
}

/** The shell, the card inside it and the accent, at the size of a menu icon. */
function WorkspaceThemeSwatch({ palette }: { palette: WorkspacePalette }) {
  return (
    <span
      aria-hidden
      className="relative block size-4 overflow-hidden rounded-[4px] border border-content/15"
      style={{ background: palette.surface }}
    >
      <span
        className="absolute inset-y-[3px] right-0 left-[5px] rounded-l-[2px]"
        style={{ background: palette.panelSolid }}
      />
      <span
        className="absolute top-[6px] left-[8px] size-[5px] rounded-full"
        style={{ background: palette.accent }}
      />
    </span>
  );
}

const ACCENT_COLOR_PRESETS = [
  "#4da3f5",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#10b981",
] as const;

function AccentColorPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const t = useT();
  const colorIndex = value
    ? ACCENT_COLOR_PRESETS.indexOf(
        value as (typeof ACCENT_COLOR_PRESETS)[number],
      )
    : -1;
  const presetIndex = value == null ? 0 : colorIndex >= 0 ? colorIndex + 1 : -1;

  return (
    <div ref={root} className="w-48">
      <ColorSwatchRow
        colors={["var(--color-content)", ...ACCENT_COLOR_PRESETS]}
        labels={[
          t("settings.appearance.accentColor.swatch.default"),
          t("settings.appearance.accentColor.swatch.blue"),
          t("settings.appearance.accentColor.swatch.violet"),
          t("settings.appearance.accentColor.swatch.pink"),
          t("settings.appearance.accentColor.swatch.red"),
          t("settings.appearance.accentColor.swatch.orange"),
          t("settings.appearance.accentColor.swatch.green"),
        ]}
        colorIndex={presetIndex >= 0 ? presetIndex : undefined}
        customColor={presetIndex < 0 ? (value ?? undefined) : undefined}
        customPickerOpen={open}
        onPickIndex={(index) => {
          setOpen(false);
          onChange(
            index === 0
              ? ACCENT_COLOR_DEFAULT
              : (ACCENT_COLOR_PRESETS[index - 1] ?? ACCENT_COLOR_PRESETS[0]),
          );
        }}
        onToggleCustom={() => setOpen((current) => !current)}
      />
      {open ? (
        <Popover
          anchor={root}
          side="bottom"
          align="end"
          width={248}
          onDismiss={() => setOpen(false)}
          className="px-2 pb-2"
        >
          <ColorPickerPopover
            value={value ?? ACCENT_COLOR_PRESETS[0]}
            onChange={onChange}
          />
        </Popover>
      ) : null}
    </div>
  );
}

/** macOS keeps the decision after the first prompt; only System Settings can flip it. Windows toasts are governed by Settings > Notifications. */
function NotificationsBlocked() {
  const t = useT();
  return (
    <span className="flex items-center gap-2 text-[12px] text-content/45">
      {t("settings.widgets.notificationsBlocked.permissionNeeded")}
      {IS_MAC || IS_WIN ? (
        <button
          type="button"
          onClick={() => {
            void openNotificationSettings().catch(() => {});
          }}
          className="rounded-md border border-content/10 px-2 py-1 text-content/70 hover:bg-content/10 hover:text-content"
        >
          {t("settings.widgets.notificationsBlocked.openSystemSettings")}
        </button>
      ) : null}
    </span>
  );
}

function Toggle({
  label,
  on,
  onChange,
  disabled = false,
}: {
  label: string;
  on: boolean;
  onChange: (on: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={on}
      disabled={disabled}
      onClick={() => {
        onChange(!on);
        playCue("switch");
      }}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        on ? "bg-accent" : "bg-content/20"
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white transition-[left] ${
          on ? "left-4.5" : "left-0.5"
        }`}
      />
    </button>
  );
}

/** Theme-aware dropdown for a Settings row: a trigger button opening a Popover listbox. Used instead of a native select, whose option popup is OS-rendered and unreadable in dark mode on Windows/Linux. */
function Select({
  label,
  value,
  options,
  onChange,
  onOpen,
}: {
  label: string;
  value: string;
  options: { value: string; label: string; icon?: ReactNode }[];
  onChange: (value: string) => void;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() =>
    Math.max(
      0,
      options.findIndex((option) => option.value === value),
    ),
  );
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const activeOption = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);
  const activeId =
    options[active] != null ? `${listId}-opt-${active}` : undefined;

  useEffect(() => {
    if (!open) return;
    setActive(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    );
  }, [open, value, options]);

  useEffect(() => {
    if (open) onOpen?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    activeOption.current?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const pick = (next: string) => {
    onChange(next);
    setOpen(false);
    trigger.current?.focus();
  };

  const onMenuKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
      return;
    }
    if (e.key === "Tab") {
      const option = options[active];
      if (option && option.value !== value) onChange(option.value);
      setOpen(false);
      trigger.current?.focus();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const option = options[active];
      if (option) pick(option.value);
    }
  };

  return (
    <div ref={root} className="relative max-w-52">
      <button
        type="button"
        ref={trigger}
        aria-label={`${label}: ${selected?.label ?? value}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-content/10 bg-content/5 px-2 py-1 text-left text-[12px] text-content outline-none hover:border-content/20"
      >
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          {selected?.icon ? (
            <span className="grid size-4 shrink-0 place-items-center">
              {selected.icon}
            </span>
          ) : null}
          <span className="min-w-0 truncate">
            {selected ? selected.label : value}
          </span>
        </span>
        <ChevronDown
          className={`size-3.5 shrink-0 text-content/50 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
        />
      </button>
      {open ? (
        <Popover
          anchor={root}
          side="bottom"
          align="end"
          width={280}
          maxHeight={320}
          autoFocus
          onDismiss={(reason) => {
            setOpen(false);
            if (reason === "escape") trigger.current?.focus();
          }}
          role="listbox"
          aria-label={label}
          aria-activedescendant={activeId}
          tabIndex={-1}
          onKeyDown={onMenuKey}
          className="overflow-y-auto overscroll-contain p-1"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const highlighted = index === active;
            return (
              <button
                key={option.value}
                ref={highlighted ? activeOption : undefined}
                type="button"
                id={`${listId}-opt-${index}`}
                role="option"
                tabIndex={-1}
                aria-selected={isSelected}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => pick(option.value)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] ${
                  highlighted || isSelected
                    ? "bg-selection text-content"
                    : "text-content hover:bg-content/5"
                }`}
              >
                {option.icon ? (
                  <span className="grid size-4 shrink-0 place-items-center">
                    {option.icon}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {isSelected ? (
                  <Check className="size-3.5 shrink-0" strokeWidth={2.25} />
                ) : null}
              </button>
            );
          })}
        </Popover>
      ) : null}
    </div>
  );
}
