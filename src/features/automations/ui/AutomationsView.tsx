import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";
import { AccessPicker } from "../../sessions/ui/AccessPicker";
import { HarnessIcon } from "../../sessions/ui/HarnessIcon";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  File,
  Gauge,
  GitPullRequest,
  Inbox,
  LoaderCircle,
  Lock,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  StickyNote,
  Terminal,
  Trash2,
  X,
  Zap,
} from "../../../shared/ui/icons";
import { InboxProviderMark } from "../../inbox/ui/InboxProviderMark";
import { ModelControlPills, ModelPicker } from "../../sessions/ui/ModelPicker";
import { Popover } from "../../../shared/ui/Popover";
import { ProjectLogoIcon } from "../../projects/ui/ProjectLogoIcon";
import { ProjectMascot } from "../../projects/ui/ProjectMascot";
import { SearchableProjectPicker } from "../../projects/ui/SearchableProjectPicker";
import { SearchableSelect } from "../../../shared/ui/SearchableSelect";
import { SkillPromptField } from "../../skills/ui/SkillPromptField";
import { OverlayNav } from "../../../app/shell/TitleBar";
import { WindowControls } from "../../../app/shell/WindowControls";
import { useLockOverscroll } from "../../../shared/hooks/useLockOverscroll";
import {
  t as tNow,
  useT,
  type MessageKey,
  type TFunction,
} from "../../../shared/i18n/i18n";
import { useTabGroupLogos } from "../../projects/hooks/useTabGroupLogos";
import {
  AUTOMATION_WEEKDAY_KEYS,
  applyTriggers,
  automationScheduleLabel,
  automationTriggers,
  createAutomationTrigger,
  createManualAutomationRun,
  deleteAutomation,
  draftFromAutomation,
  draftFromTemplate,
  formatAutomationRunAt,
  formatAutomationRunDuration,
  gmtOffsetLabel,
  listAutomationRuns,
  listAutomations,
  newAutomationDraft,
  nextAutomationRunAt,
  nextRunPreview,
  peekAutomations,
  saveAutomation,
  setAutomationEnabled,
  subscribeAutomations,
  type Automation,
  type AutomationDraft,
  type AutomationRun,
  type AutomationTrigger,
  type AutomationTriggerKind,
} from "../model/automations";
import {
  AUTOMATION_TEMPLATE_CATEGORIES,
  AUTOMATION_TEMPLATE_MESSAGES,
  templatesForCategory,
  type AutomationTemplate,
  type AutomationTemplateCategoryId,
  type AutomationTemplateIcon,
} from "../model/automationTemplates";
import {
  AZUREDEVOPS_CHANGE_EVENT,
  azureDevOpsConnected,
} from "../../inbox/model/azureDevOps";
import { gitBranches } from "../../../platform/tauri/fs";
import { formatRelativeTime, githubStatus } from "../../inbox/model/githubTasks";
import { GITLAB_CHANGE_EVENT, gitlabConnected } from "../../inbox/model/gitlab";
import { LAYER } from "../../../shared/lib/layers";
import { LINEAR_CHANGE_EVENT, linearConnected } from "../../inbox/model/linear";
import { JIRA_CHANGE_EVENT, jiraConnected } from "../../inbox/model/jira";
import { defaultSessionChoice, firstEnabledHarness, modelsFor, preferredModelId, resolveModel } from "../../sessions/model/models";
import { projectKey, projectName } from "../../../shared/lib/paths";
import { IS_MAC } from "../../../platform/tauri/platform";
import { looksLikeProject, type RecentProject } from "../../projects/model/recents";
import { inProjectScope } from "../../projects/model/projectScope";
import {
  loadSessionFolders,
  subscribeSessionFolders,
} from "../../sessions/model/sessionFolders";
import { loadModelControls, subscribeModelControls } from "../../settings/model/settings";
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

type Props = {
  tabbed?: boolean;
  besideRail?: boolean;
  compactRail?: boolean;
  cwd?: string;
  /** Lists only automations that run in this project, plus project-less ones. */
  scopeProject?: string;
  recents: RecentProject[];
  onClose: () => void;
  onToggleSidebar?: () => void;
  onLaunch: (
    automation: Automation,
    run: AutomationRun,
  ) => void | Promise<void>;
  onOpenSession: (sessionId: string) => void | Promise<void>;
};

const ACTION =
  "inline-flex items-center gap-1.5 rounded-md px-3 text-[12px] disabled:cursor-default disabled:opacity-40";
const ACTION_FILLED = `${ACTION} h-6.5 bg-content font-medium text-background-base hover:bg-content/80`;
const ACTION_OUTLINE = `${ACTION} h-7 border border-content/15 text-content/80 hover:border-content/30 hover:bg-content/10 hover:text-content`;

let rememberedAutomationId: string | null = null;

export function AutomationsView({
  tabbed = false,
  besideRail = false,
  compactRail = false,
  cwd,
  scopeProject,
  recents,
  onClose,
  onToggleSidebar,
  onLaunch,
  onOpenSession,
}: Props) {
  const t = useT();
  return (
    <div
      role="region"
      aria-label={t("automations.view.title")}
      data-app-automations
      className="flex min-h-0 min-w-0 flex-1 flex-col text-content"
    >
      {!tabbed ? (
        <div
          data-app-view-header
          className="flex h-10 shrink-0 select-none items-center border-b border-stroke"
          data-tauri-drag-region="deep"
        >
          {IS_MAC && compactRail ? <div className="w-4 shrink-0" /> : null}
          {IS_MAC && !besideRail ? <div className="w-[78px] shrink-0" /> : null}
          {besideRail ? null : (
            <OverlayNav onBack={onClose} onToggleSidebar={onToggleSidebar} />
          )}
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3 text-[13px]">
            <Zap
              className="size-3.5 shrink-0 text-content/45"
              strokeWidth={1.75}
            />
            <span className="min-w-0 truncate text-content">
              {t("automations.view.title")}
            </span>
          </div>
          {IS_MAC ? null : <WindowControls />}
        </div>
      ) : null}
      <AutomationsContent
        cwd={cwd}
        scopeProject={scopeProject}
        recents={recents}
        onLaunch={onLaunch}
        onOpenSession={onOpenSession}
      />
    </div>
  );
}

