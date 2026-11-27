//! GeneralPage and UpdateRow.
use crate::notifications::updater::{self, Action};
use crate::settings::{
    SettingsView,
    widgets::{primary_button, secondary_button},
};
use crate::theme::*;
use gpui::{AnyElement, Context, FontWeight, div, prelude::*, px};
use natsu_core::i18n::{tr, tr_fmt};

impl SettingsView {
    pub(super) fn general_page(&mut self, cx: &mut Context<Self>) -> Vec<AnyElement> {
        let p = self.prefs.clone();
        let alerts = vec![
            self.row(
                Some("sounds"),
                true,
                tr("Sounds"),
                Some(tr("Play sounds for activity, completed turns, and updates.").into()),
                vec![self.toggle(
                    "sounds",
                    tr("Sounds"),
                    p.sounds,
                    false,
                    cx,
                    |this, on, cx| this.update(cx, |p| p.sounds = on),
                )],
            ),
            self.row(
                Some("notifications"),
                false,
                tr("Notifications"),
                Some(tr("Alert when reminders are due or agents finish or need input.").into()),
                {
                    let mut controls = self.notification_permission_controls(cx);
                    controls.push(self.toggle(
                        "notifications",
                        tr("Notifications"),
                        p.notifications,
                        false,
                        cx,
                        |this, on, cx| {
                            this.update(cx, |p| p.notifications = on);
                            if on {
                                this.probe_notification_permission(true, cx);
                            }
                        },
                    ));
                    controls
                },
            ),
        ];
        let mut workspace = vec![
            self.row(
                Some("file-tabs"),
                true,
                tr("File tabs"),
                Some(tr("Choose where files open.").into()),
                vec![self.segmented(
                    "file-tabs",
                    tr("File tabs"),
                    &p.file_tabs,
                    &[("pane", tr("Beside chat")), ("workspace", tr("Top bar"))],
                    cx,
                    |this, v, cx| this.update(cx, |p| p.file_tabs = v.into()),
                )],
            ),
            self.row(
                Some("file-word-wrap"),
                false,
                tr("Word wrap"),
                Some(tr("Wrap long lines to fit the editor.").into()),
                vec![self.toggle(
                    "file-word-wrap",
                    tr("Word wrap"),
                    p.file_word_wrap,
                    false,
                    cx,
                    |this, on, cx| this.update(cx, |p| p.file_word_wrap = on),
                )],
            ),
            self.row(
                Some("tab-animations"),
                false,
                tr("Tab animations"),
                Some(tr("Animate tabs as they open and close.").into()),
                vec![self.toggle(
                    "tab-animations",
                    tr("Tab animations"),
                    p.tab_animations,
                    false,
                    cx,
                    |this, on, cx| this.update(cx, |p| p.tab_animations = on),
                )],
            ),
            self.row(
                Some("notes"),
                false,
                tr("Notes"),
                Some(
                    tr("Show Notes in project navigation. Mention saved notes with @note.").into(),
                ),
                vec![
                    self.toggle("notes", tr("Notes"), p.notes, false, cx, |this, on, cx| {
                        this.update(cx, |p| p.notes = on)
                    }),
                ],
            ),
        ];
        if cfg!(target_os = "macos") {
            workspace.push(self.row(
                Some("quick-composer"),
                false,
                tr("Quick composer"),
                Some(tr_fmt(
                    "Press {shortcut} from any app. Return starts a session in the background; ⌘Return opens it. Change the shortcut in Keybindings.",
                    &[("shortcut", &super::keybindings::quick_composer_label(&p))],
                ).into()),
                {let mut controls=Vec::new();if let Some(error)=&self.ctx.quick_error{controls.push(super::super::widgets::note(error.clone()));}controls.push(self.toggle(
                    "quick-composer",
                    tr("Quick composer"),
                    p.quick_composer,
                    false,
                    cx,
                    |this, on, cx| this.update(cx, |p| p.quick_composer = on),
                ));controls},
            ));
        }
        workspace.push(self.row(
            Some("search-panel"),
            false,
            tr("Search as command panel"),
            Some(
                tr("Open search as a floating panel over your work instead of a page with its own tab.")
                    .into(),
            ),
            vec![self.toggle(
                "search-panel",
                tr("Search as command panel"),
                p.search_panel,
                false,
                cx,
                |this, on, cx| this.update(cx, |p| p.search_panel = on),
            )],
        ));
        workspace.push(self.row(
            Some("working-agents"),
            false,
            tr("Working agents"),
            Some(tr("Show active chats across projects. Finished chats stay until opened.").into()),
            vec![self.toggle(
                "working-agents",
                tr("Working agents"),
                p.working_agents,
                false,
                cx,
                |this, on, cx| this.update(cx, |p| p.working_agents = on),
            )],
        ));
        workspace.push(self.row(
            Some("action-opens-terminal"),
            false,
            tr("Show terminal for actions"),
            Some(
                tr("Open the terminal when an action runs. Off, actions run in the background.").into(),
            ),
            vec![self.toggle(
                "action-opens-terminal",
                tr("Show terminal for actions"),
                p.action_opens_terminal,
                false,
                cx,
                |this, on, cx| this.update(cx, |p| p.action_opens_terminal = on),
            )],
        ));
        workspace.push(self.row(
            Some("terminal-placement"),
            false,
            tr("Terminal"),
            Some(tr("Where new terminals open: docked below the chat, as a tab in the right panel (Focused layout), or as their own tabs in the title bar.").into()),
            vec![self.segmented(
                "terminal-placement",
                tr("Terminal"),
                p.terminal_placement(),
                &[
                    ("bottom", tr("Bottom")),
                    ("panel", tr("Side panel")),
                    ("title", tr("Title bar")),
                ],
                cx,
                |this, v, cx| this.update(cx, |p| p.set_terminal_placement(v)),
            )],
        ));
        if cfg!(target_os = "windows") {
            workspace.push(self.row(
                Some("close-to-tray"),
                false,
                tr("Close to tray"),
                Some(tr("Closing a window hides it to the system tray instead of quitting, so running agents keep going. Reopen from the tray icon, and quit for real from its menu. Turn this off to have close end the window.").into()),
                vec![self.toggle(
                    "close-to-tray",
                    tr("Close to tray"),
                    p.close_to_tray,
                    false,
                    cx,
                    |this, on, cx| this.update(cx, |p| p.close_to_tray = on),
                )],
            ));
        }
        let version = crate::notifications::updater::version();
        let about = vec![
            self.row(
                Some("update"),
                true,
                div()
                    .flex()
                    .items_baseline()
                    .gap_2()
                    .child(tr("Version"))
                    .child(
                        div()
                            .font_family(crate::fonts::mono())
                            .text_size(px(12.))
                            .font_weight(FontWeight::NORMAL)
                            .text_color(content(0.45))
                            .child(version),
                    ),
                Some(
                    cx.try_global::<updater::Shared>()
                        .and_then(|shared| updater::status(&shared.0, cx))
                        .unwrap_or_else(|| {
                            tr("View release notes and check for app and agent updates.").into()
                        })
                        .into(),
                ),
                vec![
                    div()
                        .flex()
                        .items_center()
                        .gap_2()
                        .child(
                            secondary_button("whats-new", tr("What's new"), false, false)
                                .child(tr("What's new"))
                                .on_click(cx.listener(|_, _, _, cx| {
                                    cx.emit(crate::settings::SettingsEvent::WhatsNew)
                                })),
                        )
                        .child(
                            secondary_button(
                                "check-harness-updates",
                                tr("Check harness updates"),
                                false,
                                false,
                            )
                            .child(tr("Check harness updates"))
                            .on_click(cx.listener(|_, _, _, cx| {
                                cx.emit(crate::settings::SettingsEvent::CheckHarnessUpdates)
                            })),
                        )
                        .child(self.app_update_button(cx))
                        .into_any_element(),
                ],
            ),
        ];
        vec![
            self.group(None, true, tr("Alerts"), None, None, alerts),
            self.group(None, false, tr("Workspace"), None, None, workspace),
            self.group(None, false, tr("About"), None, None, about),
        ]
    }
}
impl SettingsView {
    /// Check for updates, or once one is found, install it in place.
    fn app_update_button(&self, cx: &mut Context<Self>) -> AnyElement {
        let updater = cx
            .try_global::<updater::Shared>()
            .map(|shared| shared.0.clone());
        match updater.as_ref().map(|u| updater::action(u, cx)) {
            Some(Action::Install(version)) => {
                let label = tr_fmt("Update to {version}", &[("version", &version)]);
                let mut ink = shell_fill();
                ink.a = 1.;
                primary_button("check-updates", label.clone(), false)
                    .child(icon("arrow-down-circle", 14.).text_color(ink))
                    .child(label)
                    .on_click(move |_, _, cx| {
                        if let Some(updater) = &updater {
                            updater::install(updater, cx)
                        }
                    })
                    .into_any_element()
            }
            Some(Action::Busy(label)) => {
                secondary_button("check-updates", label.clone(), false, true)
                    .child(icon("loader", 14.).text_color(content(0.7)))
                    .child(label)
                    .into_any_element()
            }
            Some(Action::Check) | None => {
                secondary_button("check-updates", tr("Check for updates"), false, false)
                    .child(icon("refresh-cw", 14.).text_color(content(0.7)))
                    .child(tr("Check for updates"))
                    .on_click(cx.listener(|_, _, _, cx| {
                        cx.emit(crate::settings::SettingsEvent::CheckAppUpdates)
                    }))
                    .into_any_element()
            }
        }
    }
}
