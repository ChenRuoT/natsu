import type { connections } from "../en/connections";

export const connectionsZh: Record<keyof typeof connections, string> = {
  "settings.connections.heading": "远程主机",
  "settings.connections.intro":
    "在另一台电脑上运行 Agent，并可随时从笔记本返回查看。关闭此处的 Natsu 后，主机会继续工作。",
  "settings.connections.addMachine": "添加远程主机",
  "settings.connections.emptyState":
    "添加一台始终在线的 Windows、Mac 或 Linux 远程主机即可开始使用。",
  "settings.connections.sshTarget": "SSH · {target}",
  "settings.connections.sshTargetPort": "SSH · {target} · 端口 {port}",
  "settings.connections.status.checking": "正在检查连接…",
  "settings.connections.status.connected": "已连接",
  "settings.connections.status.noProvider":
    "已连接 · 请在主机上安装受支持的提供方",
  "settings.connections.status.updateNeeded":
    "已连接 · 需要更新主机，才能使用资源管理器和更改",
  "settings.connections.status.offline": "已离线 · 请重新连接以检查访问权限",
  "settings.connections.updateNote":
    "更新会重启主机，并中断正在进行的 Agent 回合。",
  "settings.connections.updateHostTitle":
    "将下载匹配的主机安装包并重启主机；正在进行的 Agent 回合会被中断",
  "settings.connections.updateHost": "更新主机",
  "settings.connections.reconnect": "重新连接",
  "settings.connections.removeLabel": "移除 {name}",
  "settings.connections.removeTitle": "移除连接…",
  "settings.connections.removeConfirmLabel": "确认移除 {name}",
  "settings.connections.removeQuestion": "从此桌面端移除 {name}？",
  "settings.connections.removeLocal":
    "这会断开此桌面端与该远程主机的连接。主机不会停止，其会话会继续在该机器上运行。之后可以重新添加。",
  "settings.connections.removeCredential":
    "仅移除而不撤销访问权限，此桌面端的凭据会在主机上保持有效。请先撤销访问权限使其失效；该机器必须可连接。",
  "settings.connections.removeService":
    "要停止主机并关闭其后台服务，请在该机器上运行 <code>~/.natsu-host/bin/natsu-host service uninstall</code>（在 Windows 上运行 <code>%USERPROFILE%\\.natsu-host\\bin\\natsu-host.cmd service uninstall</code>）。其会话和历史记录会被保留。",
  "settings.connections.revokeAndRemove": "撤销访问并移除",
  "settings.connections.removeLocalOnly": "仅从此桌面端移除",
  "settings.connections.cancel": "取消",
  "settings.connections.sshTitle": "通过 SSH 连接",
  "settings.connections.sshAddress": "SSH 地址",
  "settings.connections.sshPlaceholder": "user@my-mac-mini 或 SSH 别名",
  "settings.connections.nameLabel": "名称",
  "settings.connections.optional": "（可选）",
  "settings.connections.namePlaceholder": "可选，例如 Home Mac mini",
  "settings.connections.advanced": "高级",
  "settings.connections.sshPort": "SSH 端口",
  "settings.connections.sshPortPlaceholder": "来自 SSH 配置",
  "settings.connections.setupNote":
    "Natsu 会安装并启动后台主机，然后建立安全连接，并自动使用 SSH 密钥和配置。请在主机上启用 SSH，并登录 Codex 或 Claude Code。在 Windows 和 Mac 上，请保持主机桌面账号处于登录状态，并保持机器唤醒。锁定桌面不影响使用。",
  "settings.connections.linuxNote":
    "在 Linux 上，设置会为当前账号安装 systemd 用户服务并开启 lingering 功能（<code>loginctl enable-linger</code>），这样即使退出登录，主机和其他用户服务也会继续运行。在没有 systemd 的环境中（例如许多容器和微型虚拟机），主机会改为以后台进程运行，并在重新连接时再次启动。主机会一直运行，直到你在该机器上将其停止；在此处移除只会断开此桌面的连接。",
  "settings.connections.connecting": "正在连接…",
  "settings.connections.connect": "连接",
  "settings.connections.startingConnection": "正在开始连接…",
  "settings.connections.passwordLabel": "SSH 密码或私钥口令",
  "settings.connections.trustAndContinue": "信任主机并继续",
  "settings.connections.continue": "继续",
  "settings.connections.reject": "拒绝",
  "settings.connections.cancelConnection": "取消连接",
  "settings.connections.byUrlSummary": "通过 URL 连接到现有主机",
  "settings.connections.hostUrl": "主机 URL",
  "settings.connections.deviceToken": "设备令牌",
  "settings.connections.connectByUrl": "通过 URL 连接",
  "settings.connections.updatedNotice": "{name} 已更新并重新连接。",
  "settings.connections.connectedNotice":
    "{name} 已连接。要使用它，请点击项目栏中“项目”旁的 +，然后选择“在远程主机上打开文件夹”。",
  "settings.connections.urlConnectedNotice": "{name} 已连接。",
  "settings.connections.revokeFailed":
    "无法撤销访问权限，因此未移除 {name}：{reason}。请重新连接后重试，或仅从此桌面移除，并在主机上使用 natsu-host devices 和 natsu-host revoke <device-id> 撤销访问权限。",
  "settings.connections.removedRevoked":
    "{name} 已移除，并已撤销此桌面端的访问权限。主机及其会话会继续运行。",
  "settings.connections.removedLocal":
    "{name} 已从此桌面端移除。主机及其会话会继续运行，并且它仍接受此桌面端的凭据。",
  "settings.connections.setup.checking": "正在检查远程主机…",
  "settings.connections.setup.updating": "正在更新远程主机上的 Natsu Host…",
  "settings.connections.setup.reconnecting": "正在重新连接远程主机…",
  "settings.connections.setup.installing": "正在安装或启动 Natsu Host…",
  "settings.connections.setup.pairing": "正在将此桌面端与主机配对…",
  "settings.connections.setup.opening": "正在建立安全连接…",
};
