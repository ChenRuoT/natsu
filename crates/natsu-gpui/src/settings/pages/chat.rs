//! ChatPage.
use crate::settings::SettingsView;
use gpui::{AnyElement, Context};
use natsu_core::i18n::tr;

impl SettingsView {
    pub(super) fn chat_page(&mut self, cx: &mut Context<Self>) -> Vec<AnyElement> {
        let p = self.prefs.clone();
        let transcript = vec![
            self.row(
                Some("transcript-layout"),
                true,
                tr("Transcript layout"),
                Some(tr("Show prompts at full width or as right-aligned chat bubbles.").into()),
                vec![self.segmented(
                    "transcript-layout",
                    tr("Transcript layout"),
                    &p.transcript_layout,
                    &[("full", tr("Full width")), ("chat", tr("Chat"))],
                    cx,
                    |this, v, cx| this.update(cx, |p| p.transcript_layout = v.into()),
                )],
            ),
            self.row(
                Some("anchor-prompts"),
                false,
                tr("Anchor prompts to top"),
                Some(tr("Place new prompts at the top, with replies below.").into()),
                vec![self.toggle(
                    "anchor-prompts",
                    tr("Anchor prompts to top"),
                    p.anchor_prompts,
                    false,
                    cx,
                    |this, on, cx| this.update(cx, |p| p.anchor_prompts = on),
                )],
            ),
            self.row(
                Some("paced-reveal"),
                false,
                tr("Smooth text reveal"),
                Some(tr("Reveal incoming text gradually.").into()),
                vec![self.toggle(
                    "paced-reveal",
                    tr("Smooth text reveal"),
                    p.paced_reveal,
                    false,
                    cx,
                    |this, on, cx| this.update(cx, |p| p.paced_reveal = on),
                )],
            ),
            self.row(
                Some("collapse-tool-groups"),
                false,
                tr("Collapse tool groups"),
                Some(tr("Keep tool groups closed, even while they run. Click a group to see its steps.").into()),
                vec![self.toggle(
                    "collapse-tool-groups",
                    tr("Collapse tool groups"),
                    p.collapse_tool_groups,
                    false,
                    cx,
                    |this, on, cx| this.update(cx, |p| p.collapse_tool_groups = on),
                )],
            ),
            self.row(
                Some("fold-finished-work"),
                false,
                tr("Fold finished work"),
                Some(tr("Fold a finished reply's tool calls under \"worked for\". Turn off to keep text and tool groups inline.").into()),
                vec![self.toggle(
                    "fold-finished-work",
                    tr("Fold finished work"),
                    p.fold_finished_work,
                    false,
                    cx,
                    |this, on, cx| this.update(cx, |p| p.fold_finished_work = on),
                )],
            ),
        ];
        let composer = vec![
            self.row(
                Some("follow-up"),
                true,
                tr("Follow-up behavior"),
                Some(tr("Queue follow-ups until the active turn finishes, or steer the active turn immediately.").into()),
                vec![self.segmented(
                    "follow-up",
                    tr("Follow-up behavior"),
                    &p.follow_up,
                    &[("queue", tr("Queue")), ("steer", tr("Steer"))],
                    cx,
                    |this, v, cx| this.update(cx, |p| p.follow_up = v.into()),
                )],
            ),
            self.row(
                Some("model-controls"),
                false,
                tr("Model controls"),
                Some(tr("Show model options beside the picker instead of inside the model menu.").into()),
                vec![self.segmented(
                    "model-controls",
                    tr("Model controls"),
                    &p.model_controls,
                    &[("menu", tr("Menu")), ("beside", tr("Beside"))],
                    cx,
                    |this, v, cx| this.update(cx, |p| p.model_controls = v.into()),
                )],
            ),
            self.row(
                Some("composer-autocorrect"),
                false,
                tr("Autocorrect"),
                Some(tr("Spell check and autocorrect prompts.").into()),
                vec![self.toggle(
                    "composer-autocorrect",
                    tr("Autocorrect"),
                    p.autocorrect,
                    false,
                    cx,
                    |this, on, cx| this.update(cx, |p| p.autocorrect = on),
                )],
            ),
        ];
        let editor = vec![self.row(
            Some("format-on-save"),
            true,
            tr("Format on save"),
            Some(tr("Format supported files with Prettier before saving.").into()),
            vec![self.toggle(
                "format-on-save",
                tr("Format on save"),
                p.format_on_save,
                false,
                cx,
                |this, on, cx| this.update(cx, |p| p.format_on_save = on),
            )],
        )];
        let review = vec![self.row(
            Some("diff-view"),
            true,
            tr("Diff view"),
            Some(tr("Review changes in the editor or in a combined diff.").into()),
            vec![self.segmented(
                "diff-view",
                tr("Diff view"),
                &p.diff_view,
                &[("editor", tr("Editor")), ("unified", tr("Unified"))],
                cx,
                |this, v, cx| this.update(cx, |p| p.diff_view = v.into()),
            )],
        )];
        let extras = vec![
            self.row(
                Some("composer-mascot"),
                true,
                tr("Composer mascot"),
                Some(tr("Show the project mascot while an agent works.").into()),
                vec![self.toggle(
                    "composer-mascot",
                    tr("Composer mascot"),
                    p.composer_mascot,
                    false,
                    cx,
                    |this, on, cx| this.update(cx, |p| p.composer_mascot = on),
                )],
            ),
            self.row(
                Some("empty-session"),
                false,
                tr("Empty session"),
                Some(tr("Stir dithered ink, play a game, or leave it blank.").into()),
                vec![self.segmented(
                    "empty-session",
                    tr("Empty session"),
                    &p.empty_session,
                    &[
                        ("ink", tr("Ink")),
                        ("games", tr("Games")),
                        ("none", tr("Off")),
                    ],
                    cx,
                    |this, v, cx| this.update(cx, |p| p.empty_session = v.into()),
                )],
            ),
        ];
        vec![
            self.group(None, true, tr("Transcript"), None, None, transcript),
            self.group(None, false, tr("Composer"), None, None, composer),
            self.group(None, false, tr("Editor"), None, None, editor),
            self.group(None, false, tr("Code review"), None, None, review),
            self.group(None, false, tr("Extras"), None, None, extras),
        ]
    }
}
