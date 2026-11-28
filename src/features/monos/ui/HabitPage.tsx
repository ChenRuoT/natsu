import {
  useEffect,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Pause, Play, Trash2, Zap } from "../../../shared/ui/icons";
import { IconButton } from "../../../app/shell/TitleBar";
import { PageHeader } from "./monoPanelParts";
import { AgentMarkdown } from "../../sessions/ui/AgentMarkdown";
import {
  habitRunningSince,
  habitScheduleText,
  habitStarting,
  subscribeHabitsRunning,
  type Habit,
  type HabitRun,
} from "../model/monoHabits";

import {
  t as tNow,
  useT,
  type MessageKey,
  type TFunction,
} from "../../../shared/i18n/i18n";

const dayTime = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
});
const dateTime = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function when(
  at: number,
  now = Date.now(),
  t: TFunction = tNow,
): string {
  const date = new Date(at);
  const today = new Date(now);
  if (date.toDateString() === today.toDateString())
    return t("mono.habit.todayAt", {
      time: new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(at),
    });
  return now - at < 6 * 24 * 60 * 60 * 1000
    ? dayTime.format(at)
    : dateTime.format(at);
}

function duration(ms: number, t: TFunction = tNow): string {
  const seconds = Math.max(1, Math.round(ms / 1000));
  if (seconds < 60) return t("mono.time.seconds", { seconds });
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest
    ? t("mono.time.minutesSeconds", { minutes, seconds: rest })
    : t("mono.time.minutes", { minutes });
}

const OUTCOME: Record<
  HabitRun["outcome"],
  { labelKey: MessageKey; dot: string }
> = {
  posted: {
    labelKey: "mono.habit.outcome.posted",
    dot: "bg-[var(--mono-color)]",
  },
  quiet: { labelKey: "mono.habit.outcome.quiet", dot: "bg-content/25" },
  failed: { labelKey: "mono.habit.outcome.failed", dot: "bg-red-500/70" },
};

/** One habit up close: what it does, when, and how its recent runs went. */
export function HabitPage({
  habit,
  color,
  cwd,
  onBack,
  onRunNow,
  onToggle,
  onRemove,
}: {
  habit: Habit;
  /** The Mono's color, for runs that reached the user. */
  color: string;
  cwd: string;
  onBack: () => void;
  onRunNow: () => void;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const t = useT();
  const runningSince = useHabitRunning(habit.id);
  const starting = runningSince == null && habitStarting(habit);
  const runs = habit.runs ?? [];
  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      style={{ "--mono-color": color } as CSSProperties}
      data-habit-page={habit.id}
    >
      <PageHeader title={habit.name} onBack={onBack}>
        <IconButton
          label={
            runningSince != null
              ? t("mono.habit.alreadyRunning")
              : starting
                ? t("mono.habit.starting")
                : t("mono.habit.runNow")
          }
          disabled={runningSince != null || starting}
          onClick={onRunNow}
        >
          <Zap className="size-3.5" strokeWidth={1.75} />
        </IconButton>
        <IconButton
          label={habit.enabled ? t("mono.habit.pause") : t("mono.habit.resume")}
          onClick={onToggle}
        >
          {habit.enabled ? (
            <Pause className="size-3.5" strokeWidth={1.75} />
          ) : (
            <Play className="size-3.5" strokeWidth={1.75} />
          )}
        </IconButton>
        <IconButton label={t("mono.habit.remove")} onClick={onRemove}>
          <Trash2 className="size-3.5" strokeWidth={1.75} />
        </IconButton>
      </PageHeader>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-none">
        <dl className="flex flex-col gap-0.5 px-4 py-3 text-[12px]">
          <Row label={t("mono.habit.runsLabel")}>
            {habit.enabled
              ? habitScheduleText(habit.schedule, t)
              : t("mono.habit.paused")}
          </Row>
          {starting ? (
            <Row label={t("mono.habit.nextLabel")}>
              {t("mono.habit.startingRow")}
            </Row>
          ) : habit.enabled ? (
            <Row label={t("mono.habit.nextLabel")}>
              {when(habit.nextRunAt, Date.now(), t)}
            </Row>
          ) : null}
        </dl>

        <Section title={t("mono.habit.whatItDoes")}>
          <p className="whitespace-pre-wrap px-2 text-[12px] leading-5 text-content/75">
            {habit.instructions}
          </p>
        </Section>

        <Section title={t("mono.habit.recentRuns")}>
          {runningSince != null ? <RunningRow since={runningSince} /> : null}
          {runs.length === 0 && runningSince == null ? (
            <p className="px-2 py-3 text-[12px] text-content/40">
              {t("mono.habit.notRunYet")}
            </p>
          ) : (
            <ul className="flex flex-col gap-px">
              {runs.map((run) => (
                <RunRow key={run.at} run={run} cwd={cwd} />
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center">
      <dt className="flex h-7 items-center text-content/45">{label}</dt>
      <dd className="min-w-0 truncate text-content/85">{children}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-stroke px-2 pb-4 pt-3">
      <h4 className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wide text-content/40">
        {title}
      </h4>
      {children}
    </section>
  );
}

/** When the habit's current run started, or undefined while it is idle. */
export function useHabitRunning(habitId: string): number | undefined {
  return useSyncExternalStore(subscribeHabitsRunning, () =>
    habitRunningSince(habitId),
  );
}

/** How long it has been running, ticking each second. */
export function RunningFor({ since }: { since: number }) {
  const t = useT();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <span className="tabular-nums">{duration(now - since, t)}</span>;
}

function RunningRow({ since }: { since: number }) {
  const t = useT();
  return (
    <div className="flex items-center gap-2.5 rounded-md px-2 py-2 text-[12px]">
      <span className="size-2 shrink-0 animate-pulse rounded-full bg-[var(--mono-color)]" />
      <span className="flex-1 text-content/85">
        {t("mono.habit.runningNow")}
      </span>
      <span className="text-content/40">
        <RunningFor since={since} />
      </span>
    </div>
  );
}

function RunRow({ run, cwd }: { run: HabitRun; cwd: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const detail = run.report ?? run.error;
  const outcome = OUTCOME[run.outcome];
  const expanded = open && !!detail;
  return (
    // An open run is one card: the row and its report share a background,
    // and the report starts where the outcome text does.
    <li className={`rounded-md ${expanded ? "bg-content/5" : ""}`}>
      <button
        type="button"
        disabled={!detail}
        aria-expanded={detail ? open : undefined}
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-[12px] ${
          expanded ? "" : "enabled:hover:bg-content/5"
        }`}
      >
        <span className={`size-2 shrink-0 rounded-full ${outcome.dot}`} />
        <span className="min-w-0 flex-1 truncate text-content/85">
          {t(outcome.labelKey)}
        </span>
        <span className="shrink-0 tabular-nums text-content/40">
          {when(run.at, Date.now(), t)}
          {run.durationMs ? ` · ${duration(run.durationMs, t)}` : ""}
        </span>
      </button>
      {expanded ? (
        // 8px row padding + 8px dot + 10px gap: the outcome text's left edge.
        <div className="pb-3 pl-[26px] pr-3 text-[12px] leading-5 text-content/75">
          {run.report ? (
            <AgentMarkdown
              className="agent-chat-bubble-md mono-run-report"
              text={run.report}
              streaming={false}
              cwd={cwd}
            />
          ) : (
            <p className="whitespace-pre-wrap text-red-500/80">{run.error}</p>
          )}
        </div>
      ) : null}
    </li>
  );
}
