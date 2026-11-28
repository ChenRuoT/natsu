import { Check, CircleDot, GitPullRequest } from "../../../shared/ui/icons";
import { type ReactNode } from "react";
import type { InboxKind } from "../model/githubTasks";
import {
  DEFAULT_INBOX_FILTERS,
  LINEAR_NO_PROJECT,
  hasActiveInboxFilters,
  isTrackerSource,
  type InboxFilters,
  type InboxSource,
  type InboxTimeFilter,
  type LinearProjectOption,
} from "../model/inboxFilters";
import type { JiraProject } from "../model/jira";
import type { LinearTeam } from "../model/linear";
import { Popover } from "../../../shared/ui/Popover";
import { ProjectLogoIcon } from "../../projects/ui/ProjectLogoIcon";
import { useT, type MessageKey } from "../../../shared/i18n/i18n";

export const INBOX_FILTER_MENU_WIDTH = 228;

type ProjectOption = {
  path: string;
  name: string;
  logoPath: string | null;
};

type Props = {
  x: number;
  y: number;
  projects: ProjectOption[];
  linearProjects: LinearProjectOption[];
  linearTeams: LinearTeam[];
  hiddenLinearTeamIds: string[];
  jiraProjects: JiraProject[];
  hiddenJiraProjectIds: string[];
  source: InboxSource;
  filters: InboxFilters;
  onChange: (filters: InboxFilters) => void;
  /** Shared with Settings → Inbox → Linear; narrows the fetch, not just the list. */
  onLinearTeamsChange: (ids: string[]) => void;
  /** Shared with Settings → Inbox → Jira; narrows the fetch, not just the list. */
  onJiraProjectsChange: (ids: string[]) => void;
  onClose: () => void;
};

const TIME_OPTIONS: { id: InboxTimeFilter; labelKey: MessageKey }[] = [
  { id: "all", labelKey: "inbox.filtersMenu.time.all" },
  { id: "today", labelKey: "inbox.filtersMenu.time.today" },
  { id: "7d", labelKey: "inbox.filtersMenu.time.last7Days" },
  { id: "30d", labelKey: "inbox.filtersMenu.time.last30Days" },
];

const KIND_OPTIONS: {
  id: InboxKind;
  labelKey: MessageKey;
  icon: ReactNode;
}[] = [
  {
    id: "issue",
    labelKey: "inbox.filtersMenu.kind.issues",
    icon: <CircleDot className="size-3.5 shrink-0" strokeWidth={1.75} />,
  },
  {
    id: "pr",
    labelKey: "inbox.filtersMenu.kind.pullRequests",
    icon: <GitPullRequest className="size-3.5 shrink-0" strokeWidth={1.75} />,
  },
];

