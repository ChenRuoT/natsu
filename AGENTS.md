# AGENTS.md — Natsu Development Entry Point

> Entry-point guide for AI coding agents and contributors working in `E:\natsu`.
> See [handoff.md](handoff.md) for current project handoff details and phased roadmap.

## 1. Project Identity & Origin
- **Project**: **Natsu** — Multi-Agent CLI Workbench (desktop workbench for orchestrating multiple CLI coding agents across Git worktrees, terminals, diffs, and remote hosts).
- **Origin & License**: Independent open-source continuation and fork of `hardbeat920/monocode` under the **MIT License**.
- **Remotes**:
  - `origin`: `https://github.com/ChenRuoT/natsu`
  - `upstream`: `https://github.com/hardbeat920/monocode`
- **Primary Development Environment**: Windows 11 (`x86_64-pc-windows-msvc`), preserving cross-platform compatibility (macOS / Linux) where applicable.
- **Rebrand Status (Phase 1 Step 2 on `feat/rebrand-natsu`)**: Package names, bundle IDs (`com.chenruot.natsu`, `com.chenruot.natsu.gpui`, `com.chenruot.natsu.mobile`), GPUI crate paths (`crates/natsu-core`, `crates/natsu-gpui`), data/storage directories (`natsu.db`, `~/.natsu-host`, `natsu.*`/`natsu:` `localStorage`), protocols (`natsuartifact:`, `natsu://pair`), worktree prefixes (`natsu/*`), `LICENSE` dual copyright, `README.md`, and `workflow_dispatch`-only release workflows are updated to **Natsu**. Internal `mono`/`monos` domain features remain preserved. Update this document whenever paths, crate names, or commands change.

---

## 2. Strict Git Workflow & Compliance Rules
1. **Preserve Upstream History**: Never squash, force-rewrite, or strip upstream commits or contributor metadata.
2. **Branching**:
   - Keep `main` clean (milestones or clean upstream merges).
   - Perform all features and refactors on dedicated branches (e.g., `feat/rebrand-natsu`, `feat/worktree-hooks`) and merge cleanly.
3. **MIT License & Third-Party Attribution**:
   - Never remove or overwrite `Copyright (c) 2026 Nick` in [LICENSE](LICENSE) or existing source copyright headers; append `Copyright (c) 2026 ChenRuoT` in `LICENSE`.
   - Preserve all third-party notices in [NOTICE](NOTICE) (`Zed Industries, Inc.`, `mermaid-rs-renderer`, `Hugeicons`, `Daniel Belyi`) and `vendor/*/LICENSE*`.
4. **No Proprietary Binary Bundling**:
   - Never bundle third-party proprietary CLI binaries (`claude`, `codex`, `gemini`, `cursor-agent`, etc.) into installers or repo assets. Always resolve from system `PATH` or user-configured binary paths.

---

## 3. Repository Architecture (4 Surfaces)

This repository houses **four** cooperating surfaces across **two separate Cargo workspaces** plus Node/Expo packages:

| Surface | Path(s) | Stack | Maturity / Role |
|---|---|---|---|
| **Desktop (Tauri v2)** | `src/`, `src-tauri/`, `public/`, root `Cargo.toml`, `package.json` | React 19 + Vite 7 + TypeScript + Tauri v2 (Rust) | **Production desktop app** (Windows 11 / macOS / Linux verified) |
| **Desktop (GPUI Native)** | `crates/natsu-core/`, `crates/natsu-gpui/`, `vendor/gpui-pre*` | Pure Rust + GPUI (separate Cargo workspace) | **Experimental native preview** (macOS-focused upstream; Windows/Linux GUI builds unverified) |
| **Remote Host Daemon** | `host/` | Node.js 24+ + TypeScript + `node:sqlite` + esbuild | Headless HTTP/JSON RPC daemon (`127.0.0.1:3774`) for remote workspaces (no PTY; piped stdio) |
| **Mobile Companion & Link** | `mobile/`, `crates/mobile-link/` | Expo SDK 57 / React Native + Rust QUIC FFI (`UDP 38416`) | Mobile companion client (see [mobile/AGENTS.md](mobile/AGENTS.md) before touching `mobile/`) |

