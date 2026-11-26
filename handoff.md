# Project Handoff: Natsu (Multi-Agent CLI Workbench)

## 1. Project Context & Background
- **Repository Path**: `E:\natsu`
- **GitHub Remote (`origin`)**: `https://github.com/ChenRuoT/natsu` (Independent open-source repository)
- **Upstream Remote (`upstream`)**: `https://github.com/hardbeat920/monocode`
- **Origin & License**: `Natsu` is an independent continuation and enhanced fork based on `hardbeat920/monocode` under the **MIT License**.
- **Target OS / Primary Environment**: Windows 11 (Developer machine), with cross-platform build compatibility preserved where applicable.

## 2. Git Workflow & Compliance Rules (STRICT)
1. **Preserve History**: Never squash, rebase away, or alter existing upstream commit history or contributor metadata.
2. **Branching Strategy**:
   - Keep `main` synced with clean milestones or upstream merges.
   - Perform feature development or large refactors on dedicated feature branches (e.g., `feat/rebrand-natsu`, `feat/worktree-hooks`) and merge back cleanly.
3. **MIT License Compliance**:
   - Do **NOT** delete or overwrite `Copyright (c) ... hardbeat920` in `LICENSE` or source file headers.
   - Append `Copyright (c) 2026 ChenRuoT` in `LICENSE` while keeping original copyright notices intact.
   - Do **NOT** bundle third-party proprietary CLI binaries (e.g., `claude`, `codex`, `gemini`) into the installer; rely on local system `PATH` or user-configured binary paths.

## 3. Immediate Phase 1 Objective: Audit & Rebranding (`monocode` -> `natsu`)
Before adding new features, we need to decouple `Natsu` from `MonoCode` at the OS, filesystem, and build levels so both apps can coexist on the same machine without config or process conflicts.

### Step 1: Codebase Architecture Audit (Read-Only First)
Scan the repository and map out the exact file paths responsible for:
1. **App Metadata & Build Config**: `package.json`, `Cargo.toml`, `tauri.conf.json` (or Electron/Vite equivalents), installer/updater endpoints, and window titles.
2. **Local Storage & Data Paths**: Where the app stores SQLite databases, session logs, settings JSON, or cache directories (e.g., `~/.monocode`, `%APPDATA%\monocode`, `LocalAppData`).
3. **Process & PTY Spawning**: Backend code handling terminal/ConPTY creation, CLI agent invocation, and environment variable injection.
4. **Git Worktree Management**: Backend logic creating, listing, diffing, and cleaning up Git worktrees.

### Step 2: Rebranding & Data Isolation Plan (In Progress on `feat/rebrand-natsu`)
Rebranding and isolation executed on branch `feat/rebrand-natsu`:
- **Product Name & Crates**: `Natsu` (`natsu-desktop`, `natsu` / `natsu_lib`), `Natsu Native` (`crates/natsu-core`, `crates/natsu-gpui`), `natsu-mobile-link` (`crates/mobile-link`, `mobile/modules/natsu-link`), `natsu-host`.
- **Bundle Identifiers**: `com.chenruot.natsu` (Tauri), `com.chenruot.natsu.gpui` / `.mono-chat` / `.quick-composer` (GPUI), `com.chenruot.natsu-mobile` (Mobile).
- **Data Directory & Protocol Isolation**: `com.chenruot.natsu/natsu.db`, `Natsu Development/natsu.db`, `~/.natsu-host`, `natsu.*` / `natsu:` `localStorage`, `NATSU_*` env vars, `natsuartifact:` / `natsu://pair` schemes, `natsu/*` worktrees, `refs/natsu/checkpoints/...`.
- **License & README**: `LICENSE` preserves `Copyright (c) 2026 Nick` and appends `Copyright (c) 2026 ChenRuoT`; `README.md` replaced with Natsu overview and `hardbeat920/monocode` attribution.
- **CI/CD Cleanup**: `.github/workflows/{release,native-release}.yml` switched to `workflow_dispatch` only with upstream URLs removed; `ci.yml` and `native.yml` updated for `natsu`.
## 4. Roadmap (Subsequent Phases - Do Not Implement Yet)
Once Phase 1 builds and passes smoke tests cleanly, future tasks will include:
- **Worktree Lifecycle Hooks**: Auto-executing setup commands (e.g., symlinking `node_modules`, copying `.env`) when spinning up a new agent worktree.
- **Windows ConPTY & Wrapper Improvements**: Better handling of `.cmd` / `.ps1` / custom wrapper scripts and proxy/env overrides per agent profile.
- **UI & Keybinding Customizations**: Layout refinements and custom prompt/agent presets.

## 5. First Action Required From Agent
1. Inspect the directory tree and core config files in `E:\natsu`.
2. Output a concise **Architecture & Rebranding Checklist** listing every file that contains `monocode` references (distinguishing between functional identifiers/paths vs. historical attribution comments).
3. Wait for confirmation before modifying files or creating the `feat/rebrand-natsu` branch.
