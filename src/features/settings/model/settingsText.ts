import type { SettingsGroupId, SettingsSectionId } from "./settings";

/** Simplified Chinese text for the Settings rail, page headers and search. English stays inline in settings.ts. */
export const SETTINGS_TEXT_ZH: {
  groups: Record<SettingsGroupId, string>;
  sections: Record<
    SettingsSectionId,
    { label: string; description: string; keywords: string }
  >;
  /** Keyed by SETTINGS_INDEX `id`. */
  entries: Record<string, { label: string; keywords: string }>;
} = {
  groups: {
    app: "应用",
    agents: "Agents",
    workspace: "工作区",
  },
  sections: {
    general: {
      label: "通用",
      description: "当前运行的构建版本、Natsu 如何通知你，以及显示哪些面板。",
      keywords: "版本 更新 升级 声音 提示音 通知 笔记 图标栏",
    },
    connections: {
      label: "连接",
      description: "在其他机器上运行 Agent，并将手机与此桌面端配对。",
      keywords: "远程 远程主机 机器 服务器 SSH 手机 配对 扫码",
    },
    appearance: {
      label: "外观",
      description: "主题、色调、透明度、工作区布局和对话背景。",
      keywords: "主题 深色 浅色 颜色 强调色 透明 模糊 缩放 语言 壁纸 布局",
    },
    keybindings: {
      label: "快捷键",
      description: "工作区处理的每一个快捷键，来自应用菜单和按键处理程序。",
      keywords: "快捷键 键盘 热键 按键 绑定 shortcut",
    },
    chat: {
      label: "对话",
      description:
        "对话记录的呈现方式、输入框对后续消息的处理、文件保存方式以及差异的打开方式。",
      keywords: "聊天 消息 输入框 提示词 差异 保存 编辑器 格式化",
    },
    providers: {
      label: "提供方",
      description:
        "提供方账号、Natsu 可驱动的 Agent CLI，以及新会话默认使用的模型。",
      keywords: "账号 登录 模型 命令行 默认 钩子 用量 Claude Codex",
    },
    mcp: {
      label: "MCP",
      description: "跨提供方查找 MCP 服务器并管理其连接。",
      keywords: "工具 服务器 连接 授权 登录 认证 OAuth",
    },
    skills: {
      label: "Skills",
      description: "从项目、个人和运行环境文件夹中发现并管理文件 Skill。",
      keywords: "Skill 指令 提示词 文件夹 导入",
    },
    monos: {
      label: "Mono",
      description: "显示在标签页旁的常驻 Agent，以及哪些项目拥有它。",
      keywords: "Mono 常驻 Agent 吉祥物 项目 标题栏",
    },
    inbox: {
      label: "收件箱",
      description: "管理收件箱服务，以及每个项目的通知偏好。",
      keywords: "集成 通知 连接 令牌 GitHub GitLab Jira Linear",
    },
    archive: {
      label: "归档",
      description: "你已归档的项目和对话。",
      keywords: "已归档 恢复 删除 隐藏",
    },
    worktrees: {
      label: "工作树",
      description: "管理每个项目的额外工作树。",
      keywords: "分支 副本 目录 创建 删除 git",
    },
  },
  entries: {
    "mobile-access": {
      label: "你的手机",
      keywords: "手机 iPhone 扫码 配对 设备 路由",
    },
    "remote-machines": {
      label: "你的远程主机",
      keywords: "SSH 远程 连接 主机 服务器 环境",
    },
    "mcp-servers": {
      label: "MCP 服务器",
      keywords: "工具 连接 授权 登录 添加 移除",
    },
    "monos-enabled": {
      label: "显示 Mono",
      keywords: "Mono Agent 图标栏 隐藏",
    },
    "rail-monos-pinned": {
      label: "将 Mono 固定到图标栏",
      keywords: "Mono 图标栏 紧凑 折叠 项目 分隔线",
    },
    "mono-list": {
      label: "你的 Mono",
      keywords: "Mono 重置 名称 项目 会话 可见性 隐藏 显示",
    },
    "project-worktrees": {
      label: "项目工作树",
      keywords: "Git 分支 副本 创建 删除 管理",
    },
    update: {
      label: "版本",
      keywords: "更新 升级 发布 新功能 构建 更新日志",
    },
    sounds: {
      label: "声音",
      keywords: "提示音 音效 音量 静音 音频",
    },
    notifications: {
      label: "通知",
      keywords: "提醒 警报 权限 横幅 后台 推送",
    },
    notes: {
      label: "笔记",
      keywords: "便签 记事本 Markdown 草稿 图标栏",
    },
    "quick-composer": {
      label: "快速输入框",
      keywords: "聚焦 全局 快捷键 悬浮 提示词 随处",
    },
    "working-agents": {
      label: "运行中的 Agent",
      keywords: "实时 会话 图标栏 卡片 运行",
    },
    "file-tabs": {
      label: "文件标签页",
      keywords: "编辑器 打开 顶部 工作区 面板 并排 聊天",
    },
    "tab-animations": {
      label: "标签页动画",
      keywords: "动效 打开 关闭 调整大小 过渡",
    },
    "close-to-tray": {
      label: "关闭时最小化到托盘",
      keywords: "后台 退出 窗口 任务栏 Windows",
    },
    language: {
      label: "语言",
      keywords: "locale 翻译 中文 简体 英语 国际化",
    },
    theme: {
      label: "主题",
      keywords: "深色 浅色 系统 外观 模式",
    },
    "workspace-theme": {
      label: "工作区主题",
      keywords: "颜色 配色 调色板 预设 方案 harbor moss ember orchid",
    },
    "accent-color": {
      label: "强调色",
      keywords: "高亮 气泡 发送按钮 色调 颜色",
    },
    "diff-colors": {
      label: "差异颜色",
      keywords: "色盲 无障碍 增加 删除 红色 绿色 高对比度",
    },
    hue: {
      label: "色相",
      keywords: "色调 颜色 界面 着色",
    },
    saturation: {
      label: "饱和度",
      keywords: "色调 颜色 中性 灰色 灰度",
    },
    "dark-lightness": {
      label: "深色模式亮度",
      keywords: "黑色 亮度 对比度 背景 暗色",
    },
    "inset-glass": {
      label: "透明窗口",
      keywords: "玻璃 半透明 透明度 不透明 桌面 模糊 布局",
    },
    "sidebar-opacity": {
      label: "侧边栏不透明度",
      keywords: "玻璃 半透明 透明度 通透",
    },
    blur: {
      label: "模糊半径",
      keywords: "玻璃 半透明 背景模糊 毛玻璃",
    },
    "main-pane-glass": {
      label: "主窗格玻璃效果",
      keywords: "半透明 透明度 主体 窗口 毛玻璃",
    },
    "inset-layout": {
      label: "布局",
      keywords: "经典 聚焦 预览 侧边栏 导航 卡片 圆角 悬浮",
    },
    "interface-scale": {
      label: "界面缩放",
      keywords: "缩放 字体大小 放大 缩小 UI",
    },
    "collapsed-project-rail": {
      label: "折叠的项目栏",
      keywords: "侧边栏 紧凑 图标 隐藏 导航 布局",
    },
    "show-excluded-files": {
      label: "显示已排除的文件",
      keywords: "资源管理器 gitignore 忽略 隐藏 文件树",
    },
    "chat-background": {
      label: "对话背景",
      keywords: "壁纸 图片 不透明度 背景",
    },
    "transcript-layout": {
      label: "对话记录布局",
      keywords: "全宽 聊天 气泡 消息",
    },
    "anchor-prompts": {
      label: "将提示词固定到顶部",
      keywords: "滚动 位置 粘性 消息",
    },
    "paced-reveal": {
      label: "平滑文本显示",
      keywords: "流式 节奏 即时 延迟 性能 动画",
    },
    "follow-up": {
      label: "后续消息行为",
      keywords: "队列 插话 引导 打断 运行时发送 排队",
    },
    "model-controls": {
      label: "模型控制",
      keywords: "推理 思考 强度 快速 服务层级 模型选择器 输入框",
    },
    "composer-autocorrect": {
      label: "自动更正",
      keywords: "拼写 检查 错别字 macOS 输入框",
    },
    "composer-mascot": {
      label: "输入框吉祥物",
      keywords: "跑步 动画 金币 趣味",
    },
    "format-on-save": {
      label: "保存时格式化",
      keywords: "Prettier 引号 编辑器 保存 格式",
    },
    "diff-view": {
      label: "差异视图",
      keywords: "统一 编辑器 审阅 更改 工作树",
    },
    "empty-session-games": {
      label: "空会话小游戏",
      keywords: "贪吃蛇 吃豆人 街机 网格 趣味",
    },
    "agent-clis": {
      label: "Agent CLI",
      keywords: "命令行 路径 二进制 可执行文件 Codex",
    },
    "provider-accounts": {
      label: "提供方账号",
      keywords: "账号 登录 重命名 删除 凭据 用量 额度",
    },
    "show-remaining-usage": {
      label: "显示剩余用量",
      keywords: "额度 限额 进度条 百分比 已用",
    },
    "mask-emails": {
      label: "隐藏账号邮箱",
      keywords: "邮箱 隐私 模糊 截图 账号",
    },
    "claude-hooks": {
      label: "Claude Code 钩子",
      keywords: "设置 settings.json 拦截 命令 通知",
    },
    "idle-agents": {
      label: "保持空闲 Agent 就绪",
      keywords: "内存 CPU 性能 进程 预热 后台",
    },
    "project-notifications": {
      label: "项目通知",
      keywords: "静音 恢复 声音 横幅 提醒 分类",
    },
    github: {
      label: "GitHub",
      keywords: "gh 命令行 连接 拉取请求 登录",
    },
    gitlab: {
      label: "GitLab",
      keywords: "令牌 自托管 合并请求 连接",
    },
    azuredevops: {
      label: "ADO",
      keywords: "Azure DevOps 看板 仓库 拉取请求 连接",
    },
    jira: {
      label: "Jira",
      keywords: "Atlassian 云 站点 邮箱 令牌 议题 项目",
    },
    linear: {
      label: "Linear",
      keywords: "API 密钥 议题 团队 连接",
    },
    "show-archived": {
      label: "在侧边栏中显示已归档",
      keywords: "隐藏 对话 列表",
    },
  },
};