### Directory Map
- `src/app/` — App bootstrap, shell layout, titlebar, sidebar, lifecycle, release notes, updater UI.
- `src/features/` — Co-located domain slices (`ui/`, `model/`, `hooks/`, `data/`, `*.test.ts`): `sessions`, `terminal`, `source-control`, `files`, `providers`, `connections`, `mobile`, `monos`, `orchestration`, `automations`, `inbox`, `notes`, `notifications`, `projects`, `quick-composer`, `settings`, `skills`, `workspace`.
- `src/integrations/harness/` — Provider-agnostic harness runtime (`core/{registry,child,auth,availability,apply}.ts`) + 11 CLI provider adapters (`providers/{claude,codex,cursor,opencode,omp,pi,fx,grok,hermes,devin,antigravity}/`). Each provider's `*Protocol.ts` is a pure parser with colocated unit tests.
- `src/platform/tauri/` — Frontend wrappers over Tauri IPC (`pty.ts`, `fs.ts`, `clipboard.ts`).
- `src/shared/` — Feature-agnostic UI components, hooks, and utilities.
- `src-tauri/src/` — Tauri Rust backend: ConPTY/PTY (`pty.rs`, `windows.rs`), CLI harness execution (`harness.rs`), SQLite store (`session_store.rs`), Git & worktrees (`fs.rs`, `worktrees.rs`, `worktree_lifecycle.rs`), remote SSH (`remote.rs`, `remote_ssh.rs`, `ssh_askpass.rs`), control loopback host (`control.rs`), mobile access (`mobile_access.rs`), artifacts (`artifacts.rs`).
- `crates/natsu-core/` — Shared Rust core for the GPUI frontend (store, providers, git/scm, remote, mobile, updater, desktop preferences).
- `crates/natsu-gpui/` — GPUI native desktop UI (separate `[workspace]` in `crates/natsu-gpui/Cargo.toml`).
- `crates/mobile-link/` — Shared Rust QUIC transport crate (`natsu-mobile-link`) used by `src-tauri`, `natsu-core`, and `mobile/modules/natsu-link`.
- `host/` — Headless remote host (`cli.ts`, `server.ts`, `service.ts`, `store.ts`, `owner.ts`, `engine.ts`, `process.ts`, `child-backend.ts`, `provider-guard.mjs`, `providers.ts`, `git-worktrees.ts`, `git-branches.ts`, `workspace.ts`, `workspace-commands.ts`, `windows.ts`, `windows-acl.ps1`).
- `scripts/` — Build, dev, version bump, NSIS installer (`native-installer.nsi`), macOS/Linux packaging, and perf tools.
- `tests/browser/` — Playwright real-browser geometry & performance specs (Chromium/WebKit on port `1435`).
- `vendor/` — Patched vendored crates (`portable-pty`, `gpui-pre*`). Keep changes minimal and documented.

---

## 4. Core Subsystems Quick Reference

### 4.1 Local Storage, State & IPC (Natsu Isolated Paths)
- **Tauri SQLite & AppData**: `<app_data_dir>/com.chenruot.natsu/natsu.db` (`%APPDATA%\com.chenruot.natsu\natsu.db` on Windows), plus `mobile-access.json`, `provider-accounts/`, `codex-monos/`.
- **WebView `localStorage`**: `natsu.*` and `natsu:*` keys (no `sessionStorage` or `IndexedDB`).
- **GPUI Data**: Release shares Tauri's `natsu.db` + sidecar `<db>.gpui.sqlite3`; Dev uses `NATSU_NATIVE_DATA_DIR` or `<LOCALAPPDATA>/Natsu Development/natsu.db`.
- **Host Daemon**: `~/.natsu-host/{host.db,owner.db,running.json,host.log,service.ps1,attachments}`; OS services: `com.chenruot.natsu.host` (macOS), `natsu-host.service` (systemd), `Natsu Host-$sid` (Windows Scheduled Task).
- **IPC & Protocols**: Local control/bridge servers bind loopback TCP `127.0.0.1:0` with bearer tokens (no named pipes / Unix sockets). Custom schemes: `natsuartifact:` (Tauri), `natsu://pair?i=...` (Mobile QUIC), `natsu-file:`. Keyring service: `com.chenruot.natsu.mobile`.

### 4.2 Process, ConPTY & CLI Harness Spawning
- **Tauri PTY** (`src-tauri/src/pty.rs`, `src-tauri/src/windows.rs`):
  - Windows uses `vendor/portable-pty` ConPTY + `KILL_ON_JOB_CLOSE` Windows Job Object (`spawn_pty`, `spawn_managed`) so child trees terminate cleanly on close.
  - Unix uses `libc::openpty` + `setsid`.
- **GPUI Terminal** (`crates/natsu-gpui/src/terminal.rs`): uses `alacritty_terminal::tty::new`.
- **CLI Harnesses** (`src-tauri/src/harness.rs`, `crates/natsu-core/src/provider.rs`, `host/process.ts`):
  - 11 providers supported: `claude`, `codex`, `cursor`, `opencode`, `omp`, `pi`, `fx`, `grok`, `hermes`, `devin`, `antigravity`.
  - **Windows `.cmd`/`.bat` note**: Rust checks `exe, cmd, bat, com` extensions to avoid bare npm shell shims; `host/process.ts` unwraps npm `.cmd`/`.bat` shims for `codex`/`claude` directly to `node` + JS entrypoint.

