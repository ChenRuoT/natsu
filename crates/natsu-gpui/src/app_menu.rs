//! The native menu bar, after the Tauri app's `menu.rs`. Items dispatch GPUI
//! actions, so their shortcuts follow the live keymap and items the focused
//! view cannot handle are disabled.
use crate::{
    Quit,
    file_editor::{Find, Format, ReloadFile, Replace, Save, ToggleAutosave, ToggleWordWrap},
    input,
    shell::*,
};
use gpui::{App, KeyBinding, Menu, MenuItem, actions};
use natsu_core::i18n::tr;

actions!(application, [Hide, HideOthers, ShowAll]);

/// Opens a Help menu link in the browser.
#[derive(Clone, Debug, PartialEq, gpui::Action)]
#[action(namespace = application, no_json)]
pub(crate) struct OpenUrl(pub &'static str);

const REPO: &str = "https://github.com/ChenRuoT/natsu";

pub(crate) fn bind(cx: &mut App) {
    cx.on_action(|_: &Hide, cx| cx.hide());
    cx.on_action(|_: &HideOthers, cx| cx.hide_other_apps());
    cx.on_action(|_: &ShowAll, cx| cx.unhide_other_apps());
    cx.on_action(|action: &OpenUrl, cx| cx.open_url(action.0));
    if cfg!(target_os = "macos") {
        cx.bind_keys([
            KeyBinding::new("cmd-h", Hide, None),
            KeyBinding::new("cmd-alt-h", HideOthers, None),
            KeyBinding::new("cmd-m", MinimizeWindow, None),
        ]);
    }
}

/// Set once the first window has presented a frame.
struct MenuReady;
impl gpui::Global for MenuReady {}

/// Installs the menu bar, called after the first frame is on screen. Setting
/// the main menu makes AppKit check for Writing Tools, which loads a framework
/// on the main thread (about 70 ms), so launch must not wait for it.
pub(crate) fn ready(cx: &mut App) {
    cx.set_global(MenuReady);
    if let Some(prefs) = cx.try_global::<crate::settings::Preferences>().cloned() {
        install(&prefs, cx);
    }
}

pub(crate) fn install(prefs: &crate::settings::Preferences, cx: &mut App) {
    if !cx.has_global::<MenuReady>() {
        return;
    }
    cx.set_menus(vec![
        // The product name stays as written; the menus below are localized.
        // "Window" and "Help" keep their English titles: AppKit recognizes
        // those two menus by name and adds its own items to them.
        Menu::new("Natsu Native").items([
            MenuItem::action(tr("About Natsu Native"), About),
            MenuItem::separator(),
            MenuItem::action(tr("Settings…"), OpenSettings),
            MenuItem::action(tr("Check for Updates…"), CheckForUpdates),
            MenuItem::separator(),
            MenuItem::action(tr("Hide Natsu Native"), Hide),
            MenuItem::action(tr("Hide Others"), HideOthers),
            MenuItem::action(tr("Show All"), ShowAll),
            MenuItem::separator(),
            MenuItem::action(tr("Quit Natsu Native"), Quit),
        ]),
        Menu::new(tr("File")).items([
            MenuItem::action(tr("Open Project…"), OpenProject),
            MenuItem::action(tr("Search…"), FocusSearch),
            MenuItem::action(tr("Go to File…"), GoToFile),
            MenuItem::action(tr("Command Palette…"), OpenCommandPalette),
            MenuItem::action(tr("Find in Files…"), SearchFiles),
            MenuItem::separator(),
            MenuItem::action(tr("Save"), Save),
            MenuItem::action(tr("Reload File"), ReloadFile),
            MenuItem::action(tr("Autosave"), ToggleAutosave).checked(prefs.autosave),
            MenuItem::separator(),
            MenuItem::action(tr("New Tab"), NewCodex),
            MenuItem::action(tr("New Claude Tab"), NewClaude),
            MenuItem::action(tr("New Terminal"), NewTerminal),
            MenuItem::action(tr("Split Terminal Right"), SplitTerminal),
            MenuItem::action(tr("Split Pane Right"), SplitRight),
            MenuItem::action(tr("Split Pane Down"), SplitDown),
            MenuItem::action(tr("Close Pane"), CloseTab),
            MenuItem::action(tr("Close Other Tabs"), CloseOtherTabs),
            MenuItem::action(tr("Close All Tabs"), CloseAllTabs),
            MenuItem::separator(),
            MenuItem::action(tr("Previous Tab"), PreviousTab),
            MenuItem::action(tr("Next Tab"), NextTab),
            MenuItem::action(tr("Back"), VisitBack),
            MenuItem::action(tr("Forward"), VisitForward),
        ]),
        Menu::new(tr("Edit")).items([
            MenuItem::action(tr("Undo"), input::Undo),
            MenuItem::action(tr("Redo"), input::Redo),
            MenuItem::separator(),
            MenuItem::action(tr("Cut"), input::Cut),
            MenuItem::action(tr("Copy"), input::Copy),
            MenuItem::action(tr("Paste"), input::Paste),
            MenuItem::action(tr("Select All"), input::SelectAll),
            MenuItem::separator(),
            MenuItem::action(tr("Find"), Find),
            MenuItem::action(tr("Replace"), Replace),
            MenuItem::action(tr("Format Document"), Format),
            MenuItem::action(tr("Word Wrap"), ToggleWordWrap).checked(prefs.file_word_wrap),
            MenuItem::separator(),
            MenuItem::action(tr("Fold"), input::FoldCode),
            MenuItem::action(tr("Unfold"), input::UnfoldCode),
            MenuItem::action(tr("Fold All"), input::FoldAll),
            MenuItem::action(tr("Unfold All"), input::UnfoldAll),
        ]),
        Menu::new(tr("View")).items([
            MenuItem::action(tr("Toggle Sidebar"), ToggleSidebar),
            MenuItem::action(tr("Toggle Session Sidebar"), ToggleRightPanel),
            MenuItem::action(tr("Toggle Layout"), ToggleLayout),
            MenuItem::action(tr("Toggle Workspace Style"), ToggleWorkspaceStyle),
            MenuItem::action(tr("Inbox"), OpenInbox),
            MenuItem::action(tr("Notes"), OpenNotes),
            MenuItem::action(tr("Toggle Terminal"), ToggleTerminal),
            MenuItem::action(tr("Switch Model…"), SwitchModel),
            MenuItem::separator(),
            MenuItem::action(tr("Previous Session"), PreviousSession),
            MenuItem::action(tr("Next Session"), NextSession),
            MenuItem::action(tr("Previous Project"), PreviousProject),
            MenuItem::action(tr("Next Project"), NextProject),
            MenuItem::separator(),
            MenuItem::action(tr("Focus Left"), FocusPaneLeft),
            MenuItem::action(tr("Focus Right"), FocusPaneRight),
            MenuItem::action(tr("Focus Up"), FocusPaneUp),
            MenuItem::action(tr("Focus Down"), FocusPaneDown),
            MenuItem::separator(),
            MenuItem::action(tr("Zoom In"), ZoomIn),
            MenuItem::action(tr("Zoom Out"), ZoomOut),
            MenuItem::action(tr("Reset Zoom"), ResetZoom),
            MenuItem::action(tr("Reload"), Reload),
            MenuItem::separator(),
            MenuItem::action(tr("Sidebar Appearance…"), SidebarAppearance),
        ]),
        // AppKit adds its window list here once the menu is named "Window".
        Menu::new("Window").items([
            MenuItem::action(tr("Minimize"), MinimizeWindow),
            MenuItem::action(tr("Zoom"), ZoomWindow),
        ]),
        Menu::new("Help").items([
            MenuItem::action(tr("View on GitHub"), OpenUrl(REPO)),
            MenuItem::separator(),
            MenuItem::action(
                tr("Report a Bug…"),
                OpenUrl(concat!(
                    "https://github.com/ChenRuoT/natsu",
                    "/issues/new?template=bug_report.yml"
                )),
            ),
            MenuItem::action(
                tr("Request a Feature…"),
                OpenUrl(concat!(
                    "https://github.com/ChenRuoT/natsu",
                    "/issues/new?template=feature_request.yml"
                )),
            ),
        ]),
    ]);
}
