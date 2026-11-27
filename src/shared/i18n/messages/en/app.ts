export const app = {
  "app.App.whatsNewUnavailable":
    "Release notes for this version are not available in this build.",
  "app.App.closeTabUnsaved": "Close this tab with unsaved files?",
  "app.App.closeTabsUnsaved": "Close these tabs with unsaved files?",
  "app.App.closeFileUnsaved": "Close {name} without saving?",
  "app.App.closeOtherTabsUnsaved": "Close other tabs with unsaved files?",
  "app.App.closeConversationUnsaved":
    "Close this conversation with unsaved files?",
  "app.App.closeAllTabsUnsaved": "Close all tabs with unsaved files?",
  "app.App.closeAllFilesUnsaved": "Close all open files with unsaved changes?",
  "app.App.monoConversationMissing":
    "This Mono's conversation is no longer available.",
  "app.App.conversationResetting": "This conversation is already being reset.",
  "app.App.archiveConversationUnsaved":
    "Archive this conversation with unsaved files?",
  "app.App.deleteConversationUnsaved":
    "Delete this conversation with unsaved files?",
  "app.App.sessionDeletedWorktreeKept":
    "The session was deleted. Its worktree was kept.\n\n{error}\n\nYou can manage it in Settings → Worktrees.",
  "app.App.unarchiveFailed":
    "Could not unarchive this conversation.\n\n{error}",
  "app.App.sessionMissing": "This session is no longer available.",
  "app.App.conversationMissing": "This conversation is no longer available.",
  "app.App.reminderNeedsMessage":
    "Send a message in this conversation before setting a reminder.",
  "app.App.worktreeDeleting": "This worktree is already being deleted.",
  "app.App.worktreeSelecting":
    "A session is selecting this worktree. Try deleting it again once selection finishes.",
  "app.App.worktreeMissing": "This worktree is no longer available.",
  "app.App.worktreeSessionsFirst":
    "Move or delete the sessions using this worktree first.",
  "app.App.worktreeSessionsBusy":
    "Wait for these sessions to finish changing before deleting the worktree.",
  "app.App.thisSessionFallback": "this session",
  "app.App.archiveFailed": "Could not archive this conversation.\n\n{error}",
  "app.App.deleteFailed": "Could not delete this conversation.\n\n{error}",
  "app.App.workingCopyWaitSession":
    "Wait for this session to finish before changing working copies.",
  "app.App.workingCopyDeleting":
    "This worktree is being deleted. Select another working copy.",
  "app.App.workingCopyQueued":
    "Clear queued messages before changing working copies.",
  "app.App.workingCopyOrchestration":
    "Stop this orchestration run before changing working copies.",
  "app.App.workingCopyMissing":
    "This worktree is no longer available. Refresh the picker.",
  "app.App.workingCopyChanged":
    "The session changed. Try selecting the working copy again.",
  "app.App.deleteMonoConfirm":
    "Delete {name}? Its conversation will be deleted and its habits stop. This can’t be undone.",
  "app.App.deleteSelectedConversations":
    "Delete {count} selected conversations? This can’t be undone.",
  "app.App.removedProviderAccount":
    "This conversation uses a removed provider account. Switch accounts from the usage control to start a new conversation.",
  "app.App.operatorOutsideRun":
    "Use /operator from a regular session turn, outside an orchestration run.",
  "app.App.operatorQueued":
    "/operator starts a new turn after the current turn finishes.",
  "app.App.harnessNoFollowUp":
    "{harness} cannot take a follow-up mid-turn — wait for this turn to finish, or stop it first.",
  "app.App.harnessSteerFailed": "{harness} could not steer the active turn",
  "app.App.chatUnavailableBeforeSend":
    "The chat became unavailable before the request could start. Try again when it is ready.",
  "app.App.projectFolderOpenFailed": "The project folder could not be opened.",
  "app.App.harnessNotConnectedYet":
    "{harness} is not connected yet — install and sign in to that provider, then retry.",
  "app.App.harnessNotConnected": "Harness is not connected",
  "app.App.turnNotCompleted": "Turn did not complete",
  "app.App.sessionUnavailableRunning":
    "Session is unavailable or already running",
  "app.App.proposalStopRunFirst":
    "Stop the current orchestration run before preparing another proposal.",
  "app.App.leadRepairFailed": "The lead could not repair the proposal.",
  "app.App.leadPlanningFailed": "The lead could not finish planning.",
  "app.App.adapterFailed": "{harness} adapter failed",
  "app.App.habitRunStartFailed": "The habit's run could not start.",
  "app.App.selectedSessionRunFailed":
    "The selected agent session could not start this run.",
  "app.App.monitoredSessionStartFailed":
    "The monitored session could not start.",
  "app.App.deliveryUnavailable":
    "Delivery is unavailable. Retry when the agent is ready.",
  "app.App.orchestrationPlanningQueued":
    "Orchestration planning will start after the current turn finishes.",
  "app.App.accountHandoffFallback":
    "Could not carry the conversation to the other account; continuing from a handoff",
  "app.App.projectCwdRequired":
    "A project working directory is required for this question.",
  "app.App.codexModelUnavailable": "The selected Codex model is unavailable.",
  "app.App.completedTurnMissing": "The completed turn is no longer available.",
  "app.App.sideAnswerEmpty": "{harness} returned an empty side answer.",
  "app.App.sideAnswerFailed": "{harness} could not answer this side question.",
  "app.App.compactUnsupported":
    "{harness} does not support manual context compaction.",
  "app.App.compactingContext": "Compacting context…",
  "app.App.compactedContext": "Compacted context",
  "app.App.compactFailed": "{harness} could not compact this context",
  "app.App.leadSessionMissing": "Lead session is unavailable",
  "app.App.workerWorktreeMissing":
    "This worker's retained worktree is missing. Its saved changes cannot be retried automatically.",
  "app.App.workerConfigChanged":
    "This worker's configuration changed. Restore its approved harness, model and project before retrying.",
  "app.App.workerModelMismatch":
    "The saved worker no longer matches its approved model. Create a new assignment.",
  "app.App.workerCheckoutMissing":
    "This worker's isolated checkout is unavailable",
  "app.App.workerCheckoutUnregistered":
    "The worker or lead checkout is no longer registered. The worker worktree was kept.",
  "app.App.workerBranchMovedRunning":
    "The worker or lead branch moved while this task was running. The worker worktree was kept for manual review.",
  "app.App.workerBranchMovedCleanup":
    "The worker or lead branch moved before cleanup. The worker worktree was kept for manual review.",
  "app.App.proposalConfirmWait":
    "Wait for the proposal to finish before confirming.",
  "app.App.leadModelChanged":
    "The lead model has changed. Switch back to the model shown on this card, or generate a new proposal.",
  "app.App.prChooseProject": "Choose a local project for this PR first.",
  "app.App.prChooseChat": "Choose a chat from this project.",
  "app.App.prChatBusy":
    "This chat is busy. Choose another chat or start a new one.",
  "app.App.projectToolsLabel": "Project tools",
  "app.App.resizeRightSidebarLabel": "Resize right sidebar",
  "app.App.githubLinkFailed":
    "Could not update this conversation's GitHub link.\n\n{error}",
} as const;
