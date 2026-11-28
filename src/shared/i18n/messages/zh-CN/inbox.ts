import type { inbox } from "../en/inbox";

export const inboxZh: Record<keyof typeof inbox, string> = {
  "settings.inbox.github.description":
    "通过 GitHub CLI 读取拉取请求、评审和议题。",
  "settings.inbox.github.connection": "连接",
  "settings.inbox.github.connectedHelp":
    "GitHub CLI 已安装并完成身份验证。Natsu 会用它获取 GitHub 收件箱项目。",
  "settings.inbox.github.signInHelp":
    "在终端中运行 gh auth login，完成登录流程后再次检查。",
  "settings.inbox.github.installHelp":
    "从 cli.github.com 安装 GitHub CLI，在终端中运行 gh auth login，然后再次检查。",
  "settings.inbox.github.checking": "检查中",
  "settings.inbox.github.connected": "已连接",
  "settings.inbox.github.signInRequired": "需要登录",
  "settings.inbox.github.notInstalled": "未安装",
  "settings.inbox.github.installationGuide": "安装指南",
  "settings.inbox.github.checkAgain": "再次检查",

  "settings.inbox.gitlab.description":
    "来自 GitLab.com 或自托管实例的合并请求。",
  "settings.inbox.gitlab.connection": "连接",
  "settings.inbox.gitlab.connectionHelp":
    "连接 GitLab.com 或自托管的 GitLab 实例。请使用具有 API 访问权限的个人访问令牌；令牌会保存在本地，点击“断开连接”将删除它。",
  "settings.inbox.gitlab.disconnect": "断开连接",
  "settings.inbox.gitlab.urlLabel": "GitLab 地址",
  "settings.inbox.gitlab.tokenLabel": "GitLab 访问令牌",
  "settings.inbox.gitlab.saving": "保存中",
  "settings.inbox.gitlab.connect": "连接",

  "settings.inbox.azure.description":
    "来自你的 ADO 组织的拉取请求和 Boards 工作项。",
  "settings.inbox.azure.connection": "连接",
  "settings.inbox.azure.connectionHelp":
    "使用个人访问令牌连接你的 ADO 组织（评论需要 Boards 和 Repos 的读写权限）。令牌会保存在本地，点击“断开连接”将删除它。",
  "settings.inbox.azure.disconnect": "断开连接",
  "settings.inbox.azure.orgUrlLabel": "Azure DevOps 组织地址",
  "settings.inbox.azure.tokenLabel": "Azure DevOps 个人访问令牌",
  "settings.inbox.azure.saving": "保存中",
  "settings.inbox.azure.connect": "连接",

  "settings.inbox.jira.description": "来自你所选项目的 Jira Cloud 议题。",
  "settings.inbox.jira.checking": "正在检查 Jira 连接…",
  "settings.inbox.jira.connectHelp":
    "使用你的 Atlassian 邮箱和不含权限范围的 API 令牌连接 Jira Cloud 站点。断开连接会删除已保存的凭据。",
  "settings.inbox.jira.siteLabel": "Jira 站点",
  "settings.inbox.jira.emailLabel": "Atlassian 邮箱",
  "settings.inbox.jira.tokenLabel": "Jira API 令牌",
  "settings.inbox.jira.tokenPlaceholder": "API 令牌",
  "settings.inbox.jira.createToken": "创建 API 令牌",
  "settings.inbox.jira.disconnecting": "断开连接中",
  "settings.inbox.jira.disconnect": "断开连接",
  "settings.inbox.jira.connecting": "连接中",
  "settings.inbox.jira.connect": "连接",
  "settings.inbox.jira.projects": "项目",
  "settings.inbox.jira.refreshProjects": "刷新项目",
  "settings.inbox.jira.projectsHelp": "未勾选的项目将不会显示在收件箱中。",

  "settings.inbox.linear.description": "分配给你的议题，来自你所选的团队。",
  "settings.inbox.linear.apiKey": "API 密钥",
  "settings.inbox.linear.apiKeyHelp":
    "在 Linear → Settings → Security & Access 中创建个人 API 密钥。点击“断开连接”将删除它。",
  "settings.inbox.linear.apiKeyLabel": "Linear API 密钥",
  "settings.inbox.linear.disconnect": "断开连接",
  "settings.inbox.linear.saving": "保存中",
  "settings.inbox.linear.connect": "连接",
  "settings.inbox.linear.teams": "团队",
  "settings.inbox.linear.teamsHelp": "未勾选的团队将不会显示在收件箱中。",
};
