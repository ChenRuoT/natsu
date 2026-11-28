import type { chat } from "../en/chat";

export const chatZh: Record<keyof typeof chat, string> = {
  "settings.chat.transcriptGroup.title": "对话记录",
  "settings.chat.transcriptGroup.description": "对话如何随内容增长而呈现。",
  "settings.chat.transcriptLayout.label": "对话记录布局",
  "settings.chat.transcriptLayout.description":
    "全宽模式会将用户提示词显示为横跨整行的卡片。聊天模式会将其右对齐并限制最大宽度，类似即时通讯应用。",
  "settings.chat.transcriptLayout.full": "全宽",
  "settings.chat.transcriptLayout.chat": "聊天",
  "settings.chat.anchorPrompts.label": "提示词固定在顶部",
  "settings.chat.anchorPrompts.description":
    "发送时，新提示词会显示在对话记录顶部，回复会在下方空间中逐渐展开。关闭此项可保留经典布局，最新消息停留在输入框上方。",
  "settings.chat.smoothReveal.label": "平滑显示文本",
  "settings.chat.smoothReveal.description":
    "逐步显示接收到的文本突发内容。关闭后将立即显示接收到的文本。这只改变呈现时序，不影响处理速度。",
  "settings.chat.composerGroup.title": "输入框",
  "settings.chat.composerGroup.description": "输入框如何处理你输入的内容。",
  "settings.chat.followUp.label": "后续消息行为",
  "settings.chat.followUp.description":
    "将后续消息排队，直到当前回合结束，或立即向当前回合插话。",
  "settings.chat.followUp.queue": "排队",
  "settings.chat.followUp.steer": "插话",
  "settings.chat.modelControls.label": "模型控件",
  "settings.chat.modelControls.description":
    "在模型选择器旁显示模型选项，而不是放在模型菜单内。",
  "settings.chat.modelControls.menu": "菜单",
  "settings.chat.modelControls.beside": "并排",
  "settings.chat.autocorrect.label": "自动更正",
  "settings.chat.autocorrect.description":
    "在会话和 Mono 输入框中检查提示词拼写并自动更正。关闭后，文本将保持你的原样输入。",
  "settings.chat.editorGroup.title": "编辑器",
  "settings.chat.editorGroup.description":
    "在工作区编辑器中保存文件时会发生什么。",
  "settings.chat.formatOnSave.label": "保存时格式化",
  "settings.chat.formatOnSave.description":
    "写入前对支持的文件运行 Prettier。关闭后将保留你输入的文本，包括引号风格。",
  "settings.chat.reviewGroup.title": "代码审阅",
  "settings.chat.reviewGroup.description": "阅读回合更改时，更改在何处打开。",
  "settings.chat.diffView.label": "差异视图",
  "settings.chat.diffView.description":
    "编辑器会在文件中保留工作树更改。统一视图会在一次审阅中堆叠所有已更改的文件，并带有固定标题和折叠的未更改行。",
  "settings.chat.diffView.editor": "编辑器",
  "settings.chat.diffView.unified": "统一",
  "settings.chat.extrasGroup.title": "附加功能",
  "settings.chat.extrasGroup.description":
    "仅包含空闲动画。两项都关闭即可获得静止的工作区。",
  "settings.chat.mascot.label": "输入框吉祥物",
  "settings.chat.mascot.description":
    "回合运行时，项目吉祥物会沿输入框奔跑；第一次会撞击“滚动到最新”按钮，然后跳过它，有时还会抓取一枚金币。",
  "settings.chat.emptyGames.label": "空会话小游戏",
  "settings.chat.emptyGames.description":
    "空会话网格中会空闲地运行吃豆人和贪吃蛇。将鼠标悬停在该区域上即可接管当前显示的游戏。关闭此项可让窗格保持静止。",
};