### 4.3 Git Worktree Management
- **Layout**: `<repo_parent>/<repo>-worktrees/<slug>`; new branch prefix `natsu/*` (with backward-compatible recognition/stripping for `mc/*` and legacy `monocode/*`); git checkpoint refs `refs/natsu/checkpoints/<session_id>/...`.
- **Backend entrypoints**:
  - Tauri: `src-tauri/src/worktrees.rs`, `src-tauri/src/worktree_lifecycle.rs` (tracks `worktree_removals` in SQLite and guards against active PTY/Harness sessions), `src-tauri/src/fs.rs`.
  - GPUI Core: `crates/natsu-core/src/git.rs`, `crates/natsu-core/src/git/naming.rs`, `crates/natsu-core/src/scm.rs`.
  - Host: `host/git-worktrees.ts`, `host/git-branches.ts`, `host/workspace.ts`.
  - Frontend: `src/features/source-control/model/worktrees.ts`, `useProjectWorktrees.ts`, `WorktreesPage.tsx`.

---

## 5. Development, Build & Verification Commands

### Prerequisites (Windows 11)
- Node.js 20+ (Node.js 22+ for `native:*`, Node.js 24+ for `host/` runtime)
- Stable Rust toolchain (`stable-x86_64-pc-windows-msvc`) + Visual Studio C++ Build Tools + WebView2 Runtime
- At least one supported CLI agent installed and authenticated in `PATH`

### Core Commands (Run from Repository Root)
```powershell
# Tauri + React Desktop (Production)
npm install
npm run tauri dev           # Start Vite + Tauri dev app
npm run check               # Full CI check: vitest + tsc + cargo fmt/clippy/test
npm run check:web           # vitest run && tsc --noEmit
npm run check:rust          # cargo fmt --check && clippy (-D warnings) && cargo test
npm run test:browser        # Playwright browser geometry tests (port 1435)
npm run build:windows       # Build Windows NSIS installer (stable-x86_64-pc-windows-msvc)

# Remote Host Daemon
npm run host:build          # Typecheck + esbuild bundle
npm run test:host           # Build + Vitest host test suite

# GPUI Native Preview (Separate Cargo Workspace)
npm run native:dev          # Dev runner with isolated dev DB (type 'r' + Enter to rebuild)
npm run native:build        # Optimized native build
npm run native:test         # Core + GPUI cargo tests (--test-threads=1 for gpui)
npm run native:check        # Script tests + fmt + clippy + native:test
```
> For `mobile/`, always follow [mobile/AGENTS.md](mobile/AGENTS.md) (`npx expo install`, `npx tsc --noEmit`, `npx expo lint`).

---

## 6. Engineering Conventions for Agents
1. **Verify before finishing**: Run the narrowest matching check suite (`npm run check:web`, `npm run check:rust`, `npm run test:host`, `npm run native:check`) after edits; `cargo clippy` runs with `-D warnings`.
2. **Keep Cargo workspaces distinct**: Root `Cargo.toml` intentionally excludes `crates/natsu-core`, `crates/natsu-gpui`, and `vendor/*`. Never run root `cargo test` expecting GPUI tests to execute — use `npm run native:test`.
3. **Windows-first diligence**: Always consider path separators, `PATHEXT` / `.cmd` / `.ps1` wrappers, `CREATE_NO_WINDOW`, Windows Job Object cleanup, and `%APPDATA%` vs `%LOCALAPPDATA%` isolation.
4. **Protocol & UI tests**: Keep harness protocol parsing pure in `*Protocol.ts` with unit tests; run `npm run test:browser` for transcript layout/scroll changes.
5. **Keep docs synchronized**: Whenever rebranding, data paths, or architecture change, update `AGENTS.md` and `handoff.md` accordingly.

---

## 7. Roadmap Summary
- **Phase 1 (Current — `feat/rebrand-natsu`)**: Read-only audit complete; Step 2 rebranding, OS/filesystem data isolation (`com.chenruot.natsu`, `natsu.db`, `natsu/*` worktrees, `~/.natsu-host`), MIT dual-copyright `LICENSE`, `README.md`, and `workflow_dispatch`-only release workflows implemented on `feat/rebrand-natsu` pending verification & smoke tests.
- **Phase 2+ (Do Not Implement Until Phase 1 Passes Smoke Tests)**:
  1. **Worktree Lifecycle Hooks**: Auto-execute setup commands (e.g., symlink `node_modules`, copy `.env`) when creating an agent worktree.
  2. **Windows ConPTY & Wrapper Improvements**: Enhanced `.cmd` / `.ps1` / custom wrapper handling and per-agent proxy/env overrides.
  3. **UI & Keybinding Customizations**: Layout refinements and custom prompt/agent presets.
