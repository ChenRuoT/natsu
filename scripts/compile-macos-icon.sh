#!/usr/bin/env bash
# Compile src-tauri/macos/AppIcon.icon (an Icon Composer bundle) into
# src-tauri/macos/Assets.car, the asset catalogue macOS 26 draws the app icon
# from. Both the Tauri app (bundle.resources) and the native app
# (scripts/bundle-native-macos.sh) ship that file next to icon.icns.
#
#   scripts/compile-macos-icon.sh           keep the committed Assets.car if actool fails
#   scripts/compile-macos-icon.sh --strict  exit non-zero instead (CI smoke test)
#
# Needs Xcode 26 or newer. Every installed Xcode whose actool is 26+ is tried,
# the selected one first, with retries: actool has crashed on .icon input in
# some Xcode 26 releases and drops its asset agent on some CI machines.
# DEVELOPER_DIR is set per call, so the job's selected Xcode is left alone.
set -uo pipefail

strict=0
[ "${1:-}" = "--strict" ] && strict=1
root=$(cd "$(dirname "$0")/.." && pwd)
icon="$root/src-tauri/macos/AppIcon.icon"
dest="$root/src-tauri/macos/Assets.car"

give_up() {
  echo "compile-macos-icon: $*" >&2
  if [ "$strict" = 1 ]; then exit 1; fi
  # Surface it on the GitHub Actions run summary without failing the release.
  if [ -n "${GITHUB_ACTIONS:-}" ]; then
    echo "::warning title=macOS 26 app icon not compiled::$* - shipping the committed src-tauri/macos/Assets.car"
  fi
  exit 0
}

[ "$(uname -s)" = Darwin ] || give_up "actool only runs on macOS"
[ -f "$icon/icon.json" ] || give_up "missing $icon/icon.json"

actool_major() {
  DEVELOPER_DIR="$1" xcrun actool --version 2>/dev/null |
    awk '/short-bundle-version/ { getline; gsub(/<\/?string>|[[:space:]]/, ""); split($0, v, "."); print v[1]; exit }'
}

# The selected Xcode first, then every other installed Xcode, newest first.
candidates=()
selected=$(xcode-select -p 2>/dev/null || true)
[ -n "$selected" ] && candidates+=("$selected")
while IFS= read -r app; do
  dir="$app/Contents/Developer"
  [ "$dir" = "$selected" ] || candidates+=("$dir")
done < <(ls -d /Applications/Xcode*.app 2>/dev/null | sort -r)

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
cp -R "$icon" "$work/AppIcon.icon"

for dev in ${candidates[@]+"${candidates[@]}"}; do
  major=$(actool_major "$dev")
  if [ -z "$major" ] || [ "$major" -lt 26 ]; then
    echo "compile-macos-icon: skipping $dev (actool ${major:-unavailable})"
    continue
  fi
  for attempt in 1 2 3; do
    out="$work/out-$attempt"
    rm -rf "$out" && mkdir -p "$out"
    echo "compile-macos-icon: actool $major from $dev, attempt $attempt"
    if DEVELOPER_DIR="$dev" xcrun actool "$work/AppIcon.icon" \
        --compile "$out" \
        --output-format human-readable-text --notices --warnings --errors \
        --app-icon AppIcon --include-all-app-icons \
        --enable-on-demand-resources NO --development-region en \
        --target-device mac --minimum-deployment-target 26.0 --platform macosx \
        --output-partial-info-plist "$out/partial.plist" &&
      [ -s "$out/Assets.car" ] &&
      DEVELOPER_DIR="$dev" xcrun assetutil --info "$out/Assets.car" | grep -q '"AppIcon"'; then
      cp "$out/Assets.car" "$dest"
      echo "compile-macos-icon: wrote src-tauri/macos/Assets.car ($(wc -c < "$dest" | tr -d ' ') bytes)"
      exit 0
    fi
    sleep 5
  done
done

give_up "no Xcode 26+ actool produced an Assets.car with the AppIcon icon"
