import type { worktrees } from "../en/worktrees";

export const worktreesZh: Record<keyof typeof worktrees, string> = {
  "settings.worktrees.createButton": "创建工作树",
  "settings.worktrees.scopeNote":
    "多个会话可以共用同一工作树。删除工作树时默认保留其会话，但会丢弃未提交的更改。其分支和提交会被保留。",
  "settings.worktrees.refreshFailed": "刷新失败：{error}。点击重试。",
  "settings.worktrees.refreshLabel": "刷新工作树",
  "settings.worktrees.refreshButton": "刷新",
  "settings.worktrees.noProject": "添加项目以管理其工作树。",
  "settings.worktrees.loading": "正在加载工作树…",
  "settings.worktrees.emptyTitle": "没有其他工作树",
  "settings.worktrees.emptyHint":
    "创建工作树，即可在单独的文件夹中处理其他分支。",
  "settings.worktrees.selectedFolder": "当前选中的项目文件夹",
  "settings.worktrees.currentBranch": "当前分支：{branch}",
  "settings.worktrees.detachedAt": "分离 HEAD 位于 {head}",
  "settings.worktrees.sessionCount.one": "此工作树中有 {count} 个会话",
  "settings.worktrees.sessionCount.other": "此工作树中有 {count} 个会话",
  "settings.worktrees.missingFolder": "文件夹缺失",
  "settings.worktrees.statusUnavailable": "状态不可用",
  "settings.worktrees.uncommitted": "有未提交的更改",
  "settings.worktrees.clean": "无未提交更改",
  "settings.worktrees.unpublishedCommits.one": "{count} 个未发布的提交",
  "settings.worktrees.unpublishedCommits.other": "{count} 个未发布的提交",
  "settings.worktrees.locked": "已锁定",
  "settings.worktrees.revealLabel": "在文件夹中显示 {name}",
  "settings.worktrees.fallbackName": "工作树",
  "settings.worktrees.revealTitle": "在文件夹中显示",
  "settings.worktrees.deleteLabel": "删除 {name}",
  "settings.worktrees.deleteTitle": "删除工作树",
  "settings.worktrees.blockedLocked": "请先在 Git 中解锁此工作树",
  "settings.worktrees.blockedDetached":
    "删除此分离 HEAD 工作树前，请先创建分支",
  "settings.worktrees.defaultRootNote": "新工作树将创建在 {path} 中。",
  "settings.worktrees.sessionsInUse": "仍有会话在使用此工作树，无法删除。",
  "settings.worktrees.sessionsNotDeleted":
    "部分会话无法删除，因此保留了此工作树。",
  "settings.worktrees.sessionsDeletedWorktreeKept":
    "会话已删除，但工作树已保留。{error}",
};
