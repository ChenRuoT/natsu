import type { appearance } from "../en/appearance";

export const appearanceZh: Record<keyof typeof appearance, string> = {
  "settings.language.title": "语言",
  "settings.language.description": "选择 Natsu 界面使用的语言。",
  "settings.language.label": "界面语言",
  "settings.language.rowDescription":
    "切换后立即生效。尚未翻译的页面会保持英文。",

  "settings.theme.title": "主题",
  "settings.theme.descriptionInset": "每个工作区主题都有各自的深色与浅色配色。",
  "settings.theme.descriptionClassic":
    "深色与浅色共用同一色调，因此下方的颜色设置对两者都生效。",
  "settings.theme.description": "选择“跟随系统”时沿用操作系统的外观设置。",
  "settings.theme.system": "跟随系统",
  "settings.theme.dark": "深色",
  "settings.theme.light": "浅色",

  "settings.appearance.workspaceTheme.label": "工作区主题",
  "settings.appearance.workspaceTheme.description":
    "设置工作区外壳、卡片、文字和强调色。每个主题都有深色与浅色两套配色。",
  "settings.appearance.transparentWindow.label": "透明窗口",
  "settings.appearance.transparentWindow.descriptionLinux":
    "在 Linux 上窗口保持不透明。",
  "settings.appearance.transparentWindow.descriptionLightMode":
    "浅色模式下窗口保持不透明。你的深色模式选择会被保留。",
  "settings.appearance.transparentWindow.description":
    "透过窗口显示桌面。关闭后窗口保持不透明。",
  "settings.appearance.accentColor.label": "强调色",
  "settings.appearance.accentColor.description":
    "用于输入框的发送按钮和你的消息气泡。",
  "settings.appearance.accentColor.swatch.default": "默认",
  "settings.appearance.accentColor.swatch.blue": "蓝色",
  "settings.appearance.accentColor.swatch.violet": "紫色",
  "settings.appearance.accentColor.swatch.pink": "粉色",
  "settings.appearance.accentColor.swatch.red": "红色",
  "settings.appearance.accentColor.swatch.orange": "橙色",
  "settings.appearance.accentColor.swatch.green": "绿色",
  "settings.appearance.diffColors.label": "差异颜色",
  "settings.appearance.diffColors.description":
    "新增行和删除行的颜色。色盲模式和高对比度模式用蓝色和橙色代替绿色和红色；高对比度模式还会加强底色和文字的对比。",
  "settings.appearance.diffColors.default": "默认",
  "settings.appearance.diffColors.colorblind": "色盲友好",
  "settings.appearance.diffColors.highContrast": "高对比度",
  "settings.appearance.color.title": "颜色",
  "settings.appearance.color.description":
    "色相和饱和度会为所有界面表面着色。亮度只影响深色主题。",
  "settings.appearance.hue.label": "色相",
  "settings.appearance.hue.description": "强调色和着色表面的基础色相。",
  "settings.appearance.saturation.label": "饱和度",
  "settings.appearance.saturation.description":
    "色相为界面着色的强度。设为 0 时保持中性色。",
  "settings.appearance.darkLightness.label": "深色模式亮度",
  "settings.appearance.darkLightness.descriptionLightMode":
    "仅影响深色模式。你的深色模式数值会被保留。",
  "settings.appearance.darkLightness.description":
    "深色主题的基础亮度。数值越低越暗；设为 0 时为纯黑。",
  "settings.appearance.translucency.title": "半透明",
  "settings.appearance.translucency.descriptionLightMode":
    "浅色模式始终使用不透明窗口，因此这些选项不生效。你的深色模式数值会被保留。",
  "settings.appearance.translucency.description":
    "桌面透过 Natsu 显示的程度。数值越高，模糊的合成开销越大。",
  "settings.appearance.sidebarOpacity.label": "侧边栏不透明度",
  "settings.appearance.sidebarOpacity.description":
    "作用于项目栏和其他玻璃质感窗格。",
  "settings.appearance.blur.label": "模糊半径",
  "settings.appearance.blur.description": "窗口背后的背景模糊。",
  "settings.appearance.mainPaneGlass.label": "主窗格玻璃效果",
  "settings.appearance.mainPaneGlass.description":
    "将半透明效果扩展到会话和编辑器后方的主窗格。",
  "settings.appearance.layout.title": "布局",
  "settings.appearance.layout.label": "布局",
  "settings.appearance.layout.description":
    "经典布局将所有内容放在一个侧边栏中。专注布局增加了项目切换器、工作区标签页和右侧面板。",
  "settings.appearance.layout.classic": "经典",
  "settings.appearance.layout.focused": "专注",
  "settings.appearance.projectRail.label": "收起时的项目栏",
  "settings.appearance.projectRail.description":
    "将项目导航保留为紧凑的图标栏，或完全隐藏该栏。",
  "settings.appearance.projectRail.compact": "图标栏",
  "settings.appearance.projectRail.hidden": "隐藏",
  "settings.appearance.uiScale.label": "界面缩放",
  "settings.appearance.uiScale.description":
    "缩放整个界面。也可以使用 Ctrl+=、Ctrl+- 和 Ctrl+0（macOS 上为 Cmd）。",
  "settings.appearance.excludedFiles.label": "显示被排除的文件",
  "settings.appearance.excludedFiles.description":
    "在文件浏览器中显示 Git 排除的文件和文件夹，例如构建输出和依赖项。",
  "settings.appearance.chatBackground.title": "聊天背景",
  "settings.appearance.chatBackground.description":
    "聊天窗格后方的图片。它只保存在此设备上。",
  "settings.appearance.chatBackground.preview":
    "空聊天预览，背景强度 {percent}%",
  "settings.appearance.chatBackground.choose": "选择图片",
  "settings.appearance.chatBackground.change": "更换",
  "settings.appearance.chatBackground.remove": "移除",
  "settings.appearance.chatBackground.effect.label": "背景效果",
  "settings.appearance.chatBackground.scope.label": "显示范围",
  "settings.appearance.chatBackground.scope.description":
    "仅在空会话中显示，或在所有会话中显示。",
  "settings.appearance.chatBackground.scope.ariaLabel": "背景显示范围",
  "settings.appearance.chatBackground.scope.empty": "仅空会话",
  "settings.appearance.chatBackground.scope.all": "所有会话",
  "settings.appearance.chatBackground.emptyVisibility.label": "空聊天可见度",
  "settings.appearance.chatBackground.emptyVisibility.description":
    "聊天还没有消息时的背景强度。",
  "settings.appearance.chatBackground.emptyVisibility.sliderLabel":
    "空聊天背景可见度",
  "settings.appearance.chatBackground.sessionVisibility.label": "会话可见度",
  "settings.appearance.chatBackground.sessionVisibility.description":
    "会话有消息后的背景强度。",
  "settings.appearance.chatBackground.sessionVisibility.sliderLabel":
    "会话背景可见度",
  "settings.appearance.backgroundEffect.none.label": "无",
  "settings.appearance.backgroundEffect.none.description": "显示原始图片。",
  "settings.appearance.backgroundEffect.dither.label": "抖动",
  "settings.appearance.backgroundEffect.dither.description":
    "使用抖动配色重新绘制图片。",
  "settings.appearance.backgroundEffect.ascii.label": "ASCII",
  "settings.appearance.backgroundEffect.ascii.description":
    "用黑底上的彩色字符重新绘制图片。",
  "settings.appearance.backgroundEffect.halftone.label": "半色调",
  "settings.appearance.backgroundEffect.halftone.description":
    "用黑底上的彩色印刷网点重新绘制图片。",
  "settings.appearance.backgroundEffect.scanlines.label": "扫描线",
  "settings.appearance.backgroundEffect.scanlines.description":
    "添加明显的水平显示扫描线纹理。",
  "settings.appearance.backgroundEffect.gradientBlur.label": "雾化",
  "settings.appearance.backgroundEffect.gradientBlur.description":
    "将图片模糊并渐隐到下方的背景中。",
  "settings.appearance.workspaceTheme.name.harbor": "港湾",
  "settings.appearance.workspaceTheme.name.moss": "苔藓",
  "settings.appearance.workspaceTheme.name.ember": "余烬",
  "settings.appearance.workspaceTheme.name.orchid": "兰花",
  "settings.appearance.workspaceTheme.name.tidepool": "潮池",
  "settings.appearance.workspaceTheme.name.dune": "沙丘",
  "settings.appearance.workspaceTheme.name.rosewood": "紫檀",
  "settings.appearance.workspaceTheme.name.glacier": "冰川",
  "settings.appearance.workspaceTheme.name.arcade": "街机",
  "settings.appearance.workspaceTheme.name.ink": "墨迹",
};
