import type { general } from "../en/general";

export const generalZh: Record<keyof typeof general, string> = {
  "settings.general.breadcrumbRoot": "设置",
  "settings.general.restoreDefaults": "恢复默认设置",
  "settings.general.regionLabel": "设置",
  "settings.search.placeholder": "搜索设置",
  "settings.search.inputLabel": "搜索设置",
  "settings.search.clear": "清除设置搜索",
  "settings.search.resultsLabel": "设置搜索结果",
  "settings.search.empty": "没有匹配的设置",
  "settings.search.pageLabel": "页面",
  "settings.general.alertsTitle": "提醒",
  "settings.general.alertsDescription": "Natsu 如何在你查看其他内容时通知你。",
  "settings.general.soundsLabel": "声音",
  "settings.general.soundsDescription":
    "项目活动、已完成的回合和可用更新会播放简短提示音。可在收件箱设置中选择项目通知类别。开关和已完成回合中的“复制”操作也会播放提示音。",
  "settings.general.notificationsLabel": "通知",
  "settings.general.notificationsDescription":
    "当提醒到期，或 Agent 在其他会话中完成任务或需要输入，或 Natsu 位于后台时发送通知。点击通知即可打开对应会话。",
  "settings.general.notificationsUnsupported": "此平台不支持",
  "settings.general.workspaceTitle": "工作区",
  "settings.general.workspaceDescription": "项目导航和工作区标签页的行为方式。",
  "settings.general.fileTabsLabel": "文件标签页",
  "settings.general.fileTabsDescription":
    "在当前对话旁打开文件，或让每个文件在顶部栏中拥有普通标签页。顶部栏中的文件仍可合并到分屏窗格中。",
  "settings.general.fileTabsPane": "对话旁",
  "settings.general.fileTabsWorkspace": "顶部栏",
  "settings.general.tabAnimationsLabel": "标签页动画",
  "settings.general.tabAnimationsDescription":
    "标签页打开和关闭时显示动画。关闭后，标签页切换将立即完成。",
  "settings.general.notesLabel": "笔记",
  "settings.general.notesDescription":
    "项目栏上的全局 Markdown 笔记本。可以从对话记录中保存已完成的回合，之后使用 @note 提及它，或将其添加到对话中。",
  "settings.general.quickComposerLabel": "快速输入框",
  "settings.general.quickComposerDescription":
    "在任意应用中按下 {shortcut}，即可在其上方浮出提示词输入框，无需切换到 Natsu 即可开始会话。可在快捷键设置中更改快捷键。Return 会在后台开始会话；⌘Return 会开始会话并将其切换到前台。",
  "settings.general.workingAgentsLabel": "运行中的 Agent",
  "settings.general.workingAgentsDescription":
    "当两个或更多对话同时进行时，项目栏上的卡片会列出它们，方便你在项目之间切换。已完成的回合会一直保留，直到你打开该会话。",
  "settings.general.closeToTrayLabel": "关闭时最小化到托盘",
  "settings.general.closeToTrayDescription":
    "关闭窗口时，它会隐藏到系统托盘而不是退出，运行中的 Agent 会继续工作。可从托盘图标重新打开，并通过其菜单真正退出。关闭此选项后，关闭操作将直接结束窗口。",
  "settings.general.aboutTitle": "关于",
  "settings.general.version": "版本",
  "settings.general.updateAvailable": "版本 {version} 可用。",
  "settings.general.updateDownloadingPercent": "正在下载 {percent}%",
  "settings.general.updateDownloading": "正在下载…",
  "settings.general.updateChecking": "正在检查更新…",
  "settings.general.updateCurrent": "你正在使用最新版本。",
  "settings.general.updateFailed": "检查更新失败。",
  "settings.general.updateSelfManaged": "Natsu 会从发布源自动更新。",
  "settings.general.whatsNew": "更新内容",
  "settings.general.updateDownload": "下载",
  "settings.general.updateCheck": "检查更新",
  "settings.general.updater.debHint":
    "从 {url} 下载一个 .deb 安装包，然后运行：sudo apt install ./Natsu_X.Y.Z_amd64.deb\n将文件名替换为你下载的文件名。",
  "settings.general.updater.rpmHint":
    "从 {url} 下载一个 .rpm 安装包，然后运行：sudo dnf install ./Natsu-X.Y.Z-1.x86_64.rpm\n将文件名替换为你下载的文件名。",
};
