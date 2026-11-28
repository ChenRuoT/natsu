export const worktrees = {
  "settings.worktrees.createButton": "Create worktree",
  "settings.worktrees.scopeNote":
    "Sessions can share a worktree. Deleting one keeps its sessions by default and discards uncommitted changes. Its branch and commits are kept.",
  "settings.worktrees.refreshFailed":
    "Refresh failed: {error}. Click to retry.",
  "settings.worktrees.refreshLabel": "Refresh worktrees",
  "settings.worktrees.refreshButton": "Refresh",
  "settings.worktrees.noProject": "Add a project to manage its worktrees.",
  "settings.worktrees.loading": "Loading worktrees…",
  "settings.worktrees.emptyTitle": "No additional worktrees",
  "settings.worktrees.emptyHint":
    "Create a worktree to work on another branch in a separate folder.",
  "settings.worktrees.selectedFolder": "Selected project folder",
  "settings.worktrees.currentBranch": "Current branch: {branch}",
  "settings.worktrees.detachedAt": "Detached at {head}",
  "settings.worktrees.sessionCount.one": "{count} session in this worktree",
  "settings.worktrees.sessionCount.other": "{count} sessions in this worktree",
  "settings.worktrees.missingFolder": "Missing folder",
  "settings.worktrees.statusUnavailable": "Status unavailable",
  "settings.worktrees.uncommitted": "Uncommitted changes",
  "settings.worktrees.clean": "Clean",
  "settings.worktrees.unpublishedCommits.one": "{count} unpublished commit",
  "settings.worktrees.unpublishedCommits.other": "{count} unpublished commits",
  "settings.worktrees.locked": "Locked",
  "settings.worktrees.revealLabel": "Reveal {name}",
  "settings.worktrees.fallbackName": "worktree",
  "settings.worktrees.revealTitle": "Reveal folder",
  "settings.worktrees.deleteLabel": "Delete {name}",
  "settings.worktrees.deleteTitle": "Delete worktree",
  "settings.worktrees.blockedLocked": "Unlock this worktree in Git first",
  "settings.worktrees.blockedDetached":
    "Create a branch before deleting this detached worktree",
  "settings.worktrees.defaultRootNote": "New worktrees are created in {path}.",
  "settings.worktrees.sessionsInUse":
    "Sessions still use this worktree and could not be deleted.",
  "settings.worktrees.sessionsNotDeleted":
    "Some sessions could not be deleted, so the worktree was kept.",
  "settings.worktrees.sessionsDeletedWorktreeKept":
    "The sessions were deleted, but the worktree was kept. {error}",
} as const;
