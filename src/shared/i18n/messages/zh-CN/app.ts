import type { app } from "../en/app";

export const appZh: Record<keyof typeof app, string> = {
  "app.App.whatsNewUnavailable": "此版本在当前构建中没有更新说明。",
  "app.App.closeTabUnsaved": "此标签页中有未保存的文件，仍要关闭吗？",
  "app.App.closeTabsUnsaved": "这些标签页中有未保存的文件，仍要关闭吗？",
  "app.App.closeFileUnsaved": "不保存并关闭 {name} 吗？",
  "app.App.closeOtherTabsUnsaved": "其他标签页中有未保存的文件，仍要关闭吗？",
  "app.App.closeConversationUnsaved": "此会话中有未保存的文件，仍要关闭吗？",
  "app.App.closeAllTabsUnsaved": "所有标签页中有未保存的文件，仍要关闭吗？",
  "app.App.closeAllFilesUnsaved":
    "所有打开的文件中有未保存的更改，仍要关闭吗？",
  "app.App.monoConversationMissing": "此 Mono 的会话已不可用。",
  "app.App.conversationResetting": "此会话正在重置中。",
  "app.App.archiveConversationUnsaved": "此会话中有未保存的文件，仍要归档吗？",
  "app.App.deleteConversationUnsaved": "此会话中有未保存的文件，仍要删除吗？",
  "app.App.sessionDeletedWorktreeKept":
    "会话已删除，但工作树已保留。\n\n{error}\n\n可在 设置 → 工作树 中管理。",
  "app.App.unarchiveFailed": "无法取消归档此会话。\n\n{error}",
  "app.App.sessionMissing": "此会话已不可用。",
  "app.App.conversationMissing": "此会话已不可用。",
  "app.App.reminderNeedsMessage": "设置提醒前，请先在此会话中发送一条消息。",
  "app.App.worktreeDeleting": "此工作树正在删除中。",
  "app.App.worktreeSelecting": "有会话正在选择此工作树，请等待选择完成后再试。",
  "app.App.worktreeMissing": "此工作树已不可用。",
  "app.App.worktreeSessionsFirst": "请先移动或删除正在使用此工作树的会话。",
  "app.App.worktreeSessionsBusy": "删除工作树前，请等待这些会话完成更改。",
  "app.App.thisSessionFallback": "此会话",
  "app.App.archiveFailed": "无法归档此会话。\n\n{error}",
  "app.App.deleteFailed": "无法删除此会话。\n\n{error}",
  "app.App.workingCopyWaitSession": "请等待此会话完成后再切换工作副本。",
  "app.App.workingCopyDeleting": "此工作树正在删除，请选择其他工作副本。",
  "app.App.workingCopyQueued": "切换工作副本前，请先清空排队的消息。",
  "app.App.workingCopyOrchestration": "切换工作副本前，请先停止此编排运行。",
  "app.App.workingCopyMissing": "此工作树已不可用，请刷新选择器。",
  "app.App.workingCopyChanged": "会话已更改，请重新选择工作副本。",
  "app.App.deleteMonoConfirm":
    "删除 {name}？其会话将被删除，其习惯也将停止。此操作无法撤销。",
  "app.App.deleteSelectedConversations":
    "删除所选的 {count} 个会话？此操作无法撤销。",
  "app.App.removedProviderAccount":
    "此会话使用的提供方账号已被移除。请在用量控件中切换账号，以开始新会话。",
  "app.App.operatorOutsideRun":
    "请在普通会话回合中使用 /operator，且不要处于编排运行中。",
  "app.App.operatorQueued": "/operator 将在当前回合结束后开始新的回合。",
  "app.App.harnessNoFollowUp":
    "{harness} 无法在回合中途接收后续消息，请等待此回合结束，或先停止它。",
  "app.App.harnessSteerFailed": "{harness} 无法对当前回合插话",
  "app.App.chatUnavailableBeforeSend":
    "请求开始前会话已不可用。请在会话就绪后重试。",
  "app.App.projectFolderOpenFailed": "无法打开项目文件夹。",
  "app.App.harnessNotConnectedYet":
    "{harness} 尚未连接，请安装并登录该提供方后重试。",
  "app.App.harnessNotConnected": "运行环境未连接",
  "app.App.turnNotCompleted": "回合未完成",
  "app.App.sessionUnavailableRunning": "会话不可用或已在运行",
  "app.App.proposalStopRunFirst": "准备另一个方案前，请先停止当前的编排运行。",
  "app.App.leadRepairFailed": "主导方无法修复该方案。",
  "app.App.leadPlanningFailed": "主导方无法完成规划。",
  "app.App.adapterFailed": "{harness} 适配器失败",
  "app.App.habitRunStartFailed": "此习惯的运行无法启动。",
  "app.App.selectedSessionRunFailed": "所选 Agent 会话无法启动此次运行。",
  "app.App.monitoredSessionStartFailed": "被监控的会话无法启动。",
  "app.App.deliveryUnavailable": "投递不可用，请在 Agent 就绪后重试。",
  "app.App.orchestrationPlanningQueued": "编排规划将在当前回合结束后开始。",
  "app.App.accountHandoffFallback":
    "无法将会话转移到另一个账号，已改为通过交接继续",
  "app.App.projectCwdRequired": "此问题需要项目工作目录。",
  "app.App.codexModelUnavailable": "所选 Codex 模型不可用。",
  "app.App.completedTurnMissing": "已完成的回合已不可用。",
  "app.App.sideAnswerEmpty": "{harness} 返回了空的旁路回答。",
  "app.App.sideAnswerFailed": "{harness} 无法回答此侧边问题。",
  "app.App.compactUnsupported": "{harness} 不支持手动压缩上下文。",
  "app.App.compactingContext": "正在压缩上下文…",
  "app.App.compactedContext": "已压缩上下文",
  "app.App.compactFailed": "{harness} 无法压缩此上下文",
  "app.App.leadSessionMissing": "主导会话不可用",
  "app.App.workerWorktreeMissing":
    "此 Worker 保留的工作树缺失，其已保存的更改无法自动重试。",
  "app.App.workerConfigChanged":
    "此 Worker 的配置已更改，请先恢复其已批准的运行环境、模型和项目，再重试。",
  "app.App.workerModelMismatch":
    "已保存的 Worker 与其已批准的模型不再匹配，请新建分配。",
  "app.App.workerCheckoutMissing": "此 Worker 的隔离检出不可用",
  "app.App.workerCheckoutUnregistered":
    "Worker 或主导的检出已不再注册。已保留 Worker 的工作树。",
  "app.App.workerBranchMovedRunning":
    "任务运行期间，Worker 或主导的分支已移动。已保留 Worker 的工作树以供人工检查。",
  "app.App.workerBranchMovedCleanup":
    "清理前，Worker 或主导的分支已移动。已保留 Worker 的工作树以供人工检查。",
  "app.App.proposalConfirmWait": "请等待方案完成后再确认。",
  "app.App.leadModelChanged":
    "主导模型已更改。请切换回此卡片显示的模型，或生成新的方案。",
  "app.App.prChooseProject": "请先为此 PR 选择本地项目。",
  "app.App.prChooseChat": "请从此项目中选择一个对话。",
  "app.App.prChatBusy": "此对话正忙。请选择其他对话或新建一个对话。",
  "app.App.projectToolsLabel": "项目工具",
  "app.App.resizeRightSidebarLabel": "调整右侧边栏大小",
  "app.App.githubLinkFailed": "无法更新此会话的 GitHub 链接。\n\n{error}",
};
