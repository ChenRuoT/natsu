<h1 align="center">Natsu</h1>

<p align="center">
  <strong>Multi-Agent CLI Workbench for local Git worktrees, terminals, diffs, and remote hosts.</strong>
</p>

Natsu is an independent open-source continuation and fork of [`hardbeat920/monocode`](https://github.com/hardbeat920/monocode) under the [MIT License](LICENSE).

Works with your existing local CLI subscriptions and logins for **Claude Code**, **Codex**, **Cursor**, **Grok Build**, **OpenCode**, **Antigravity**, **Pi**, **omp**, **fx**, **Hermes Agent**, and **Devin**. Natsu resolves CLIs from your system `PATH` or configured binary paths and does not bundle proprietary agent binaries or sell tokens.

## Features

- **Project & Session Tabs**: Keep conversations organized by project and split panes side by side.
- **Git Worktree Orchestration**: Run parallel tasks in isolated worktrees (`natsu/*` branches) with built-in diffing, staging, and commit history.
- **Integrated Terminals & Editor**: Native ConPTY/PTY terminals and code editor tabs alongside agent transcripts.
- **`/operator` & Monos**: Let sessions coordinate sub-sessions, worktrees, notes, and scheduled tasks.
- **Remote Hosts & Mobile Companion**: Headless Node host daemon (`~/.natsu-host`) over SSH and Expo mobile companion link.

## Quick Start (Windows 11 & Cross-Platform Dev)

### Prerequisites

- **Node.js 20+** (Node.js 22+ for `native:*`, Node.js 24+ for `host/`)
- **Stable Rust toolchain** (`stable-x86_64-pc-windows-msvc` on Windows 11) + Visual Studio C++ Build Tools + WebView2 Runtime
- At least one supported provider CLI installed and signed in (see [provider setup](docs/providers.md))

### Run the Desktop App (Tauri + React)

```powershell
npm install
npm run tauri dev
```

### Run Verification Checks

```powershell
npm run check               # vitest + tsc + cargo fmt/clippy/test
npm run check:web           # vitest + tsc --noEmit
npm run check:rust          # cargo fmt --check + clippy + cargo test
```

### Experimental GPUI Native Preview

An experimental pure-Rust + GPUI frontend lives in `crates/natsu-core` and `crates/natsu-gpui` (separate Cargo workspace):

```powershell
npm run native:dev          # isolated dev DB (Natsu Development/natsu.db)
npm run native:build        # optimized native build
npm run native:check        # script tests + fmt + clippy + native tests
```

See the [native guide](docs/native/README.md) and [build setup](docs/building.md) for platform dependencies and packaging details.

## Guides

- [Provider setup](docs/providers.md)
- [Build from source](docs/building.md)
- [Linux installation](docs/install.md)
- [Agent access with /operator](docs/agent-access.md)
- [Remote sessions (experimental)](docs/remote-access.md)
- [Mobile companion](mobile/README.md)

## Issues & Contributing

If something breaks, [open an issue](https://github.com/ChenRuoT/natsu/issues). Small, focused contributions are welcome — read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License & Attribution

Licensed under the [MIT License](LICENSE).

- Original upstream work by Nick (`Copyright (c) 2026 Nick`) at [`hardbeat920/monocode`](https://github.com/hardbeat920/monocode).
- Independent continuation and modifications by ChenRuoT (`Copyright (c) 2026 ChenRuoT`) at [`ChenRuoT/natsu`](https://github.com/ChenRuoT/natsu).
- Provider names and logos are trademarks of their respective owners. See [NOTICE](NOTICE) for full third-party notices.
