import type { mobile } from "../en/mobile";

export const mobileZh: Record<keyof typeof mobile, string> = {
  "settings.mobile.title": "你的手机",
  "settings.mobile.betaBadge": "仅限受邀测试",
  "settings.mobile.intro":
    "在 Natsu 手机应用中查看项目和对话。手机会直接连接到此桌面端。",
  "settings.mobile.testFlight": "iPhone 版应用目前需要 TestFlight 邀请。",
  "settings.mobile.pairButton": "配对手机",
  "settings.mobile.reconnectNotice":
    "此桌面端当前未接受连接，因此你的手机无法连接。",
  "settings.mobile.reconnect": "重新连接",
  "settings.mobile.removeLabel": "移除 {name}",
  "settings.mobile.removeTitle": "移除手机…",
  "settings.mobile.paired": "已配对",
  "settings.mobile.confirmRemoveLabel": "确认移除 {name}",
  "settings.mobile.confirmRemoveTitle": "移除 {name}？",
  "settings.mobile.confirmRemoveBody":
    "该手机会立即断开连接。在使用新的配对码重新配对之前，它无法再访问此桌面端。",
  "settings.mobile.confirmRemoveButton": "移除手机",
  "settings.mobile.cancel": "取消",
  "settings.mobile.empty": "配对你的 iPhone 或 Android 手机即可开始使用。",
  "settings.mobile.remoteSummary": "在外出时连接",
  "settings.mobile.remoteIntro":
    "在同一 Wi-Fi 下，手机无需任何设置即可连接。若要从其他任何地方访问此桌面端，它需要一个公网地址。请保持桌面端处于唤醒状态。",
  "settings.mobile.openRouter": "自动打开路由器端口",
  "settings.mobile.remoteAddressLabel": "远程地址",
  "settings.mobile.remotePlaceholder": "公网主机名或 VPN IP，可选填 :端口",
  "settings.mobile.save": "保存",
  "settings.mobile.remoteHelp":
    "自动映射需要公网 IP。否则，请将 UDP 端口 38416 转发到此桌面端，或使用 VPN 地址。生成配对码前，请先设置地址。",
  "settings.mobile.pairedNotice": "{name} 已配对。",
  "settings.mobile.removedNotice": "{name} 已移除。",
  "settings.mobile.serviceUnavailable": "桌面端移动服务不可用",
  "settings.mobile.pairDialog.title": "配对手机",
  "settings.mobile.pairDialog.heading": "将手机连接到此桌面端",
  "settings.mobile.pairDialog.instructions":
    "在手机上打开 Natsu，点按 <action>连接到桌面端</action>，然后扫描配对码。",
  "settings.mobile.pairDialog.expired": "配对码已过期",
  "settings.mobile.pairDialog.expiresIn": "{time} 后过期",
  "settings.mobile.pairDialog.qrAlt": "请在 Natsu 手机应用中扫描此一次性配对码",
  "settings.mobile.pairDialog.newCode": "新配对码",
  "settings.mobile.pairDialog.copyLink": "复制配对链接",
  "settings.mobile.pairDialog.makeNewCode": "生成新配对码",
  "settings.mobile.pairDialog.fallback":
    "无法扫描？请复制链接并在手机上打开。每个配对码只能使用一次。",
};
