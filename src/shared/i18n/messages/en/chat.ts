export const chat = {
  "settings.chat.transcriptGroup.title": "Transcript",
  "settings.chat.transcriptGroup.description":
    "How a conversation reads as it grows.",
  "settings.chat.transcriptLayout.label": "Transcript layout",
  "settings.chat.transcriptLayout.description":
    "Full width keeps user prompts as a spanning card. Chat aligns them to the right with a max width, like a messaging app.",
  "settings.chat.transcriptLayout.full": "Full width",
  "settings.chat.transcriptLayout.chat": "Chat",
  "settings.chat.anchorPrompts.label": "Anchor prompts to top",
  "settings.chat.anchorPrompts.description":
    "When you send, the new prompt sits at the top of the transcript and the reply grows into the space below. Turn this off to keep the classic layout, with the latest message resting on the composer.",
  "settings.chat.smoothReveal.label": "Smooth text reveal",
  "settings.chat.smoothReveal.description":
    "Reveal incoming bursts gradually. Turn this off to show received text immediately. This changes presentation timing, not processing speed.",
  "settings.chat.composerGroup.title": "Composer",
  "settings.chat.composerGroup.description":
    "What the composer does with what you type.",
  "settings.chat.followUp.label": "Follow-up behavior",
  "settings.chat.followUp.description":
    "Queue follow-ups until the active turn finishes, or steer the active turn immediately.",
  "settings.chat.followUp.queue": "Queue",
  "settings.chat.followUp.steer": "Steer",
  "settings.chat.modelControls.label": "Model controls",
  "settings.chat.modelControls.description":
    "Show model options beside the picker instead of inside the model menu.",
  "settings.chat.modelControls.menu": "Menu",
  "settings.chat.modelControls.beside": "Beside",
  "settings.chat.autocorrect.label": "Autocorrect",
  "settings.chat.autocorrect.description":
    "Spell check and autocorrect prompts in session and mono composers. Turn this off to keep the text exactly as typed.",
  "settings.chat.editorGroup.title": "Editor",
  "settings.chat.editorGroup.description":
    "What happens when you save a file in the workspace editor.",
  "settings.chat.formatOnSave.label": "Format on save",
  "settings.chat.formatOnSave.description":
    "Run Prettier on supported files before writing. Off keeps the text you typed, including quote style.",
  "settings.chat.reviewGroup.title": "Code review",
  "settings.chat.reviewGroup.description":
    "Where a turn's changes open when you go to read them.",
  "settings.chat.diffView.label": "Diff view",
  "settings.chat.diffView.description":
    "Editor keeps working-tree changes in the file. Unified stacks every changed file in one review, with sticky headers and collapsed unchanged lines.",
  "settings.chat.diffView.editor": "Editor",
  "settings.chat.diffView.unified": "Unified",
  "settings.chat.extrasGroup.title": "Extras",
  "settings.chat.extrasGroup.description":
    "Idle animation, and nothing else. Turn both off for a still workspace.",
  "settings.chat.mascot.label": "Composer mascot",
  "settings.chat.mascot.description":
    "When a turn is running, the project mascot runs along the composer, bonks the scroll-to-latest button the first time, then jumps it, and sometimes grabs a coin.",
  "settings.chat.emptyGames.label": "Empty session games",
  "settings.chat.emptyGames.description":
    "Pac-man and snake idle on the empty-session grid. Hover the band to take control of whichever is on screen. Turn this off to keep the pane still.",
} as const;
