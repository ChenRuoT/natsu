//! Tray icon: the way back to a window that closing hid.
//!
//! Windows only. Closing a window hides it so the harness children keep
//! running, and a hidden window drops off the taskbar, so without this the
//! windows would be unreachable.

use tauri::menu::{Menu, MenuBuilder, MenuItemBuilder};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Wry};

const SHOW: &str = "tray_show";
const QUIT: &str = "tray_quit";

/// Menu text for a UI language tag such as `en` or `zh-CN`. The webview owns
/// the language setting and reports it through `tray_set_language`.
fn labels(language: &str) -> (&'static str, &'static str) {
    if language.to_ascii_lowercase().starts_with("zh") {
        ("显示 Natsu", "退出 Natsu")
    } else {
        ("Show Natsu", "Quit Natsu")
    }
}

fn build_menu(app: &AppHandle, language: &str) -> tauri::Result<Menu<Wry>> {
    let (show_text, quit_text) = labels(language);
    let show = MenuItemBuilder::with_id(SHOW, show_text).build(app)?;
    let quit = MenuItemBuilder::with_id(QUIT, quit_text).build(app)?;
    MenuBuilder::new(app).items(&[&show, &quit]).build()
}

/// Rebuilds the tray menu when the user changes the interface language.
#[tauri::command]
pub fn tray_set_language(app: AppHandle, language: String) -> Result<(), String> {
    let menu = build_menu(&app, &language).map_err(|error| error.to_string())?;
    if let Some(tray) = app.tray_by_id("main") {
        tray.set_menu(Some(menu))
            .map_err(|error| error.to_string())?;
    }
    Ok(())
}

pub fn install(app: &AppHandle) -> tauri::Result<()> {
    let menu = build_menu(app, "en")?;

    let mut tray = TrayIconBuilder::with_id("main")
        .tooltip("Natsu")
        .menu(&menu)
        // Left click reopens; the menu stays on the right button.
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id().as_ref() {
            SHOW => {
                let _ = crate::window::show_hidden_or_open_new(app);
            }
            QUIT => crate::window::request_quit(app),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let _ = crate::window::show_hidden_or_open_new(tray.app_handle());
            }
        });

    if let Some(icon) = app.default_window_icon().cloned() {
        tray = tray.icon(icon);
    }

    tray.build(app)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::labels;

    #[test]
    fn labels_follow_the_ui_language() {
        assert_eq!(labels("en"), ("Show Natsu", "Quit Natsu"));
        assert_eq!(labels("zh-CN"), ("显示 Natsu", "退出 Natsu"));
        assert_eq!(labels("ZH-Hans"), ("显示 Natsu", "退出 Natsu"));
        assert_eq!(labels("fr"), ("Show Natsu", "Quit Natsu"));
    }
}
