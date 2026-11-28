import type { archive } from "../en/archive";

export const archiveZh: Record<keyof typeof archive, string> = {
  "settings.archive.projectsTitle": "已归档项目",
  "settings.archive.projectsDescription":
    "从项目栏归档项目后，其会话会保留，但不再显示在侧边栏中。",
  "settings.archive.noProjects": "没有已归档的项目。",
  "settings.archive.restoreButton": "恢复",
  "settings.archive.deleteButton": "删除",
  "settings.archive.inProjectTitle": "{name} 中的已归档内容",
  "settings.archive.conversationsTitle": "已归档的会话",
  "settings.archive.showArchivedLabel": "在侧边栏中显示已归档内容",
  "settings.archive.showArchivedDescription":
    "让已归档的会话与活动会话一同显示在列表中。",
  "settings.archive.openProjectHint": "打开项目即可查看其中已归档的会话。",
  "settings.archive.noConversations": "此项目中没有已归档的会话。",
  "settings.archive.unarchiveButton": "取消归档",
};
