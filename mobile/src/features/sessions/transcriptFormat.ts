// Labels as AgentTranscript writes them, so a turn reads the same on both.
import { t as tNow, type TFunction } from "@/i18n/i18n";

/** "Claude Opus worked for 2m 4s", or "Working…" while the clock starts. */
export function formatWorkingDuration(
  elapsedMs: number | null,
  modelName?: string,
  done = false,
  t: TFunction = tNow,
): string {
  const who = modelName?.trim();
  const elapsed = formatElapsed(elapsedMs, t);
  if (elapsed == null) {
    if (done) {
      return who
        ? t("sessions.transcriptFormat.workedNamed", { who })
        : t("sessions.transcriptFormat.worked");
    }
    return who
      ? t("sessions.transcriptFormat.workingNamed", { who })
      : t("sessions.transcriptFormat.working");
  }
  if (done) {
    return who
      ? t("sessions.transcriptFormat.workedNamedFor", { who, elapsed })
      : t("sessions.transcriptFormat.workedFor", { elapsed });
  }
  return who
    ? t("sessions.transcriptFormat.workingNamedFor", { who, elapsed })
    : t("sessions.transcriptFormat.workingFor", { elapsed });
}

export function formatElapsed(
  elapsedMs: number | null,
  t: TFunction = tNow,
): string | null {
  if (elapsedMs == null) return null;
  const totalSec = Math.max(1, Math.round(elapsedMs / 1000));
  if (totalSec < 60) {
    return t("sessions.transcriptFormat.elapsedSeconds", { count: totalSec });
  }
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return seconds
    ? t("sessions.transcriptFormat.elapsedMinutesSeconds", { minutes, seconds })
    : t("sessions.transcriptFormat.elapsedMinutes", { minutes });
}

/** Wall-clock stamp for a message or a finished turn. */
export function formatClockTime(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** A day separator's two halves: "Today" and "3:42 PM". */
export function dayStamp(
  at: number,
  now = Date.now(),
  t: TFunction = tNow,
): [string, string] {
  const date = new Date(at);
  const today = new Date(now);
  const yesterday = new Date(now);
  yesterday.setDate(today.getDate() - 1);
  const day =
    date.toDateString() === today.toDateString()
      ? t("sessions.transcriptFormat.today")
      : date.toDateString() === yesterday.toDateString()
        ? t("sessions.transcriptFormat.yesterday")
        : new Intl.DateTimeFormat(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            ...(date.getFullYear() === today.getFullYear() ? {} : { year: "numeric" }),
          }).format(at);
  return [day, formatClockTime(at)];
}

type Metrics = {
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  cacheHitPercent?: number;
};

/** As the desktop's TurnMetricsBadge: whether there is anything to show. */
export function hasTurnMetrics(metrics: Metrics | undefined): metrics is Metrics {
  return (
    !!metrics &&
    (metrics.cacheHitPercent != null ||
      (metrics.inputTokens ?? 0) > 0 ||
      (metrics.outputTokens ?? 0) > 0 ||
      (metrics.cacheReadTokens ?? 0) > 0 ||
      (metrics.cacheWriteTokens ?? 0) > 0)
  );
}

export type MetricStat = { label: string; value: string; unit?: string };

/**
 * The metrics sheet: the turn's rates up top (cache hit, output speed, how
 * long it took), then each token count in full.
 */
export function turnMetricsSheet(
  metrics: Metrics,
  elapsedMs: number | null,
  t: TFunction = tNow,
): { highlights: MetricStat[]; tokens: MetricStat[] } {
  const outputRate =
    metrics.outputTokens != null && elapsedMs != null && elapsedMs > 0
      ? metrics.outputTokens / (elapsedMs / 1000)
      : undefined;
  const elapsed = formatElapsed(elapsedMs, t);
  const highlights: MetricStat[] = [];
  if (metrics.cacheHitPercent != null) {
    highlights.push({
      label: t("sessions.transcriptFormat.metricCacheHit"),
      value: String(Math.round(metrics.cacheHitPercent)),
      unit: "%",
    });
  }
  if (outputRate != null) {
    highlights.push({
      label: t("sessions.transcriptFormat.metricOutputSpeed"),
      value: formatMetricCount(outputRate),
      unit: "tok/s",
    });
  }
  if (elapsed != null) {
    highlights.push({
      label: t("sessions.transcriptFormat.metricDuration"),
      value: elapsed,
    });
  }

  const tokens: MetricStat[] = [];
  const count = (label: string, value: number | undefined) => {
    if (value != null) tokens.push({ label, value: groupDigits(value) });
  };
  count(t("sessions.transcriptFormat.metricInput"), metrics.inputTokens);
  count(t("sessions.transcriptFormat.metricOutput"), metrics.outputTokens);
  count(t("sessions.transcriptFormat.metricCacheRead"), metrics.cacheReadTokens);
  count(t("sessions.transcriptFormat.metricCacheWrite"), metrics.cacheWriteTokens);
  return { highlights, tokens };
}

/** "1,234,567", without Intl, which Hermes may lack. */
export function groupDigits(value: number): string {
  return String(Math.max(0, Math.round(value))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** "950", "12.3K", "1.2M", as Intl's compact notation, which Hermes may lack. */
export function formatMetricCount(value: number): string {
  const n = Math.max(0, Math.round(value));
  const compact = (divisor: number, suffix: string) =>
    `${(n / divisor).toFixed(1).replace(/\.0$/, "")}${suffix}`;
  if (n >= 1e9) return compact(1e9, "B");
  if (n >= 1e6) return compact(1e6, "M");
  if (n >= 1e3) return compact(1e3, "K");
  return String(n);
}