export function InboxFiltersMenu({
  x,
  y,
  projects,
  linearProjects,
  linearTeams,
  hiddenLinearTeamIds,
  jiraProjects,
  hiddenJiraProjectIds,
  source,
  filters,
  onChange,
  onLinearTeamsChange,
  onJiraProjectsChange,
  onClose,
}: Props) {
  const t = useT();
  const hiddenProjects = new Set(filters.hiddenProjects);
  const hiddenLinearProjects = new Set(filters.hiddenLinearProjects);
  const hiddenTeams = new Set(hiddenLinearTeamIds);
  const hiddenKinds = new Set(filters.hiddenKinds);
  const teamsActive = source === "linear" && hiddenLinearTeamIds.length > 0;
  const hiddenJira = new Set(hiddenJiraProjectIds);
  const jiraProjectsActive =
    source === "jira" && hiddenJiraProjectIds.length > 0;
  const tracker = isTrackerSource(source);

  const toggleAssigned = () => {
    onChange({ ...filters, assignedToMe: !filters.assignedToMe });
  };

  const toggleKind = (kind: InboxKind) => {
    const next = new Set(hiddenKinds);
    if (next.has(kind)) next.delete(kind);
    else next.add(kind);
    onChange({ ...filters, hiddenKinds: [...next] });
  };

  const toggleProject = (path: string) => {
    const next = new Set(hiddenProjects);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    onChange({ ...filters, hiddenProjects: [...next] });
  };

  const toggleLinearTeam = (id: string) => {
    const next = new Set(hiddenTeams);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onLinearTeamsChange([...next]);
  };

  const toggleJiraProject = (id: string) => {
    const next = new Set(hiddenJira);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onJiraProjectsChange([...next]);
  };

  const toggleLinearProject = (id: string) => {
    const next = new Set(hiddenLinearProjects);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ ...filters, hiddenLinearProjects: [...next] });
  };

  const setTime = (time: InboxTimeFilter) => {
    onChange({ ...filters, time });
  };

  const toggleStatus = (key: keyof InboxFilters["status"]) => {
    onChange({
      ...filters,
      status: { ...filters.status, [key]: !filters.status[key] },
    });
  };

  return (
    <Popover
      anchor={{ x, y }}
      gap={0}
      width={INBOX_FILTER_MENU_WIDTH}
      maxHeight={480}
      onDismiss={onClose}
      role="menu"
      aria-label={t("inbox.filtersMenu.label")}
      onContextMenu={(event) => event.preventDefault()}
      className="overflow-y-auto overscroll-none p-1"
    >
      <FilterItem
        label={
          source === "gitlab" || source === "azuredevops"
            ? t("inbox.filtersMenu.needsAttention")
            : t("inbox.filtersMenu.assignedToMe")
        }
        checked={filters.assignedToMe}
        onClick={toggleAssigned}
      />

      <SectionLabel>{t("inbox.filtersMenu.status")}</SectionLabel>
      <FilterItem
        label={t("inbox.filtersMenu.status.open")}
        checked={filters.status.open}
        onClick={() => toggleStatus("open")}
      />
      {!tracker ? (
        <FilterItem
          label={t("inbox.filtersMenu.status.draft")}
          checked={filters.status.draft}
          onClick={() => toggleStatus("draft")}
        />
      ) : null}
      <FilterItem
        label={t("inbox.filtersMenu.status.closed")}
        checked={filters.status.closed}
        onClick={() => toggleStatus("closed")}
      />
      {!tracker ? (
        <FilterItem
          label={t("inbox.filtersMenu.status.merged")}
          checked={filters.status.merged}
          onClick={() => toggleStatus("merged")}
        />
      ) : null}

      <SectionLabel>{t("inbox.filtersMenu.time")}</SectionLabel>
      {TIME_OPTIONS.map((option) => (
        <FilterItem
          key={option.id}
          label={t(option.labelKey)}
          checked={filters.time === option.id}
          onClick={() => setTime(option.id)}
        />
      ))}

      {!tracker ? (
        <>
          <SectionLabel>{t("inbox.filtersMenu.type")}</SectionLabel>
          {KIND_OPTIONS.map((option) => (
            <FilterItem
              key={option.id}
              label={
                source === "gitlab" && option.id === "pr"
                  ? t("inbox.filtersMenu.kind.mergeRequests")
                  : t(option.labelKey)
              }
              checked={!hiddenKinds.has(option.id)}
              icon={option.icon}
              onClick={() => toggleKind(option.id)}
            />
          ))}
        </>
      ) : null}

      {source === "linear" && linearTeams.length > 0 ? (
        <>
          <SectionLabel>{t("inbox.filtersMenu.teams")}</SectionLabel>
          {linearTeams.map((team) => (
            <FilterItem
              key={team.id}
              label={team.name || team.key}
              checked={!hiddenTeams.has(team.id)}
              onClick={() => toggleLinearTeam(team.id)}
            />
          ))}
        </>
      ) : null}

      {source === "linear" && linearProjects.length > 0 ? (
        <>
          <SectionLabel>{t("inbox.filtersMenu.projects")}</SectionLabel>
          {linearProjects.map((project) => (
            <FilterItem
              key={project.id}
              label={
                project.id === LINEAR_NO_PROJECT
                  ? t("inbox.filtersMenu.noProject")
                  : project.name
              }
              checked={!hiddenLinearProjects.has(project.id)}
              onClick={() => toggleLinearProject(project.id)}
            />
          ))}
        </>
      ) : null}

      {source === "jira" && jiraProjects.length > 0 ? (
        <>
          <SectionLabel>{t("inbox.filtersMenu.projects")}</SectionLabel>
          {jiraProjects.map((project) => (
            <FilterItem
              key={project.id}
              label={project.name || project.key}
              checked={!hiddenJira.has(project.id)}
              onClick={() => toggleJiraProject(project.id)}
            />
          ))}
        </>
      ) : null}

      {!tracker &&
      !(
        (source === "gitlab" || source === "azuredevops") &&
        filters.assignedToMe
      ) &&
      projects.length > 0 ? (
        <>
          <SectionLabel>{t("inbox.filtersMenu.projects")}</SectionLabel>
          {projects.map((project) => (
            <FilterItem
              key={project.path}
              label={project.name}
              checked={!hiddenProjects.has(project.path)}
              icon={
                project.logoPath ? (
                  <ProjectLogoIcon
                    path={project.logoPath}
                    className="size-3.5 shrink-0 rounded-sm"
                    imageClassName="size-3.5"
                  />
                ) : undefined
              }
              onClick={() => toggleProject(project.path)}
            />
          ))}
        </>
      ) : null}

      {hasActiveInboxFilters(
        filters,
        source,
        hiddenLinearTeamIds,
        hiddenJiraProjectIds,
      ) ? (
        <>
          <div role="separator" className="my-1 h-px bg-content/10" />
          <button
            type="button"
            role="menuitem"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onChange(DEFAULT_INBOX_FILTERS);
              if (teamsActive) onLinearTeamsChange([]);
              if (jiraProjectsActive) onJiraProjectsChange([]);
            }}
            className="flex h-7 w-full items-center rounded-lg px-2 text-left text-[13px] leading-none text-content/70 hover:bg-content/5 hover:text-content"
          >
            {t("inbox.filtersMenu.clear")}
          </button>
        </>
      ) : null}
    </Popover>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="px-2 pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-content/40">
      {children}
    </div>
  );
}

function FilterItem({
  label,
  checked,
  icon,
  onClick,
}: {
  label: string;
  checked: boolean;
  icon?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="flex h-7 w-full items-center gap-2 rounded-lg px-2 text-left text-[13px] leading-none text-content hover:bg-content/5"
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {checked ? (
        <Check className="size-3.5 shrink-0" strokeWidth={2.25} />
      ) : null}
    </button>
  );
}
