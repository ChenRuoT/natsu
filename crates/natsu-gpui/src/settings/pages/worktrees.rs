use crate::{
    settings::{
        SettingsView,
        management::Target,
        widgets::{note, secondary_button},
    },
    theme::*,
};
use gpui::{AnyElement, Context, SharedString, div, prelude::*, px};
use natsu_core::i18n::{tr, tr_fmt};
impl SettingsView {
    pub(super) fn worktrees_page(&mut self, cx: &mut Context<Self>) -> Vec<AnyElement> {
        let project = self.project_picker(cx);
        let ready = !self.discovery_loading
            && self.discovery.worktrees.error.is_none()
            && !self.discovery.worktrees.main.is_empty();
        let mut page=vec![div().relative().child(self.reveal_probe("project-worktrees")).flex().items_center().gap_1().child(project).child(secondary_button("create-settings-worktree",tr("Create worktree"),false,!ready).child(icon("plus",12.)).child(tr("Create worktree")).on_click(cx.listener(move|this,_,window,cx|{if ready{this.open_management(Target::Worktree,window,cx);}}))).into_any_element(),div().mt_4().flex().items_center().justify_between().gap_3().child(div().min_w_0().flex_1().text_size(px(12.)).line_height(px(18.)).text_color(content(0.5)).child(tr("Sessions can share a worktree. Deleting one keeps its sessions by default and discards uncommitted changes. Its branch and commits are kept."))).child(self.refresh_button("refresh-settings-worktrees",tr("Refresh"),cx)).into_any_element()];
        if self.selected_project.is_empty() {
            page.push(note(tr("Add a project to manage its worktrees.")));
        } else if self.discovery_loading {
            page.push(note(tr("Loading worktrees…")));
        } else if let Some(error) = &self.discovery.worktrees.error {
            page.push(
                div()
                    .id("settings-page-error")
                    .mt_4()
                    .role(gpui::Role::Alert)
                    .text_size(px(12.))
                    .text_color(gpui::rgb(0xf87171))
                    .child(error.clone())
                    .into_any_element(),
            );
        } else if self.discovery.worktrees.trees.is_empty() {
            page.push(
                div()
                    .mt_4()
                    .rounded_xl()
                    .border_1()
                    .border_color(content(0.1))
                    .px_4()
                    .py_8()
                    .flex()
                    .flex_col()
                    .items_center()
                    .gap_2()
                    .child(icon("folder-tree", 20.))
                    .child(
                        div()
                            .text_size(px(13.))
                            .font_weight(gpui::FontWeight::MEDIUM)
                            .child(tr("No additional worktrees")),
                    )
                    .child(div().text_size(px(12.)).text_color(content(0.5)).child(tr(
                        "Create a worktree to work on another branch in a separate folder.",
                    )))
                    .into_any_element(),
            );
        } else {
            let trees = self.discovery.worktrees.trees.clone();
            page.push(
                div()
                    .mt_4()
                    .rounded_xl()
                    .border_1()
                    .border_color(content(0.1))
                    .overflow_hidden()
                    .children(trees.into_iter().enumerate().map(|(ix, tree)| {
                        let t = &tree.tree;
                        let path = std::path::PathBuf::from(&t.path);
                        let count = self
                            .ctx
                            .sessions
                            .iter()
                            .filter(|(_, p, _)| natsu_core::files::is_equal_or_inside(p, &t.path))
                            .count();
                        let status = if t.missing {
                            tr("Missing folder")
                        } else if tree.dirty == Some(true) {
                            tr("Uncommitted changes")
                        } else if tree.dirty == Some(false) {
                            tr("Clean")
                        } else {
                            tr("Status unavailable")
                        };
                        let blocked = tree.locked || t.branch.is_none();
                        div()
                            .p_4()
                            .flex()
                            .items_start()
                            .gap_3()
                            .border_b_1()
                            .border_color(content(0.1))
                            .child(icon("folder-tree", 16.))
                            .child(
                                div()
                                    .min_w_0()
                                    .flex_1()
                                    .child(
                                        div()
                                            .text_size(px(13.))
                                            .font_weight(gpui::FontWeight::MEDIUM)
                                            .child(
                                                path.file_name()
                                                    .unwrap_or_default()
                                                    .to_string_lossy()
                                                    .into_owned(),
                                            ),
                                    )
                                    .child(
                                        div()
                                            .mt_1()
                                            .text_size(px(11.))
                                            .text_color(content(0.4))
                                            .child(t.path.clone()),
                                    )
                                    .child(
                                        div()
                                            .mt_2()
                                            .flex()
                                            .items_center()
                                            .gap_1()
                                            .text_size(px(11.))
                                            .text_color(content(0.55))
                                            .child(icon("git-branch", 12.))
                                            .child(
                                                t.branch
                                                    .as_ref()
                                                    .map(|b| tr_fmt("Current branch: {branch}", &[("branch", b)]))
                                                    .unwrap_or_else(|| {
                                                        tr_fmt(
                                                            "Detached at {head}",
                                                            &[(
                                                                "head",
                                                                &t.head
                                                                    .chars()
                                                                    .take(7)
                                                                    .collect::<String>(),
                                                            )],
                                                        )
                                                    }),
                                            ),
                                    )
                                    .child(
                                        div()
                                            .mt_2()
                                            .text_size(px(11.))
                                            .text_color(content(0.55))
                                            .child({
                                                let unpublished = if tree.unpushed > 0 {
                                                    tr_fmt(
                                                        " · {commits} unpublished commits",
                                                        &[("commits", &tree.unpushed)],
                                                    )
                                                } else {
                                                    String::new()
                                                };
                                                let locked = if tree.locked {
                                                    tr(" · Locked")
                                                } else {
                                                    ""
                                                };
                                                if count == 1 {
                                                    tr_fmt(
                                                        "{count} session in this worktree · {status}{unpublished}{locked}",
                                                        &[
                                                            ("count", &count),
                                                            ("status", &status),
                                                            ("unpublished", &unpublished),
                                                            ("locked", &locked),
                                                        ],
                                                    )
                                                } else {
                                                    tr_fmt(
                                                        "{count} sessions in this worktree · {status}{unpublished}{locked}",
                                                        &[
                                                            ("count", &count),
                                                            ("status", &status),
                                                            ("unpublished", &unpublished),
                                                            ("locked", &locked),
                                                        ],
                                                    )
                                                }
                                            }),
                                    ),
                            )
                            .child(
                                secondary_button(
                                    SharedString::from(format!("reveal-tree-{ix}")),
                                    tr_fmt(
                                        "Reveal {branch}",
                                        &[(
                                            "branch",
                                            &t.branch.as_deref().unwrap_or(tr("worktree")),
                                        )],
                                    ),
                                    false,
                                    t.missing,
                                )
                                .child(icon("folder-open", 16.))
                                .on_click(move |_, _, cx| cx.reveal_path(&path)),
                            )
                            .child(
                                secondary_button(
                                    SharedString::from(format!("delete-tree-{ix}")),
                                    tr_fmt(
                                        "Delete {branch}",
                                        &[(
                                            "branch",
                                            &t.branch.as_deref().unwrap_or(tr("worktree")),
                                        )],
                                    ),
                                    false,
                                    blocked,
                                )
                                .child(icon("trash", 16.))
                                .on_click(cx.listener(
                                    move |this, _, window, cx| {
                                        if !blocked {
                                            this.open_management(
                                                Target::DeleteTree(tree.clone()),
                                                window,
                                                cx,
                                            );
                                        }
                                    },
                                )),
                            )
                    }))
                    .into_any_element(),
            );
        }
        if ready {
            page.push(note(tr_fmt(
                "New worktrees are created in {folder}.",
                &[("folder", &self.discovery.worktrees.default_root.display())],
            )));
        }
        page
    }
}