function AutomationsContent({
  cwd,
  scopeProject,
  recents,
  onLaunch,
  onOpenSession,
}: Pick<
  Props,
  "cwd" | "scopeProject" | "recents" | "onLaunch" | "onOpenSession"
>) {
  const [automations, setAutomations] = useState<Automation[]>(
    () => peekAutomations() ?? [],
  );
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    rememberedAutomationId,
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(() => peekAutomations() === null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<AutomationDraft | null>(null);
  const [pickerOpen, setPickerOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState<string | null>(null);
  const logos = useTabGroupLogos();
  const [groupLabels] = useState(loadTabGroupLabels);
  const [groupMascots] = useState(loadTabGroupMascots);
  const [groupColors] = useState(loadTabGroupColors);
  const [groupCustomColors] = useState(loadTabGroupCustomColors);
  const t = useT();

  const refresh = useCallback(async () => {
    try {
      const next = await listAutomations();
      setAutomations(next);
      setSelectedId((current) => {
        const preferred = current ?? rememberedAutomationId;
        return preferred && next.some((entry) => entry.id === preferred)
          ? preferred
          : (next[0]?.id ?? null);
      });
      setError(null);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return subscribeAutomations(() => void refresh());
  }, [refresh]);

  const scoped = useMemo(
    () =>
      scopeProject
        ? automations.filter((automation) =>
            inProjectScope(automation.cwd, scopeProject),
          )
        : automations,
    [automations, scopeProject],
  );
  // One from another project stays remembered, but a scoped list opens on its
  // own first automation instead.
  const shownId =
    scopeProject && !scoped.some((entry) => entry.id === selectedId)
      ? (scoped[0]?.id ?? null)
      : selectedId;

  useEffect(() => {
    rememberedAutomationId = selectedId;
  }, [selectedId]);

  useEffect(() => {
    if (!shownId) {
      setRuns([]);
      return;
    }
    let cancelled = false;
    void listAutomationRuns(shownId)
      .then((next) => {
        if (!cancelled) setRuns(next);
      })
      .catch(() => {
        if (!cancelled) setRuns([]);
      });
    return () => {
      cancelled = true;
    };
  }, [automations, shownId]);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return scoped.filter((automation) => {
      if (!needle) return true;
      const project = resolveTabGroupLabel(
        projectKey(automation.cwd),
        groupLabels,
        projectName(automation.cwd),
      );
      return `${automation.name}\n${automation.prompt}\n${project}\n${automation.cwd}`
        .toLocaleLowerCase()
        .includes(needle);
    });
  }, [scoped, groupLabels, query]);
  const selected = automations.find((entry) => entry.id === shownId) ?? null;

  const defaultDraftTarget = () => {
    const project =
      cwd && looksLikeProject(cwd) ? cwd : (recents[0]?.path ?? "~");
    const preferred = defaultSessionChoice(project);
    const harness = firstEnabledHarness(
      project,
      selected?.harness ?? preferred.harness,
    );
    const model =
      (selected?.harness === harness ? selected.model : undefined) ??
      (preferred.harness === harness ? preferred.model : undefined) ??
      modelsFor(harness)[0]?.id ??
      preferredModelId(harness);
    return { project, harness, model };
  };

  const beginCreate = () => {
    setPickerOpen(true);
    setDraft(null);
  };

  const beginBlank = () => {
    const { project, harness, model } = defaultDraftTarget();
    setPickerOpen(false);
    setDraft(newAutomationDraft(project, harness, model));
  };

  const beginFromTemplate = (template: AutomationTemplate) => {
    const { project, harness, model } = defaultDraftTarget();
    setPickerOpen(false);
    setDraft(draftFromTemplate(project, harness, model, template));
  };

  const onSave = async (event: FormEvent, nextDraft: AutomationDraft) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const saved = await saveAutomation(nextDraft);
      setPickerOpen(false);
      setDraft(null);
      setSelectedId(saved.id);
      await refresh();
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setSaving(false);
    }
  };

  const onRun = async (automation: Automation) => {
    if (running) return;
    setRunning(automation.id);
    try {
      const run = await createManualAutomationRun(automation.id);
      await onLaunch(automation, run);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setRunning(null);
    }
  };

  const onDelete = async (automation: Automation) => {
    if (
      !window.confirm(
        tNow("automations.view.deleteConfirm", { name: automation.name }),
      )
    )
      return;
    try {
      await deleteAutomation(automation.id);
      setSelectedId(null);
      await refresh();
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  };

  const onToggle = async (automation: Automation, enabled: boolean) => {
    try {
      await setAutomationEnabled(automation, enabled);
      await refresh();
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  };

  const editorDraft = pickerOpen
    ? null
    : (draft ?? (selected ? draftFromAutomation(selected) : null));
  const listLock = useLockOverscroll<HTMLDivElement>();

  return (
    <div className="flex min-h-0 min-w-0 flex-1 text-content">
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-stroke">
        <div className="flex h-9 shrink-0 items-center gap-1 border-b border-stroke px-2">
          <label className="relative flex h-7 min-w-0 flex-1 items-center">
            <Search className="pointer-events-none absolute left-2 size-3 shrink-0 text-content/40" />
            <span className="sr-only">{t("automations.view.filterLabel")}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("automations.view.filterLabel")}
              spellCheck={false}
              autoComplete="off"
              className="h-7 w-full rounded-md bg-transparent pl-7 pr-2 text-[12px] outline-none placeholder:text-content/40"
            />
          </label>
          <button
            type="button"
            title={t("automations.view.newLabel")}
            aria-label={t("automations.view.newLabel")}
            onClick={beginCreate}
            className="grid size-6 shrink-0 place-items-center rounded-md text-content/45 hover:bg-content/10 hover:text-content"
          >
            <Plus className="size-3.5" strokeWidth={1.75} />
          </button>
        </div>
        <div
          ref={listLock}
          className="min-h-0 flex-1 overflow-y-auto overscroll-none p-1.5"
        >
          {loading ? (
            <div className="grid place-items-center py-12 text-content/35">
              <LoaderCircle className="size-4 animate-spin" />
            </div>
          ) : visible.length > 0 ? (
            <ul className="space-y-0.5">
              {visible.map((automation) => (
                <li key={automation.id}>
                  <AutomationCard
                    automation={automation}
                    active={
                      !pickerOpen &&
                      automation.id === selected?.id &&
                      (!draft || draft.id === automation.id)
                    }
                    logos={logos}
                    labels={groupLabels}
                    mascots={groupMascots}
                    colors={groupColors}
                    customColors={groupCustomColors}
                    onSelect={() => {
                      setPickerOpen(false);
                      setDraft(null);
                      setSelectedId(automation.id);
                    }}
                    onToggle={(enabled) => void onToggle(automation, enabled)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-8 text-center text-[12px] text-content/45">
              {query.trim()
                ? t("automations.view.noMatches")
                : t("automations.view.empty")}
            </p>
          )}
        </div>
      </aside>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        {error ? (
          <div className="m-4 flex shrink-0 items-start gap-2 rounded-lg border border-red-400/20 bg-red-400/8 px-3 py-2 text-[12px] text-red-300">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}
        {loading && !editorDraft ? (
          <div className="grid min-h-0 flex-1 place-items-center text-content/35">
            <LoaderCircle className="size-4 animate-spin" />
          </div>
        ) : editorDraft ? (
          <AutomationEditor
            key={editorDraft.id ?? "new"}
            draft={editorDraft}
            recents={recents}
            runs={editorDraft.id ? runs : []}
            saving={saving}
            running={editorDraft.id === running}
            dirty={draft != null}
            onChange={setDraft}
            onClose={() => {
              setDraft(null);
              if (!editorDraft.id) setPickerOpen(true);
            }}
            onSubmit={(event) => onSave(event, editorDraft)}
            onRun={
              selected && editorDraft.id
                ? () => void onRun(selected)
                : undefined
            }
            onDelete={
              selected && editorDraft.id
                ? () => void onDelete(selected)
                : undefined
            }
            onOpenSession={async (sessionId) => {
              try {
                await onOpenSession(sessionId);
              } catch (reason: unknown) {
                setError(
                  reason instanceof Error ? reason.message : String(reason),
                );
              }
            }}
          />
        ) : (
          <AutomationPicker onBlank={beginBlank} onPick={beginFromTemplate} />
        )}
      </main>
    </div>
  );
}

function AutomationCard({
  automation,
  active,
  logos,
  labels,
  mascots,
  colors,
  customColors,
  onSelect,
  onToggle,
}: {
  automation: Automation;
  active: boolean;
  logos: Record<string, string>;
  labels: Record<string, string>;
  mascots: Record<string, string>;
  colors: Record<string, number>;
  customColors: Record<string, string>;
  onSelect: () => void;
  onToggle: (enabled: boolean) => void;
}) {
  const seed = projectName(automation.cwd);
  const key = projectKey(automation.cwd);
  const project = resolveTabGroupLabel(key, labels, seed);
  const logoPath = resolveTabGroupLogo(key, logos);
  const mascotName = resolveTabGroupMascot(key, mascots);
  const mascotColor = resolveTabGroupColor(key, colors, customColors, seed);
  const lastRun = automation.lastRunAt
    ? formatRelativeTime(new Date(automation.lastRunAt).toISOString())
    : null;
  const model = resolveModel(automation.harness, automation.model);
  const t = useT();
  return (
    <div
      className={`group relative rounded-md border ${
        active
          ? "border-transparent bg-selection"
          : "border-transparent hover:bg-content/5"
      }`}
    >
      <button
        type="button"
        aria-current={active ? "true" : undefined}
        aria-label={t("automations.card.openLabel", { name: automation.name })}
        onClick={onSelect}
        className="block w-full rounded-md px-2.5 py-2 text-left"
      >
        <span className="flex min-w-0 items-center gap-1.5 pr-8 text-[10px] text-content/45">
          <TriggerMark
            kind={
              automationTriggers(automation)[0]?.kind ?? automation.triggerKind
            }
            className="size-3"
          />
          <span className="min-w-0 truncate">{triggerLabel(automation, t)}</span>
        </span>
        <span className="mt-1 block truncate text-[13px] font-semibold text-content">
          {automation.name}
        </span>
        <span className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-content/45">
          {logoPath ? (
            <ProjectLogoIcon
              path={logoPath}
              className="size-3.5 shrink-0 rounded-sm"
              imageClassName="size-3.5"
            />
          ) : (
            <ProjectMascot
              project={seed}
              color={mascotColor}
              name={mascotName}
              className="size-3 shrink-0"
            />
          )}
          <span className="min-w-0 truncate">{project}</span>
          {lastRun ? (
            <>
              <span className="shrink-0">·</span>
              <span className="shrink-0">{lastRun}</span>
            </>
          ) : null}
          <span
            title={model.name}
            className="ml-auto flex min-w-0 max-w-28 items-center gap-1 text-content/50"
          >
            <HarnessIcon
              harness={automation.harness}
              className="size-3.5 shrink-0"
            />
            <span className="min-w-0 truncate">{model.name}</span>
          </span>
        </span>
      </button>
      <span className="absolute right-2.5 top-2 flex">
        <ToggleSwitch
          label={
            automation.enabled
              ? t("automations.card.pauseLabel", { name: automation.name })
              : t("automations.card.enableLabel", { name: automation.name })
          }
          on={automation.enabled}
          onChange={onToggle}
          compact
        />
      </span>
    </div>
  );
}

function AutomationPicker({
  onBlank,
  onPick,
}: {
  onBlank: () => void;
  onPick: (template: AutomationTemplate) => void;
}) {
  const [category, setCategory] =
    useState<AutomationTemplateCategoryId>("popular");
  const lockOverscroll = useLockOverscroll<HTMLDivElement>();
  const t = useT();
  const templates = templatesForCategory(category);

  return (
    <div
      ref={lockOverscroll}
      className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-none"
    >
      <div className="mx-auto w-full max-w-5xl px-8 pt-5 pb-10">
        <h1 className="text-[20px] font-semibold leading-tight text-content">
          {t("automations.picker.title")}
        </h1>
        <p className="mt-1.5 text-[13px] text-content/50">
          {t("automations.picker.subtitle")}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {AUTOMATION_TEMPLATE_CATEGORIES.map((option) => {
            const selected = option.id === category;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setCategory(option.id)}
                className={`h-7 rounded-full px-3 text-[12px] font-medium ${
                  selected
                    ? "bg-content text-background-base"
                    : "text-content/55 hover:bg-content/8 hover:text-content"
                }`}
              >
                {t(option.labelKey)}
              </button>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 min-[780px]:grid-cols-2">
          <button
            type="button"
            onClick={onBlank}
            className="flex min-h-37 flex-col rounded-xl border border-dashed border-content/15 p-4 text-left hover:border-content/25 hover:bg-content/5"
          >
            <div className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-content/8 text-content/70">
                <Plus className="size-4" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium text-content">
                  {t("automations.picker.blankTitle")}
                </span>
                <span className="mt-1 block text-[12px] leading-snug text-content/50">
                  {t("automations.picker.blankDescription")}
                </span>
              </span>
            </div>
          </button>
          {templates.map((template) => {
            const Icon = TEMPLATE_ICONS[template.icon];
            const copy = AUTOMATION_TEMPLATE_MESSAGES[template.id];
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onPick(template)}
                className="flex min-h-37 flex-col rounded-xl border border-content/10 p-4 text-left hover:border-content/16 hover:bg-content/5"
              >
                <div className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-content/8 text-content/70">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium text-content">
                      {copy ? t(copy.name) : template.name}
                    </span>
                    <span className="mt-1 block text-[12px] leading-snug text-content/50">
                      {copy ? t(copy.description) : template.description}
                    </span>
                  </span>
                </div>
                <span className="mt-auto flex min-w-0 items-center gap-1.5 pt-3 text-[11px] text-content/45">
                  <TriggerMark
                    kind={template.trigger.kind}
                    className="size-3"
                  />
                  <span className="min-w-0 truncate">
                    {copy ? t(copy.triggerLabel) : template.triggerLabel}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const RUN_GRID =
  "grid grid-cols-[minmax(0,1.4fr)_9.5rem_6.75rem_3.5rem] items-center gap-4 px-4";

function RunRow({
  run,
  draft,
  onOpenSession,
}: {
  run: AutomationRun;
  draft: AutomationDraft;
  onOpenSession: (sessionId: string) => void | Promise<void>;
}) {
  const t = useT();
  const trigger = runTriggerMeta(run, draft, t);
  const sessionId = run.sessionId;
  return (
    <li>
      <button
        type="button"
        disabled={!sessionId}
        title={
          sessionId
            ? t("automations.runs.openSession")
            : (run.error ?? t("automations.runs.noSession"))
        }
        onClick={() => {
          if (!sessionId) return;
          void onOpenSession(sessionId);
        }}
        className={`${RUN_GRID} h-11 w-full text-left text-[13px] disabled:opacity-100 ${
          sessionId ? "cursor-pointer hover:bg-content/5" : "cursor-default"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2 text-content">
          <TriggerMark
            kind={trigger.kind}
            className="size-3.5 shrink-0 text-content/40"
          />
          <span className="min-w-0 truncate">{trigger.label}</span>
        </span>
        <span className="truncate text-content/70">
          {formatAutomationRunAt(run.scheduledFor || run.createdAt)}
        </span>
        <span>
          <RunStatusPill status={run.status} />
        </span>
        <span className="text-right tabular-nums text-content/55">
          {formatAutomationRunDuration(run)}
        </span>
      </button>
    </li>
  );
}

function RunStatusPill({ status }: { status: AutomationRun["status"] }) {
  const t = useT();
  const running = status === "running";
  return (
    <span
      className={`inline-flex h-5 max-w-full items-center gap-1 rounded-full px-2 text-[11px] font-medium ${runStatusTone(status)}`}
    >
      {running ? (
        <LoaderCircle className="size-2.5 shrink-0 animate-spin" />
      ) : null}
      {runStatusLabel(status, t)}
    </span>
  );
}

function runStatusLabel(status: AutomationRun["status"], t: TFunction): string {
  if (status === "succeeded") return t("automations.runs.succeeded");
  if (status === "failed") return t("automations.runs.failed");
  if (status === "skipped") return t("automations.runs.skipped");
  if (status === "cancelled") return t("automations.runs.cancelled");
  if (status === "running") return t("automations.runs.running");
  return t("automations.runs.pending");
}

function runStatusTone(status: AutomationRun["status"]): string {
  if (status === "succeeded") return "bg-emerald-500/12 text-emerald-400";
  if (status === "failed") return "bg-rose-500/12 text-rose-400";
  if (status === "skipped") return "bg-amber-500/12 text-amber-400";
  if (status === "cancelled") return "bg-content/8 text-content/50";
  return "bg-blue-500/12 text-blue-400";
}

function runTriggerMeta(
  run: AutomationRun,
  draft: AutomationDraft,
  t: TFunction,
): { kind: AutomationTriggerKind; label: string } {
  if (run.trigger === "manual") {
    return { kind: "time", label: t("automations.runs.testRun") };
  }
  if (run.trigger === "event") {
    const kind = run.eventKind ?? draft.triggerKind;
    const event = run.event ?? draft.triggerEvent;
    const match = findTriggerEvent(kind, event);
    return {
      kind,
      label: match ? t(match.labelKey) : triggerName(kind, t),
    };
  }
  const times = draft.triggers.filter((trigger) => trigger.kind === "time");
  if (times[0]) {
    return {
      kind: "time",
      label: t("automations.runs.scheduled", {
        schedule: automationScheduleLabel(times[0], t),
      }),
    };
  }
  const first = draft.triggers[0];
  if (!first) return { kind: "time", label: t("automations.trigger.scheduled") };
  const match = findTriggerEvent(first.kind, first.event);
  return {
    kind: first.kind,
    label: match ? t(match.labelKey) : triggerName(first.kind, t),
  };
}

function AutomationEditor({
  draft,
  recents,
  runs,
  saving,
  running,
  dirty,
  onChange,
  onClose,
  onSubmit,
  onRun,
  onDelete,
  onOpenSession,
}: {
  draft: AutomationDraft;
  recents: RecentProject[];
  runs: AutomationRun[];
  saving: boolean;
  running: boolean;
  dirty: boolean;
  onChange: (draft: AutomationDraft) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  onRun?: () => void;
  onDelete?: () => void;
  onOpenSession: (sessionId: string) => void | Promise<void>;
}) {
  const t = useT();
  const [tab, setTab] = useState<"settings" | "history">("settings");
  const settingsTabId = useId();
  const historyTabId = useId();
  const tabPanelId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [triggerOpen, setTriggerOpen] = useState(false);
  const [triggerQuery, setTriggerQuery] = useState("");
  const [triggerCategory, setTriggerCategory] =
    useState<AutomationTriggerKind | null>(null);
  const triggerButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const triggerCategoryAnchors = useRef<
    Partial<Record<AutomationTriggerKind, HTMLButtonElement>>
  >({});
  const [providerConnected, setProviderConnected] = useState({
    github: false,
    linear: false,
    jira: false,
    gitlab: false,
    azuredevops: false,
  });
  const controlsBeside =
    useSyncExternalStore(subscribeModelControls, loadModelControls) ===
    "beside";
  const lockOverscroll = useLockOverscroll<HTMLDivElement>();
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      void Promise.all([
        githubStatus()
          .then((status) => status.connected)
          .catch(() => false),
        linearConnected()
          .then((status) => status.connected)
          .catch(() => false),
        jiraConnected()
          .then((status) => status.connected)
          .catch(() => false),
        gitlabConnected()
          .then((status) => status.connected)
          .catch(() => false),
        azureDevOpsConnected()
          .then((status) => status.connected)
          .catch(() => false),
      ]).then(([github, linear, jira, gitlab, azuredevops]) => {
        if (!cancelled) {
          setProviderConnected({ github, linear, jira, gitlab, azuredevops });
        }
      });
    };
    load();
    window.addEventListener(LINEAR_CHANGE_EVENT, load);
    window.addEventListener(JIRA_CHANGE_EVENT, load);
    window.addEventListener(GITLAB_CHANGE_EVENT, load);
    window.addEventListener(AZUREDEVOPS_CHANGE_EVENT, load);
    return () => {
      cancelled = true;
      window.removeEventListener(LINEAR_CHANGE_EVENT, load);
      window.removeEventListener(JIRA_CHANGE_EVENT, load);
      window.removeEventListener(GITLAB_CHANGE_EVENT, load);
      window.removeEventListener(AZUREDEVOPS_CHANGE_EVENT, load);
    };
  }, []);
  const triggerReady = (kind: AutomationTriggerKind) => {
    if (kind === "time") return true;
    return providerConnected[kind];
  };
  const valid =
    draft.name.trim().length > 0 &&
    draft.prompt.trim().length > 0 &&
    looksLikeProject(draft.cwd) &&
    draft.model.length > 0;
  const [sessionFolders, setSessionFolders] = useState(() =>
    loadSessionFolders(draft.cwd),
  );
  useEffect(() => {
    setSessionFolders(loadSessionFolders(draft.cwd));
    return subscribeSessionFolders(draft.cwd, () => {
      setSessionFolders(loadSessionFolders(draft.cwd));
    });
  }, [draft.cwd]);
  const folderOptions = useMemo(() => {
    const options = [
      { value: "", label: t("automations.editor.noFolder") },
      ...sessionFolders.map((folder) => ({
        value: folder.id,
        label: folder.name,
        keywords: folder.name,
      })),
    ];
    if (
      draft.sessionFolderId &&
      !sessionFolders.some((folder) => folder.id === draft.sessionFolderId)
    ) {
      options.push({
        value: draft.sessionFolderId,
        label: t("automations.editor.removedFolder"),
        keywords: draft.sessionFolderId,
      });
    }
    return options;
  }, [draft.sessionFolderId, sessionFolders, t]);
  const update = <K extends keyof AutomationDraft>(
    key: K,
    value: AutomationDraft[K],
  ) => onChange({ ...draft, [key]: value });
  const triggerCategories = useMemo(
    () =>
      TRIGGER_CATEGORIES.filter((option) =>
        t(option.labelKey)
          .toLocaleLowerCase()
          .includes(triggerQuery.toLocaleLowerCase()),
      ),
    [triggerQuery, t],
  );
  useEffect(() => {
    if (
      triggerCategory &&
      !triggerCategories.some((option) => option.value === triggerCategory)
    ) {
      setTriggerCategory(null);
    }
  }, [triggerCategories, triggerCategory]);
  const setTriggers = (triggers: AutomationTrigger[]) =>
    onChange(applyTriggers(draft, triggers));
  const selectTrigger = (kind: AutomationTriggerKind, event: TriggerEvent) => {
    if (draft.triggers.length >= 20 || !triggerReady(kind)) {
      setTriggerCategory(null);
      setTriggerOpen(false);
      return;
    }
    setTriggers([
      ...draft.triggers,
      createAutomationTrigger(kind, event.value),
    ]);
    setTriggerCategory(null);
    setTriggerOpen(false);
  };
  const updateTrigger = (next: AutomationTrigger) =>
    setTriggers(
      draft.triggers.map((trigger) =>
        trigger.id === next.id ? next : trigger,
      ),
    );

  const historyAvailable = Boolean(draft.id);
  const showingHistory = historyAvailable && tab === "history";

  return (
    <form className="flex min-h-0 min-w-0 flex-1 flex-col" onSubmit={onSubmit}>
      <div className="relative w-full shrink-0 border-b border-stroke">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2.5 px-8 pt-5">
          <header className="flex flex-col gap-2.5">
            <div className="flex items-start gap-6">
              <input
                autoFocus
                aria-label={t("automations.editor.nameLabel")}
                value={draft.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder={t("automations.editor.untitled")}
                className="min-w-0 flex-1 bg-transparent text-[20px] font-semibold leading-tight text-content outline-none placeholder:text-content/35"
              />
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                {!draft.id || dirty ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className={ACTION_OUTLINE}
                  >
                    {draft.id
                      ? t("automations.editor.reset")
                      : t("automations.editor.cancel")}
                  </button>
                ) : null}
                {onRun ? (
                  <button
                    type="button"
                    onClick={onRun}
                    disabled={running}
                    className={ACTION_OUTLINE}
                  >
                    {running ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      <Play className="size-3.5" />
                    )}
                    {t("automations.editor.runNow")}
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={!valid || saving || (!!draft.id && !dirty)}
                  className={ACTION_FILLED}
                >
                  {saving ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : null}
                  {draft.id
                    ? t("automations.editor.save")
                    : t("automations.editor.create")}
                </button>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-[12px] text-content/50">
              <ToggleSwitch
                label={
                  draft.enabled
                    ? t("automations.editor.pauseLabel")
                    : t("automations.editor.enableLabel")
                }
                on={draft.enabled}
                onChange={(enabled) => update("enabled", enabled)}
                compact
              />
              <span className="shrink-0">
                {draft.enabled
                  ? t("automations.editor.active")
                  : t("automations.editor.inactive")}
              </span>
              <span
                aria-hidden
                className="h-3 ml-2 w-px shrink-0 bg-content/15"
              />
              <SearchableProjectPicker
                cwd={draft.cwd}
                recents={recents}
                onSelectProject={(cwd) =>
                  onChange({ ...draft, cwd, sessionFolderId: "" })
                }
              />
              {onDelete ? (
                <>
                  <span
                    aria-hidden
                    className="h-3 w-px shrink-0 bg-content/15"
                  />
                  <button
                    ref={menuButton}
                    type="button"
                    title={t("automations.editor.actionsLabel")}
                    aria-label={t("automations.editor.actionsLabel")}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                    className={`grid size-6.5 shrink-0 place-items-center rounded-md ${
                      menuOpen
                        ? "bg-selection text-content"
                        : "text-content/50 hover:bg-content/5 hover:text-content"
                    }`}
                  >
                    <MoreHorizontal className="size-3.5" strokeWidth={1.75} />
                  </button>
                  {menuOpen ? (
                    <Popover
                      anchor={menuButton}
                      side="bottom"
                      align="start"
                      gap={4}
                      width={200}
                      constrainHeight={false}
                      role="menu"
                      aria-label={t("automations.editor.actionsLabel")}
                      onDismiss={() => setMenuOpen(false)}
                      className="p-1"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          onDelete();
                        }}
                        className="flex h-8 w-full items-center gap-2 rounded-lg px-2 text-left text-[13px] text-red-300/90 hover:bg-red-500/15"
                      >
                        <Trash2 className="size-3.5" strokeWidth={1.75} />
                        {t("automations.editor.deleteItem")}
                      </button>
                    </Popover>
                  ) : null}
                </>
              ) : null}
            </div>
          </header>
          {historyAvailable ? (
            <div
              role="tablist"
              aria-label={t("automations.editor.viewLabel")}
              className="flex h-9 items-stretch gap-4"
            >
              <PageTab
                id={settingsTabId}
                controls={tabPanelId}
                label={t("automations.editor.tabSettings")}
                selected={!showingHistory}
                onSelect={() => setTab("settings")}
              />
              <PageTab
                id={historyTabId}
                controls={tabPanelId}
                label={t("automations.editor.tabHistory")}
                selected={showingHistory}
                onSelect={() => setTab("history")}
              />
            </div>
          ) : (
            <div className="pb-5" />
          )}
        </div>
      </div>

      <div
        ref={lockOverscroll}
        id={historyAvailable ? tabPanelId : undefined}
        role={historyAvailable ? "tabpanel" : undefined}
        aria-labelledby={
          historyAvailable
            ? showingHistory
              ? historyTabId
              : settingsTabId
            : undefined
        }
        className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-none"
      >
        {!showingHistory ? (
          <div className="mx-auto w-full max-w-5xl space-y-8 px-8 py-5 pb-10">
            <section>
              <SectionTitle>{t("automations.editor.triggers")}</SectionTitle>
              <div className="mt-3 rounded-md border border-content/10">
                {draft.triggers.length > 0 ? (
                  <ul className="px-3 py-1.5">
                    {draft.triggers.map((trigger) => (
                      <li key={trigger.id}>
                        <TriggerRow
                          trigger={trigger}
                          cwd={draft.cwd}
                          onChange={updateTrigger}
                          onRemove={() =>
                            setTriggers(
                              draft.triggers.filter(
                                (entry) => entry.id !== trigger.id,
                              ),
                            )
                          }
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
                {draft.triggers.length > 0 ? (
                  <div className="border-t border-content/8" />
                ) : null}
                <button
                  ref={triggerButton}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={triggerOpen}
                  disabled={draft.triggers.length >= 20}
                  onClick={() => {
                    setTriggerQuery("");
                    setTriggerCategory(null);
                    setTriggerOpen((open) => !open);
                  }}
                  className={`flex h-12 w-full items-center gap-2 px-3 text-left text-[13px] text-content/55 transition-colors duration-150 ease-out hover:bg-content/4 hover:text-content disabled:pointer-events-none disabled:opacity-40 ${
                    draft.triggers.length > 0 ? "rounded-b-md" : "rounded-md"
                  }`}
                >
                  <Plus className="size-3.5" />
                  {t("automations.editor.addTrigger")}
                </button>
              </div>
              {triggerOpen ? (
                <Popover
                  anchor={triggerButton}
                  side="bottom"
                  align="start"
                  gap={4}
                  width={250}
                  role="menu"
                  aria-label={t("automations.editor.chooseTriggerLabel")}
                  layer={LAYER.popover}
                  ignore="[data-trigger-submenu]"
                  onDismiss={() => {
                    setTriggerCategory(null);
                    setTriggerOpen(false);
                  }}
                  className="overflow-hidden"
                >
                  <label className="flex h-11 items-center gap-2.5 border-b border-stroke px-3 text-content/45 focus-within:text-content/70">
                    <Search className="size-3.5 shrink-0" strokeWidth={1.75} />
                    <span className="sr-only">
                      {t("automations.editor.searchTriggers")}
                    </span>
                    <input
                      autoFocus
                      value={triggerQuery}
                      onChange={(event) => setTriggerQuery(event.target.value)}
                      placeholder={t("automations.editor.searchTriggers")}
                      className="min-w-0 flex-1 bg-transparent text-[13px] text-content outline-none placeholder:text-content/35"
                    />
                  </label>
                  <div className="p-1">
                    {triggerCategories.map((option) => {
                      const ready = triggerReady(option.value);
                      return (
                        <button
                          key={option.value}
                          ref={(node) => {
                            if (node)
                              triggerCategoryAnchors.current[option.value] =
                                node;
                            else
                              delete triggerCategoryAnchors.current[
                                option.value
                              ];
                          }}
                          type="button"
                          role="menuitem"
                          aria-haspopup={ready ? "menu" : undefined}
                          aria-expanded={triggerCategory === option.value}
                          aria-disabled={ready ? undefined : true}
                          title={
                            ready
                              ? undefined
                              : t("automations.editor.connectProvider", {
                                  provider: t(option.labelKey),
                                })
                          }
                          onMouseEnter={() =>
                            setTriggerCategory(ready ? option.value : null)
                          }
                          onFocus={() =>
                            setTriggerCategory(ready ? option.value : null)
                          }
                          onClick={() => {
                            if (!ready) return;
                            setTriggerCategory(option.value);
                          }}
                          className={`flex h-9 w-full items-center gap-2 rounded-lg px-2 text-left text-[13px] ${
                            !ready
                              ? "cursor-default text-content/35"
                              : triggerCategory === option.value
                                ? "bg-selection text-content"
                                : "text-content/70 hover:bg-content/5 hover:text-content"
                          }`}
                        >
                          <TriggerMark
                            kind={option.value}
                            className="size-3.5 shrink-0"
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {t(option.labelKey)}
                          </span>
                          {ready ? (
                            <ChevronRight className="size-3.5 text-content/45" />
                          ) : (
                            <span className="shrink-0 text-[11px] text-content/35">
                              {t("automations.editor.notConnected")}
                            </span>
                          )}
                        </button>
                      );
                    })}
                    {triggerCategories.length === 0 ? (
                      <p className="px-2 py-5 text-center text-[12px] text-content/40">
                        {t("automations.editor.noMatchingTriggers")}
                      </p>
                    ) : null}
                  </div>
                </Popover>
              ) : null}
              {triggerOpen &&
              triggerCategory &&
              triggerCategories.some(
                (option) => option.value === triggerCategory,
              ) &&
              triggerReady(triggerCategory) ? (
                <Popover
                  anchor={
                    triggerCategoryAnchors.current[triggerCategory] ?? null
                  }
                  side="right"
                  align="start"
                  gap={4}
                  width={220}
                  maxHeight={360}
                  role="menu"
                  aria-label={t("automations.editor.eventsLabel", {
                    name: triggerName(triggerCategory, t),
                  })}
                  layer={LAYER.submenu}
                  data-trigger-submenu
                  onDismiss={(reason) => {
                    if (reason === "escape") setTriggerCategory(null);
                  }}
                  className="overflow-y-auto p-1"
                >
                  {TRIGGER_EVENTS[triggerCategory].map((event) => (
                    <button
                      key={event.value}
                      type="button"
                      role="menuitem"
                      onClick={() => selectTrigger(triggerCategory, event)}
                      className="flex h-9 w-full items-center rounded-lg px-2 text-left text-[13px] text-content/75 hover:bg-content/5 hover:text-content"
                    >
                      {t(event.labelKey)}
                    </button>
                  ))}
                </Popover>
              ) : null}
            </section>

            <section>
              <SectionTitle>{t("automations.editor.instructions")}</SectionTitle>
              <div className="relative mt-3 rounded-md border border-content/10 bg-content/3 backdrop-blur-sm has-focus:border-content/20">
                <PromptField
                  value={draft.prompt}
                  harness={draft.harness}
                  cwd={draft.cwd}
                  onChange={(prompt) => update("prompt", prompt)}
                />
                <div className="flex items-center gap-1 px-2 pb-2">
                  <div className="flex min-w-0 flex-1 items-center overflow-x-auto">
                    <div className="flex shrink-0 items-center gap-1">
                      <ModelPicker
                        harness={draft.harness}
                        model={draft.model}
                        values={draft.modelSettings}
                        project={draft.cwd}
                        hideSettings={controlsBeside}
                        onChange={(harness, model) =>
                          onChange({ ...draft, harness, model })
                        }
                        onSettingsChange={(modelSettings) =>
                          update("modelSettings", modelSettings)
                        }
                      />
                      {controlsBeside ? (
                        <ModelControlPills
                          harness={draft.harness}
                          model={draft.model}
                          values={draft.modelSettings}
                          onSettingsChange={(modelSettings) =>
                            update("modelSettings", modelSettings)
                          }
                        />
                      ) : null}
                      {draft.harness !== "fx" ? (
                        <AccessPicker
                          value={draft.runtimeMode}
                          onChange={(runtimeMode) =>
                            update("runtimeMode", runtimeMode)
                          }
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-2 px-1 text-[11px] text-content/35">
                {t("automations.editor.promptHint")}
              </p>
            </section>

            <section>
              <SectionTitle>{t("automations.editor.session")}</SectionTitle>
              <div className="mt-3 divide-y divide-content/7 rounded-md border border-content/10">
                <SettingsRow
                  label={t("automations.editor.workingCopy")}
                  hint={t("automations.editor.workingCopyHint")}
                >
                  <SettingsSelect
                    label={t("automations.editor.workingCopy")}
                    value={
                      draft.workspaceMode === "worktree"
                        ? "worktree"
                        : "current"
                    }
                    options={localizeOptions(WORKSPACE_OPTIONS, t)}
                    onChange={(value) =>
                      onChange({
                        ...draft,
                        workspaceMode: value as "current" | "worktree",
                        worktreeCwd: "",
                        reuseSession: value === "current" && draft.reuseSession,
                      })
                    }
                  />
                </SettingsRow>
                <SettingsRow
                  label={t("automations.editor.conversation")}
                  hint={t("automations.editor.conversationHint")}
                >
                  <SettingsSelect
                    label={t("automations.editor.conversation")}
                    value={draft.reuseSession ? "reuse" : "fresh"}
                    disabled={draft.workspaceMode === "worktree"}
                    options={localizeOptions(CONVERSATION_OPTIONS, t)}
                    onChange={(value) =>
                      update("reuseSession", value === "reuse")
                    }
                  />
                </SettingsRow>
                <SettingsRow
                  label={t("automations.editor.sessionFolder")}
                  hint={t("automations.editor.sessionFolderHint")}
                >
                  <SearchableSelect
                    variant="pill"
                    searchable={folderOptions.length > 6}
                    align="end"
                    label={t("automations.editor.sessionFolder")}
                    value={draft.sessionFolderId}
                    options={folderOptions}
                    onChange={(value) => update("sessionFolderId", value)}
                  />
                </SettingsRow>
              </div>
            </section>

            <details className="rounded-md border border-content/10">
              <summary className="flex min-h-14 cursor-default list-none items-center justify-between gap-3 px-4 active:opacity-75">
                <span>
                  <span className="block text-[13px] font-medium text-content/75">
                    {t("automations.editor.advanced")}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-content/40">
                    {t("automations.editor.advancedHint")}
                  </span>
                </span>
                <ChevronDown className="size-3.5 text-content/40" />
              </summary>
              <div className="divide-y divide-content/7 border-t border-content/8">
                <SettingsRow
                  label={t("automations.editor.missedRunGrace")}
                  hint={t("automations.editor.missedRunGraceHint")}
                >
                  <SettingsSelect
                    label={t("automations.editor.missedRunGrace")}
                    value={String(draft.missedRunGraceMinutes)}
                    options={localizeOptions(GRACE_OPTIONS, t)}
                    onChange={(value) =>
                      update("missedRunGraceMinutes", Number(value))
                    }
                  />
                </SettingsRow>
              </div>
            </details>
          </div>
        ) : (
          <section className="mx-auto w-full max-w-5xl px-8 py-5 pb-10">
            <SectionTitle>{t("automations.editor.tabHistory")}</SectionTitle>
            {runs.length > 0 ? (
              <div className="mt-3 overflow-hidden rounded-md border border-content/10">
                <div className={`${RUN_GRID} h-10 text-[11px] text-content/40`}>
                  <span>{t("automations.runs.trigger")}</span>
                  <span>{t("automations.runs.triggered")}</span>
                  <span>{t("automations.runs.status")}</span>
                  <span className="text-right">
                    {t("automations.runs.duration")}
                  </span>
                </div>
                <ul className="divide-y divide-content/8 border-t border-content/8">
                  {runs.slice(0, 100).map((run) => (
                    <RunRow
                      key={run.id}
                      run={run}
                      draft={draft}
                      onOpenSession={onOpenSession}
                    />
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-3 rounded-md border border-dashed border-content/10 px-4 py-16 text-center text-[12px] text-content/40">
                {t("automations.editor.notRunYet")}
              </div>
            )}
          </section>
        )}
      </div>
    </form>
  );
}

function PromptField({
  value,
  harness,
  cwd,
  onChange,
}: {
  value: string;
  harness: AutomationDraft["harness"];
  cwd: string;
  onChange: (value: string) => void;
}) {
  return (
    <SkillPromptField
      value={value}
      harness={harness}
      cwd={cwd}
      onChange={onChange}
    />
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="px-1 text-[12px] font-medium text-content/50">{children}</h2>
  );
}

function SettingsRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5">
      <span className="min-w-0">
        <span className="block text-[12px] text-content/75">{label}</span>
        {hint ? (
          <span className="mt-0.5 block text-[11px] leading-snug text-content/40">
            {hint}
          </span>
        ) : null}
      </span>
      <span className="shrink-0">{children}</span>
    </div>
  );
}

function SettingsSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <SearchableSelect
      variant="pill"
      searchable={false}
      align="end"
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

function PageTab({
  id,
  controls,
  label,
  selected,
  onSelect,
}: {
  id: string;
  controls: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={controls}
      onClick={onSelect}
      className={`relative flex h-9 items-center text-[12px] leading-none ${
        selected ? "text-content" : "text-content/50 hover:text-content"
      }`}
    >
      {label}
      {selected ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-content" />
      ) : null}
    </button>
  );
}

function ToggleSwitch({
  label,
  on,
  onChange,
  compact = false,
}: {
  label: string;
  on: boolean;
  onChange: (on: boolean) => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative shrink-0 rounded-full transition-colors duration-150 ease-out active:scale-[0.96] ${
        compact ? "h-4 w-7" : "h-5 w-9"
      } ${on ? "bg-accent" : "bg-content/20"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 rounded-full bg-white transition-transform duration-150 ease-out ${
          compact
            ? `size-3 ${on ? "translate-x-3" : "translate-x-0"}`
            : `size-4 ${on ? "translate-x-4" : "translate-x-0"}`
        }`}
      />
    </button>
  );
}

const WORKSPACE_OPTIONS = [
  { value: "current", labelKey: "automations.options.currentCopy" },
  { value: "worktree", labelKey: "automations.options.freshWorktree" },
] as const satisfies readonly { value: string; labelKey: MessageKey }[];

const CONVERSATION_OPTIONS = [
  { value: "fresh", labelKey: "automations.options.startFresh" },
  { value: "reuse", labelKey: "automations.options.continueLast" },
] as const satisfies readonly { value: string; labelKey: MessageKey }[];

const GRACE_OPTIONS = [
  { value: "0", labelKey: "automations.options.noCatchUp" },
  { value: "30", labelKey: "automations.options.minutes30" },
  { value: "120", labelKey: "automations.options.hours2" },
  { value: "720", labelKey: "automations.options.hours12" },
  { value: "1440", labelKey: "automations.options.hours24" },
] as const satisfies readonly { value: string; labelKey: MessageKey }[];

/** Turns keyed options into the label/value pairs the select components take. */
function localizeOptions(
  options: readonly { value: string; labelKey: MessageKey }[],
  t: TFunction,
): { value: string; label: string }[] {
  return options.map((option) => ({
    value: option.value,
    label: t(option.labelKey),
  }));
}

const TEMPLATE_ICONS: Record<AutomationTemplateIcon, typeof Search> = {
  search: Search,
  alert: AlertCircle,
  file: File,
  check: CheckCircle,
  lock: Lock,
  pr: GitPullRequest,
  inbox: Inbox,
  gauge: Gauge,
  terminal: Terminal,
  note: StickyNote,
};

const TRIGGER_CATEGORIES: readonly {
  value: AutomationTriggerKind;
  labelKey: MessageKey;
}[] = [
  { value: "time", labelKey: "automations.trigger.scheduled" },
  { value: "github", labelKey: "automations.trigger.github" },
  { value: "linear", labelKey: "automations.trigger.linear" },
  { value: "jira", labelKey: "automations.trigger.jira" },
  { value: "gitlab", labelKey: "automations.trigger.gitlab" },
  { value: "azuredevops", labelKey: "automations.trigger.azuredevops" },
];

type TriggerEvent = {
  value: string;
  labelKey: MessageKey;
};

const TRIGGER_EVENTS: Record<AutomationTriggerKind, readonly TriggerEvent[]> = {
  time: [
    { value: "hourly", labelKey: "automations.trigger.hourly" },
    { value: "daily", labelKey: "automations.trigger.daily" },
    { value: "weekdays", labelKey: "automations.trigger.weekdays" },
    { value: "weekly", labelKey: "automations.trigger.weekly" },
  ],
  github: [
    { value: "draft_opened", labelKey: "automations.trigger.draftOpened" },
    {
      value: "pull_request_opened",
      labelKey: "automations.trigger.pullRequestOpened",
    },
    { value: "issue_opened", labelKey: "automations.trigger.issueOpened" },
  ],
  linear: [
    { value: "issue_created", labelKey: "automations.trigger.issueCreated" },
  ],
  jira: [
    { value: "issue_created", labelKey: "automations.trigger.issueAppeared" },
  ],
  gitlab: [
    {
      value: "merge_request_opened",
      labelKey: "automations.trigger.mergeRequestOpened",
    },
    { value: "issue_opened", labelKey: "automations.trigger.issueOpened" },
  ],
  azuredevops: [
    {
      value: "pull_request_appeared",
      labelKey: "automations.trigger.pullRequestAppeared",
    },
    {
      value: "work_item_appeared",
      labelKey: "automations.trigger.workItemAppeared",
    },
  ],
};

function TriggerMark({
  kind,
  className,
}: {
  kind: AutomationTriggerKind;
  className?: string;
}) {
  if (kind === "time") {
    return <Clock className={className} strokeWidth={1.75} />;
  }
  return <InboxProviderMark provider={kind} className={className} />;
}

function triggerName(kind: AutomationTriggerKind, t: TFunction): string {
  const category = TRIGGER_CATEGORIES.find((option) => option.value === kind);
  return category ? t(category.labelKey) : kind;
}

function findTriggerEvent(
  kind: AutomationTriggerKind,
  value: string,
): TriggerEvent | undefined {
  return TRIGGER_EVENTS[kind].find((event) => event.value === value);
}

function triggerLabel(automation: Automation, t: TFunction): string {
  const triggers = automationTriggers(automation);
  if (triggers.length === 0) return t("automations.card.noTrigger");
  const first = triggers[0]!;
  const event =
    first.kind === "time" ? undefined : findTriggerEvent(first.kind, first.event);
  const label =
    first.kind === "time"
      ? automationScheduleLabel(first, t)
      : event
        ? t(event.labelKey)
        : triggerName(first.kind, t);
  return triggers.length > 1 ? `${label} +${triggers.length - 1}` : label;
}

function TriggerRow({
  trigger,
  cwd,
  onChange,
  onRemove,
}: {
  trigger: AutomationTrigger;
  cwd: string;
  onChange: (trigger: AutomationTrigger) => void;
  onRemove: () => void;
}) {
  const t = useT();
  const [branches, setBranches] = useState<string[]>([]);
  const projectPath = looksLikeProject(cwd) ? cwd : "";
  const push = trigger.event === "push_to_branch";
  useEffect(() => {
    if (!projectPath || !push) {
      setBranches([]);
      return;
    }
    let cancelled = false;
    void gitBranches(projectPath).then(
      (info) => {
        if (!cancelled) setBranches(info.branches.map((branch) => branch.name));
      },
      () => {
        if (!cancelled) setBranches([]);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [projectPath, push]);
  const branchOptions = branches.map((name) => ({ value: name, label: name }));
  if (
    trigger.branch &&
    !branchOptions.some((option) => option.value === trigger.branch)
  ) {
    branchOptions.unshift({ value: trigger.branch, label: trigger.branch });
  }
  const nextAt = trigger.kind === "time" ? nextAutomationRunAt(trigger) : 0;

  return (
    <div className="group flex min-h-10 items-center gap-2.5 py-1">
      <TriggerMark
        kind={trigger.kind}
        className="size-3.5 shrink-0 text-content/45"
      />
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-content/70">
        {trigger.kind === "time" ? (
          <TimeTriggerSentence
            trigger={trigger}
            nextAt={nextAt}
            onChange={onChange}
          />
        ) : (
          <EventTriggerSentence
            trigger={trigger}
            branchOptions={branchOptions}
            projectChosen={Boolean(projectPath)}
            onChange={onChange}
          />
        )}
      </div>
      <button
        type="button"
        aria-label={t("automations.trigger.removeLabel")}
        onClick={onRemove}
        className="grid size-7 shrink-0 place-items-center rounded-md text-content/35 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-content/8 hover:text-content focus-visible:opacity-100"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function TimeTriggerSentence({
  trigger,
  nextAt,
  onChange,
}: {
  trigger: AutomationTrigger;
  nextAt: number;
  onChange: (trigger: AutomationTrigger) => void;
}) {
  const t = useT();
  const dayOptions = AUTOMATION_WEEKDAY_KEYS.map((key, value) => ({
    value: String(value),
    label: t(key),
  }));
  const minuteOptions = [0, 15, 30, 45].map((value) => ({
    value: String(value),
    label: `:${String(value).padStart(2, "0")}`,
  }));
  const prefix =
    trigger.scheduleKind === "hourly"
      ? t("automations.trigger.everyHour")
      : trigger.scheduleKind === "daily"
        ? t("automations.trigger.everyDay")
        : trigger.scheduleKind === "weekdays"
          ? t("automations.trigger.everyWeekday")
          : t("automations.trigger.everyWeek");
  return (
    <>
      <span>{prefix}</span>
      {trigger.scheduleKind === "weekly" ? (
        <>
          <TriggerPill
            label={t("automations.trigger.dayPill")}
            value={String(trigger.dayOfWeek)}
            options={dayOptions}
            onChange={(value) =>
              onChange({ ...trigger, dayOfWeek: Number(value) })
            }
          />
          <span>{t("automations.trigger.at")}</span>
        </>
      ) : null}
      {trigger.scheduleKind === "hourly" ? (
        <TriggerPill
          label={t("automations.trigger.minutePill")}
          value={String(trigger.minute)}
          options={minuteOptions}
          onChange={(value) => onChange({ ...trigger, minute: Number(value) })}
        />
      ) : (
        <TriggerPill
          label={t("automations.trigger.timePill")}
          value={trigger.time}
          options={timeOptions(trigger.time)}
          onChange={(value) => onChange({ ...trigger, time: value })}
        />
      )}
      <span className="text-content/45">{gmtOffsetLabel()}</span>
      <span className="ml-1 text-content/35">
        {nextRunPreview(nextAt, t)}
      </span>
    </>
  );
}

function EventTriggerSentence({
  trigger,
  branchOptions,
  projectChosen,
  onChange,
}: {
  trigger: AutomationTrigger;
  branchOptions: { value: string; label: string }[];
  projectChosen: boolean;
  onChange: (trigger: AutomationTrigger) => void;
}) {
  const t = useT();
  const match = findTriggerEvent(trigger.kind, trigger.event);
  const stem =
    trigger.event === "push_to_branch"
      ? t("automations.trigger.push")
      : match
        ? t(match.labelKey)
        : trigger.event;
  const push = trigger.event === "push_to_branch";
  return (
    <>
      <span>{stem}</span>
      {push ? (
        <>
          <span>{t("automations.trigger.on")}</span>
          <TriggerPill
            label={t("automations.trigger.branchPill")}
            value={trigger.branch}
            options={branchOptions}
            placeholder={t("automations.trigger.selectBranch")}
            disabled={!projectChosen}
            emptyLabel={
              projectChosen
                ? t("automations.trigger.noBranches")
                : t("automations.trigger.chooseProjectFirst")
            }
            onChange={(value) => onChange({ ...trigger, branch: value })}
          />
        </>
      ) : null}
      <span>{t("automations.trigger.by")}</span>
      <TriggerPill
        label={t("automations.trigger.actorPill")}
        value={trigger.actor || "anyone"}
        options={[{ value: "anyone", label: t("automations.options.anyone") }]}
        onChange={(value) => onChange({ ...trigger, actor: value })}
      />
    </>
  );
}

function TriggerPill({
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled,
  emptyLabel,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string; keywords?: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyLabel?: string;
}) {
  return (
    <SearchableSelect
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      emptyLabel={emptyLabel}
      variant="pill"
      searchable={options.length > 8}
    />
  );
}

function timeOptions(current: string) {
  const options = Array.from({ length: 24 }, (_, hour) => {
    const prefix = String(hour).padStart(2, "0");
    return [
      { value: `${prefix}:00`, label: `${prefix}:00` },
      { value: `${prefix}:30`, label: `${prefix}:30` },
    ];
  }).flat();
  if (current && !options.some((option) => option.value === current)) {
    options.unshift({ value: current, label: current });
  }
  return options;
}
