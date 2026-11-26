#!/bin/sh
# Profile Natsu while a replayed reply streams.
#
#   scripts/perf/stream-profile.sh [path/to/natsu-gpui] [seconds]
#
# Starts a separate Natsu window on throwaway data, with `claude` replaced
# by scripts/perf/fake-claude-stream.py. Send any message in a Claude chat in
# that window; once the reply starts streaming, the stack profiler samples the
# window for the given seconds (default 30), then this script closes the
# window it started. The running Natsu and its data are not touched.
set -eu

here=$(cd "$(dirname "$0")" && pwd)
app=${1:-"/Applications/Natsu Native.app/Contents/MacOS/natsu-gpui"}
seconds=${2:-30}
profiler=${NATSU_PROFILER:-"$HOME/code/mono-perf-chip/dist/Natsu Performance.app/Contents/MacOS/NatsuPerformance"}
replay="$here/fake-claude-stream.py"

[ -x "$app" ] || { echo "No Natsu binary at $app" >&2; exit 1; }
[ -x "$profiler" ] || { echo "No profiler at $profiler (set NATSU_PROFILER)" >&2; exit 1; }

work=$(mktemp -d "${TMPDIR:-/tmp}/natsu-stream-profile.XXXXXX")
out="$work/profile"
mkdir -p "$work/data" "$work/project" "$out"

# The reply streams a little longer than the capture, so it covers it whole.
export REPLAY_SECONDS=$((seconds + 15)) REPLAY_MARK="$work/streaming"
NATSU_NATIVE_DATA_DIR="$work/data" NATSU_CLAUDE_BINARY="$replay" \
    "$app" --dev-data --cwd "$work/project" >"$work/app.log" 2>&1 &
pid=$!
trap 'kill "$pid" 2>/dev/null || true' EXIT INT TERM

echo "Started Natsu (PID $pid) on $work/data."
echo "Send any message in a Claude chat there; profiling starts when the reply streams."
until [ -e "$work/streaming" ]; do
    kill -0 "$pid" 2>/dev/null || { echo "Natsu exited; see $work/app.log" >&2; exit 1; }
    sleep 1
done
# Let the first frames and the transcript settle before sampling
# (PROFILE_DELAY seconds, default 3; longer leaves time to scroll away first).
sleep "${PROFILE_DELAY:-3}"
"$profiler" --profile "$seconds" --pid "$pid" --output "$out" >"$out/summary.json"
echo "Report: $(ls -d "$out"/profile-*)/report.md"
