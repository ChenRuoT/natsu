#[cfg(target_os = "macos")]
use serde::Deserialize;
#[cfg(target_os = "macos")]
use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};
#[cfg(target_os = "macos")]
use std::sync::Mutex;
#[cfg(target_os = "macos")]
use tauri::menu::{
    AboutMetadata, CheckMenuItem, Menu, MenuItem, MenuItemBuilder, MenuItemKind, SubmenuBuilder,
};
#[cfg(target_os = "macos")]
use tauri::Wry;
use tauri::{AppHandle, Emitter};

#[cfg(target_os = "macos")]
#[derive(Clone, Deserialize)]
pub struct KeybindingOverride {
    disabled: Option<bool>,
    shortcut: Option<String>,
}

/// Whether the webview's language tag asks for Chinese menu text.
#[cfg_attr(not(target_os = "macos"), allow(dead_code))]
fn is_zh(language: &str) -> bool {
    language.to_ascii_lowercase().starts_with("zh")
}

/// Chinese menu text for `text`, or `text` itself when untranslated. Items the
/// OS names itself (Cut, Copy, Hide, ...) follow the system language instead.
fn zh_text(text: &'static str) -> &'static str {
    match text {
        "Autosave" => "自动保存",
        "Check for Updates…" => "检查更新…",
        "Close All Tabs" => "关闭所有标签页",
        "Close Other Tabs" => "关闭其他标签页",
        "Close Pane" => "关闭窗格",
        "Command Palette…" => "命令面板…",
        "Edit" => "编辑",
        "File" => "文件",
        "Find" => "查找",
        "Find in Files…" => "在文件中查找…",
        "Focus Pane Down" => "聚焦下方窗格",
        "Focus Pane Left" => "聚焦左侧窗格",
        "Focus Pane Right" => "聚焦右侧窗格",
        "Focus Pane Up" => "聚焦上方窗格",
        "Go Back" => "后退",
        "Go Forward" => "前进",
        "Go to File…" => "转到文件…",
        "Help" => "帮助",
        "Inbox" => "收件箱",
        "New Tab" => "新建标签页",
        "New Terminal" => "新建终端",
        "New Terminal Tab" => "新建终端标签页",
        "New Window" => "新建窗口",
        "Next Tab" => "下一个标签页",
        "Notes" => "笔记",
        "Open Project…" => "打开项目…",
        "Previous Tab" => "上一个标签页",
        "Quit Natsu" => "退出 Natsu",
        "Reload" => "重新加载",
        "Report a Bug…" => "报告问题…",
        "Request a Feature…" => "提出功能建议…",
        "Reset Zoom" => "重置缩放",
        "Search…" => "搜索…",
        "Settings…" => "设置…",
        "Sidebar Appearance…" => "侧边栏外观…",
        "Split Pane Down" => "向下拆分窗格",
        "Split Pane Right" => "向右拆分窗格",
        "Switch Model…" => "切换模型…",
        "Toggle Session Sidebar" => "切换会话侧边栏",
        "Toggle Sidebar" => "切换侧边栏",
        "Toggle Terminal" => "切换终端",
        "View" => "视图",
        "Create a Mono in Natsu to chat here" => "在 Natsu 中创建一个 Mono 后即可在此聊天",
        "Mono chat" => "Mono 聊天",
        "Open floating chat" => "打开悬浮聊天",
        "Quick Composer" => "快速输入框",
        "View on GitHub" => "在 GitHub 上查看",
        "Window" => "窗口",
        "Zoom In" => "放大",
        "Zoom Out" => "缩小",
        other => other,
    }
}

#[cfg_attr(not(target_os = "macos"), allow(dead_code))]
static LANGUAGE_ZH: AtomicBool = AtomicBool::new(false);

/// The menu text for the current interface language.
#[cfg_attr(not(target_os = "macos"), allow(dead_code))]
pub(crate) fn tr(text: &'static str) -> &'static str {
    if LANGUAGE_ZH.load(Ordering::Relaxed) {
        zh_text(text)
    } else {
        text
    }
}

#[cfg(target_os = "macos")]
static OVERRIDES: Mutex<Option<HashMap<String, KeybindingOverride>>> = Mutex::new(None);

#[cfg(target_os = "macos")]
static AUTOSAVE_ENABLED: AtomicBool = AtomicBool::new(false);

#[cfg(target_os = "macos")]
fn set_autosave_menu_checked(app: &AppHandle, enabled: bool) {
    let Some(menu) = app.menu() else {
        return;
    };
    let Some(MenuItemKind::Submenu(file)) = menu.get("file") else {
        return;
    };
    let Some(MenuItemKind::Check(item)) = file.get("toggle_autosave") else {
        return;
    };
    let _ = item.set_checked(enabled);
}

#[cfg_attr(not(target_os = "macos"), allow(dead_code))]
fn custom_accelerator(shortcut: &str) -> String {
    let mut parts = shortcut.split('+');
    let key = parts.next_back().unwrap_or_default();
    let key = match key {
        value if value.starts_with("Key") => &value[3..],
        value if value.starts_with("Digit") => &value[5..],
        "Equal" => "=",
        "Minus" => "-",
        "Backquote" => "`",
        "BracketLeft" => "[",
        "BracketRight" => "]",
        "Backslash" => "\\",
        "ArrowUp" => "Up",
        "ArrowDown" => "Down",
        "ArrowLeft" => "Left",
        "ArrowRight" => "Right",
        other => other,
    };
    parts
        .map(|part| match part {
            "Command" => "Cmd",
            "Control" => "Ctrl",
            "Option" => "Option",
            "Shift" => "Shift",
            other => other,
        })
        .chain(std::iter::once(key))
        .collect::<Vec<_>>()
        .join("+")
}

pub fn install(app: &AppHandle) -> tauri::Result<()> {
    #[cfg(target_os = "macos")]
    app.set_menu(build(app, &HashMap::new())?)?;
    let _ = app;
    Ok(())
}

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn keybindings_set_overrides(
    app: AppHandle,
    overrides: HashMap<String, KeybindingOverride>,
) -> Result<(), String> {
    *OVERRIDES.lock().map_err(|error| error.to_string())? = Some(overrides.clone());
    let menu = build(&app, &overrides).map_err(|error| error.to_string())?;
    // set_menu hands back the previous menu; this command only needs to know
    // whether it succeeded.
    app.set_menu(menu)
        .map(|_| ())
        .map_err(|error| error.to_string())
}

/// Rebuilds the menu in the interface language the webview reports.
#[cfg(target_os = "macos")]
#[tauri::command]
pub fn menu_set_language(app: AppHandle, language: String) -> Result<(), String> {
    LANGUAGE_ZH.store(is_zh(&language), Ordering::Relaxed);
    let overrides = OVERRIDES
        .lock()
        .map_err(|error| error.to_string())?
        .clone()
        .unwrap_or_default();
    let menu = build(&app, &overrides).map_err(|error| error.to_string())?;
    app.set_menu(menu)
        .map(|_| ())
        .map_err(|error| error.to_string())
}

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn autosave_set_enabled(app: AppHandle, enabled: bool) {
    AUTOSAVE_ENABLED.store(enabled, Ordering::Relaxed);
    set_autosave_menu_checked(&app, enabled);
}

#[cfg(target_os = "macos")]
fn menu_item(
    app: &AppHandle,
    id: &str,
    text: &str,
    accelerator: &str,
    command: &str,
    overrides: &HashMap<String, KeybindingOverride>,
) -> tauri::Result<MenuItem<Wry>> {
    let builder = MenuItemBuilder::with_id(id, text);
    let override_ = overrides.get(command);
    let builder = if override_.and_then(|value| value.disabled).unwrap_or(false) {
        builder
    } else if let Some(shortcut) = override_.and_then(|value| value.shortcut.as_deref()) {
        builder.accelerator(custom_accelerator(shortcut))
    } else {
        builder.accelerator(accelerator)
    };
    builder.build(app)
}

pub fn dispatch(app: &AppHandle, id: &str) {
    match id {
        "help_github" => {
            let _ = open::that("https://github.com/ChenRuoT/natsu");
        }
        "help_report_bug" => {
            let _ =
                open::that("https://github.com/ChenRuoT/natsu/issues/new?template=bug_report.yml");
        }
        "help_request_feature" => {
            let _ = open::that(
                "https://github.com/ChenRuoT/natsu/issues/new?template=feature_request.yml",
            );
        }
        "new_window" => {
            let _ = crate::window::open_new_window(app);
        }
        #[cfg(target_os = "macos")]
        "toggle_autosave" => {
            let enabled = !AUTOSAVE_ENABLED.fetch_xor(true, Ordering::Relaxed);
            set_autosave_menu_checked(app, enabled);
            let _ = app.emit("toggle_autosave", enabled);
        }
        "quit" => crate::window::request_quit(app),
        "close_other_tabs" | "next_tab" | "prev_tab" | "back_tab" | "forward_tab"
        | "split_right" | "split_down" | "focus_left" | "focus_right" | "focus_up"
        | "focus_down" | "sidebar_opacity" | "open_project" | "go_to_file" | "open_search"
        | "open_inbox" | "open_notes" | "find_in_project" | "find" | "new_terminal"
        | "new_terminal_tab" | "toggle_terminal" | "open_model_picker" | "open_settings"
        | "check_for_updates" => {
            let _ = app.emit(id, ());
        }
        // New Tab, Close Tab, Sidebar, Zoom, Reload, Command Palette, and Close All Tabs target
        // one window: a broadcast would make every window act on a single menu click. New Tab and
        // Close Tab also open or close a dock terminal when that window's dock has focus.
        "new_tab"
        | "close_tab"
        | "toggle_sidebar"
        | "toggle_session_sidebar"
        | "zoom_in"
        | "zoom_out"
        | "zoom_reset"
        | "reload"
        | "open_command_palette"
        | "close_all_tabs" => emit_to_focused(app, id),
        _ => {}
    }
}

/// Emit `id` to the focused window, falling back to a visible one, then any.
fn emit_to_focused(app: &AppHandle, id: &str) {
    let windows = crate::window::workspace_windows(app);
    let target = windows
        .iter()
        .find(|window| window.is_focused().unwrap_or(false))
        .or_else(|| {
            windows
                .iter()
                .find(|window| window.is_visible().unwrap_or(false))
        })
        .or(windows.first());
    match target {
        Some(window) => {
            let _ = app.emit_to(window.label(), id, ());
        }
        None => {
            let _ = app.emit(id, ());
        }
    }
}

#[cfg(target_os = "macos")]
fn build(
    app: &AppHandle,
    overrides: &HashMap<String, KeybindingOverride>,
) -> tauri::Result<Menu<Wry>> {
    let open_settings = menu_item(
        app,
        "open_settings",
        tr("Settings…"),
        "CmdOrCtrl+,",
        "App: Settings",
        overrides,
    )?;
    let check_for_updates =
        MenuItemBuilder::with_id("check_for_updates", tr("Check for Updates…")).build(app)?;
    let new_window = menu_item(
        app,
        "new_window",
        tr("New Window"),
        "CmdOrCtrl+Shift+N",
        "App: New Window",
        overrides,
    )?;
    let open_project = menu_item(
        app,
        "open_project",
        tr("Open Project…"),
        "CmdOrCtrl+O",
        "App: Open Project",
        overrides,
    )?;
    let go_to_file = menu_item(
        app,
        "go_to_file",
        tr("Go to File…"),
        "CmdOrCtrl+P",
        "App: Go to File",
        overrides,
    )?;
    let command_palette = menu_item(
        app,
        "open_command_palette",
        tr("Command Palette…"),
        "CmdOrCtrl+Shift+P",
        "App: Command Palette",
        overrides,
    )?;
    let open_search = menu_item(
        app,
        "open_search",
        tr("Search…"),
        "CmdOrCtrl+K",
        "App: Search",
        overrides,
    )?;
    let open_inbox = MenuItemBuilder::with_id("open_inbox", tr("Inbox")).build(app)?;
    let open_notes = MenuItemBuilder::with_id("open_notes", tr("Notes")).build(app)?;
    let new_tab = menu_item(
        app,
        "new_tab",
        tr("New Tab"),
        "CmdOrCtrl+T",
        "Tab: New",
        overrides,
    )?;
    let new_terminal = menu_item(
        app,
        "new_terminal",
        tr("New Terminal"),
        "CmdOrCtrl+`",
        "Terminal: New",
        overrides,
    )?;
    let new_terminal_tab = menu_item(
        app,
        "new_terminal_tab",
        tr("New Terminal Tab"),
        "CmdOrCtrl+Shift+`",
        "Terminal: New Tab",
        overrides,
    )?;
    let toggle_terminal = menu_item(
        app,
        "toggle_terminal",
        tr("Toggle Terminal"),
        "CmdOrCtrl+J",
        "Terminal: Toggle Dock",
        overrides,
    )?;
    let split_right = menu_item(
        app,
        "split_right",
        tr("Split Pane Right"),
        "CmdOrCtrl+D",
        "Pane: Split Right",
        overrides,
    )?;
    let split_down = menu_item(
        app,
        "split_down",
        tr("Split Pane Down"),
        "CmdOrCtrl+Shift+D",
        "Pane: Split Down",
        overrides,
    )?;
    let close_tab = menu_item(
        app,
        "close_tab",
        tr("Close Pane"),
        "CmdOrCtrl+W",
        "Pane: Close",
        overrides,
    )?;
    let close_other_tabs = menu_item(
        app,
        "close_other_tabs",
        tr("Close Other Tabs"),
        "CmdOrCtrl+Alt+T",
        "Tab: Close Others",
        overrides,
    )?;
    let close_all_tabs = menu_item(
        app,
        "close_all_tabs",
        tr("Close All Tabs"),
        "CmdOrCtrl+Shift+W",
        "Tab: Close All",
        overrides,
    )?;
    let next_tab = menu_item(
        app,
        "next_tab",
        tr("Next Tab"),
        "CmdOrCtrl+Shift+]",
        "Tab: Next",
        overrides,
    )?;
    let prev_tab = menu_item(
        app,
        "prev_tab",
        tr("Previous Tab"),
        "CmdOrCtrl+Shift+[",
        "Tab: Previous",
        overrides,
    )?;
    let back_tab = menu_item(
        app,
        "back_tab",
        tr("Go Back"),
        "CmdOrCtrl+[",
        "Tab: Back",
        overrides,
    )?;
    let forward_tab = menu_item(
        app,
        "forward_tab",
        tr("Go Forward"),
        "CmdOrCtrl+]",
        "Tab: Forward",
        overrides,
    )?;

    let focus_left = menu_item(
        app,
        "focus_left",
        tr("Focus Pane Left"),
        "CmdOrCtrl+Alt+Left",
        "Pane: Focus Left",
        overrides,
    )?;
    let focus_right = menu_item(
        app,
        "focus_right",
        tr("Focus Pane Right"),
        "CmdOrCtrl+Alt+Right",
        "Pane: Focus Right",
        overrides,
    )?;
    let focus_up = menu_item(
        app,
        "focus_up",
        tr("Focus Pane Up"),
        "CmdOrCtrl+Alt+Up",
        "Pane: Focus Up",
        overrides,
    )?;
    let focus_down = menu_item(
        app,
        "focus_down",
        tr("Focus Pane Down"),
        "CmdOrCtrl+Alt+Down",
        "Pane: Focus Down",
        overrides,
    )?;

    let toggle_sidebar = menu_item(
        app,
        "toggle_sidebar",
        tr("Toggle Sidebar"),
        "CmdOrCtrl+B",
        "App: Toggle Sidebar",
        overrides,
    )?;
    let toggle_session_sidebar = menu_item(
        app,
        "toggle_session_sidebar",
        tr("Toggle Session Sidebar"),
        "CmdOrCtrl+Shift+B",
        "App: Toggle Session Sidebar",
        overrides,
    )?;
    let open_model_picker = menu_item(
        app,
        "open_model_picker",
        tr("Switch Model…"),
        "CmdOrCtrl+.",
        "App: Switch Model",
        overrides,
    )?;
    let sidebar_opacity =
        MenuItemBuilder::with_id("sidebar_opacity", tr("Sidebar Appearance…")).build(app)?;
    // No accelerators here on purpose: the webview key handler owns
    // CmdOrCtrl + - 0, and a menu accelerator would fire the same command
    // a second time on top of it.
    let zoom_in = MenuItemBuilder::with_id("zoom_in", tr("Zoom In")).build(app)?;
    let zoom_out = MenuItemBuilder::with_id("zoom_out", tr("Zoom Out")).build(app)?;
    let zoom_reset = MenuItemBuilder::with_id("zoom_reset", tr("Reset Zoom")).build(app)?;
    let reload = menu_item(
        app,
        "reload",
        tr("Reload"),
        "CmdOrCtrl+Shift+R",
        "View: Reload",
        overrides,
    )?;
    let find = menu_item(
        app,
        "find",
        tr("Find"),
        "CmdOrCtrl+F",
        "Editor: Find",
        overrides,
    )?;

    let find_in_project = menu_item(
        app,
        "find_in_project",
        tr("Find in Files…"),
        "CmdOrCtrl+Shift+F",
        "App: Find in Files",
        overrides,
    )?;
    let autosave = CheckMenuItem::with_id(
        app,
        "toggle_autosave",
        tr("Autosave"),
        true,
        AUTOSAVE_ENABLED.load(Ordering::Relaxed),
        None::<&str>,
    )?;

    let file = SubmenuBuilder::with_id(app, "file", tr("File"))
        .item(&new_window)
        .item(&open_project)
        .item(&open_search)
        .item(&go_to_file)
        .item(&command_palette)
        .item(&find_in_project)
        .separator()
        .item(&autosave)
        .separator()
        .item(&new_tab)
        .item(&new_terminal)
        .item(&new_terminal_tab)
        .item(&split_right)
        .item(&split_down)
        .item(&close_tab)
        .item(&close_other_tabs)
        .item(&close_all_tabs)
        .separator()
        .item(&prev_tab)
        .item(&next_tab)
        .item(&back_tab)
        .item(&forward_tab)
        .build()?;

    let view = SubmenuBuilder::new(app, tr("View"))
        .item(&toggle_sidebar)
        .item(&toggle_session_sidebar)
        .item(&open_inbox)
        .item(&open_notes)
        .item(&toggle_terminal)
        .item(&open_model_picker)
        .separator()
        .item(&focus_left)
        .item(&focus_right)
        .item(&focus_up)
        .item(&focus_down)
        .separator()
        .item(&zoom_in)
        .item(&zoom_out)
        .item(&zoom_reset)
        .item(&reload)
        .separator()
        .item(&sidebar_opacity)
        .build()?;

    let edit = SubmenuBuilder::new(app, tr("Edit"))
        .undo()
        .redo()
        .separator()
        .cut()
        .copy()
        .paste()
        .select_all()
        .separator()
        .item(&find)
        .build()?;

    #[cfg(target_os = "macos")]
    {
        let quit = MenuItemBuilder::with_id("quit", tr("Quit Natsu"))
            .accelerator("CmdOrCtrl+Q")
            .build(app)?;
        let app_menu = SubmenuBuilder::new(app, "Natsu")
            .about(Some(AboutMetadata::default()))
            .separator()
            .item(&open_settings)
            .item(&check_for_updates)
            .separator()
            .hide()
            .hide_others()
            .show_all()
            .separator()
            .item(&quit)
            .build()?;
        // Tauri registers this submenu via NSApp.setWindowsMenu:, which throws
        // on macOS 12 when the menu is empty and aborts the app at launch.
        let window_menu =
            SubmenuBuilder::with_id(app, tauri::menu::WINDOW_SUBMENU_ID, tr("Window"))
                .minimize()
                .maximize()
                .build()?;
        let github = MenuItemBuilder::with_id("help_github", tr("View on GitHub")).build(app)?;
        let report_bug =
            MenuItemBuilder::with_id("help_report_bug", tr("Report a Bug…")).build(app)?;
        let request_feature =
            MenuItemBuilder::with_id("help_request_feature", tr("Request a Feature…"))
                .build(app)?;
        let help = SubmenuBuilder::with_id(app, tauri::menu::HELP_SUBMENU_ID, tr("Help"))
            .item(&github)
            .separator()
            .item(&report_bug)
            .item(&request_feature)
            .build()?;
        return Menu::with_items(app, &[&app_menu, &file, &edit, &view, &window_menu, &help]);
    }

    #[allow(unreachable_code)]
    Menu::with_items(app, &[&file, &edit, &view])
}

#[cfg(test)]
mod tests {
    use super::{is_zh, zh_text};

    #[test]
    fn language_tags_select_chinese() {
        assert!(is_zh("zh-CN"));
        assert!(is_zh("ZH-Hans"));
        assert!(!is_zh("en"));
        assert!(!is_zh("fr"));
    }

    #[test]
    fn every_menu_text_has_a_chinese_translation() {
        // The Mono chat popup is macOS-only code, so check its texts here too.
        let menu = include_str!("menu.rs");
        let menu = &menu[..menu.find("#[cfg(test)]").unwrap()];
        let sources = [
            menu,
            include_str!("mono_chat.rs"),
            include_str!("mono_chat/menu_bar.rs"),
        ];
        let body = sources.join("\n");
        let mut count = 0;
        for (at, _) in body.match_indices("tr(\"") {
            // `from_str("...")` and similar longer names are not `tr` calls.
            if body[..at]
                .chars()
                .next_back()
                .is_some_and(|c| c.is_alphanumeric() || c == '_')
            {
                continue;
            }
            let part = &body[at + 4..];
            let text = &part[..part.find('"').unwrap()];
            let translated = zh_text(Box::leak(text.to_owned().into_boxed_str()));
            assert_ne!(translated, text, "no Chinese text for {text:?}");
            count += 1;
        }
        assert!(count > 40, "expected many menu texts, found {count}");
        // The popup's action titles are constants passed to `tr` indirectly.
        let bar = include_str!("mono_chat/menu_bar.rs");
        for part in bar.split("title: \"").skip(1) {
            let text = &part[..part.find('"').unwrap()];
            let translated = zh_text(Box::leak(text.to_owned().into_boxed_str()));
            assert_ne!(translated, text, "no Chinese text for {text:?}");
        }
    }
}
