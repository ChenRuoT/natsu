import type { monos } from "../en/monos";

export const monosZh: Record<keyof typeof monos, string> = {
  "settings.monos.title": "Monos",
  "settings.monos.showLabel": "显示 Mono",
  "settings.monos.showDescription":
    "属于你自己的 Agent，显示在项目栏中。每个 Mono 会处理你分配给它的项目，记住重要信息，并自行养成习惯。关闭此项即可隐藏它们。",
  "settings.monos.pinLabel": "将 Mono 固定到图标栏",
  "settings.monos.pinDescription":
    "当项目栏折叠为图标时，在栏顶部、分隔线上方显示每个 Mono，而不是放在项目选择器中。",
  "settings.monos.menuBarLabel": "菜单栏图标",
  "settings.monos.menuBarDescription":
    "从 macOS 菜单栏与 Mono 对话，或打开快速输入框。关闭此项即可隐藏图标。",
  "settings.monos.listTitle": "你的 Mono",
  "settings.monos.listDescription":
    "选择每个 Mono 启动的新会话是否显示在侧边栏中。隐藏的会话仍会保存，可从该 Mono 的对话中打开。在项目栏中点击加号即可添加 Mono，并在其详情中选择它负责的项目。",
  "settings.monos.noMonos": "还没有 Mono。",
  "settings.monos.worksOn": "负责处理 {projects}",
  "settings.monos.noProjects": "还没有项目",
  "settings.monos.sessionVisibilityHint": "在侧边栏中显示由 Mono 启动的会话",
  "settings.monos.sessionVisibilityLabel": "在侧边栏中显示 {name} 启动的会话",
  "settings.monos.resetLabel": "重置 Mono",
  "settings.monos.resetTitle": "将 {name} 重置为默认设置？",
  "settings.monos.resetBody":
    "其人格将恢复为默认设置，名称恢复为 {defaultName}。对其人格所做的更改无法恢复。",
  "settings.monos.resetKept": "其对话、项目、记忆和习惯任务将会保留。",
  "settings.monos.resetFailure": "无法重置 Mono。",
  "settings.monos.resetButtonTitle": "恢复默认设置",
  "settings.monos.resetButtonLabel": "将 {name} 恢复为默认设置",
};
