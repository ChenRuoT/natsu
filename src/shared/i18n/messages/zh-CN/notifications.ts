import type { notifications } from "../en/notifications";

export const notificationsZh: Record<keyof typeof notifications, string> = {
  "settings.notifications.saveFailed": "无法保存通知偏好设置，请重试。",
  "settings.notifications.sectionLabel": "项目通知",
  "settings.notifications.title": "项目通知",
  "settings.notifications.description":
    "按类别选择提示音、横幅和侧边栏指示器。静音会暂停这些通知，但不会改变已有选择。未读项目会在收件箱中保持标记。",
  "settings.notifications.done": "完成",
  "settings.notifications.selectProjects": "选择项目",
  "settings.notifications.emptyHint":
    "打开项目或连接收件箱提供方，即可配置其通知。",
  "settings.notifications.selectAll": "选择所有项目",
  "settings.notifications.selectedCount": "已选择 {count} 个",
  "settings.notifications.muteSelectedGroup": "静音所选项目",
  "settings.notifications.selectProject": "选择 {name}",
  "settings.notifications.categoriesLabel": "{name} 的通知类别",
  "settings.notifications.localProject": "本地项目 · ",
  "settings.notifications.allPaused": "已暂停所有通知",
  "settings.notifications.allEnabled": "已启用所有类别",
  "settings.notifications.enabledCount": "已启用 {enabled} / {total}",
  "settings.notifications.mutedHint":
    "恢复通知后，类别选择将生效。静音期间仍可编辑这些选择。",
  "settings.notifications.categorySwitch": "{name} 的{category}",
  "settings.notifications.category.pullRequests": "拉取请求 / 合并请求",
  "settings.notifications.category.issues": "议题和 Linear 任务",
  "settings.notifications.category.agentFinished": "Agent 已完成",
  "settings.notifications.category.agentInput": "Agent 的审批和提问",
  "settings.notifications.category.reminders": "提醒",
};
