export const connections = {
  "settings.connections.heading": "Your machines",
  "settings.connections.intro":
    "Run agents on another computer and return to them from your laptop. The host keeps working when you close Natsu here.",
  "settings.connections.addMachine": "Add machine",
  "settings.connections.emptyState":
    "Add your always-on Windows, Mac, or Linux machine to get started.",
  "settings.connections.sshTarget": "SSH · {target}",
  "settings.connections.sshTargetPort": "SSH · {target} · port {port}",
  "settings.connections.status.checking": "Checking connection…",
  "settings.connections.status.connected": "Connected",
  "settings.connections.status.noProvider":
    "Connected · install a supported provider on the host",
  "settings.connections.status.updateNeeded":
    "Connected · host update needed for Explorer and Changes",
  "settings.connections.status.offline": "Offline · reconnect to check access",
  "settings.connections.updateNote":
    "Updating restarts the host and interrupts active agent turns.",
  "settings.connections.updateHostTitle":
    "Downloads the matching host package and restarts the host; active agent turns will be interrupted",
  "settings.connections.updateHost": "Update Host",
  "settings.connections.reconnect": "Reconnect",
  "settings.connections.removeLabel": "Remove {name}",
  "settings.connections.removeTitle": "Remove connection…",
  "settings.connections.removeConfirmLabel": "Confirm removing {name}",
  "settings.connections.removeQuestion": "Remove {name} from this desktop?",
  "settings.connections.removeLocal":
    "This closes this desktop’s connection to the machine. It does not stop the host, and its sessions keep running and stay on that machine. You can add it again later.",
  "settings.connections.removeCredential":
    "Removing alone leaves this desktop’s credential valid on the host. Revoke access to invalidate it first; the machine must be reachable.",
  "settings.connections.removeService":
    "To stop the host and turn off its background service, run <code>~/.natsu-host/bin/natsu-host service uninstall</code> on that machine (<code>%USERPROFILE%\\.natsu-host\\bin\\natsu-host.cmd service uninstall</code> on Windows). Its sessions and history are kept.",
  "settings.connections.revokeAndRemove": "Revoke access and remove",
  "settings.connections.removeLocalOnly": "Remove from this desktop only",
  "settings.connections.cancel": "Cancel",
  "settings.connections.sshTitle": "Connect through SSH",
  "settings.connections.sshAddress": "SSH address",
  "settings.connections.sshPlaceholder": "user@my-mac-mini or an SSH alias",
  "settings.connections.nameLabel": "Name",
  "settings.connections.optional": "(optional)",
  "settings.connections.namePlaceholder": "Optional, e.g. Home Mac mini",
  "settings.connections.advanced": "Advanced",
  "settings.connections.sshPort": "SSH port",
  "settings.connections.sshPortPlaceholder": "From SSH config",
  "settings.connections.setupNote":
    "Natsu installs and starts its background host, then connects securely. Your SSH keys and config are used automatically. Enable SSH on the host and sign in to Codex or Claude Code there. On Windows and Mac, keep the host’s desktop account signed in and the machine awake. Locking the desktop is fine.",
  "settings.connections.linuxNote":
    "On Linux, setup installs a systemd user service and turns on lingering for your account (<code>loginctl enable-linger</code>), so the host and your other user services keep running after you log out. Without systemd, as in many containers and microVMs, the host runs as a background process instead and is started again when you reconnect. The host keeps running until you stop it on that machine; removing it here only disconnects this desktop.",
  "settings.connections.connecting": "Connecting…",
  "settings.connections.connect": "Connect",
  "settings.connections.startingConnection": "Starting connection…",
  "settings.connections.passwordLabel": "SSH password or passphrase",
  "settings.connections.trustAndContinue": "Trust host and continue",
  "settings.connections.continue": "Continue",
  "settings.connections.reject": "Reject",
  "settings.connections.cancelConnection": "Cancel connection",
  "settings.connections.byUrlSummary": "Connect to an existing host by URL",
  "settings.connections.hostUrl": "Host URL",
  "settings.connections.deviceToken": "Device token",
  "settings.connections.connectByUrl": "Connect by URL",
  "settings.connections.updatedNotice": "{name} was updated and reconnected.",
  "settings.connections.connectedNotice":
    "{name} is connected. To work on it, click + next to Projects in the project rail and choose Open folder on a machine.",
  "settings.connections.urlConnectedNotice": "{name} is connected.",
  "settings.connections.revokeFailed":
    "Could not revoke access, so {name} was not removed: {reason}. Reconnect and try again, or remove it from this desktop only and revoke it on the host with natsu-host devices and natsu-host revoke <device-id>.",
  "settings.connections.removedRevoked":
    "{name} was removed and this desktop's access was revoked. The host and its sessions keep running.",
  "settings.connections.removedLocal":
    "{name} was removed from this desktop. The host and its sessions keep running, and it still accepts this desktop's credential.",
  "settings.connections.setup.checking": "Checking the remote machine…",
  "settings.connections.setup.updating": "Updating Natsu Host on the machine…",
  "settings.connections.setup.reconnecting": "Reconnecting to the machine…",
  "settings.connections.setup.installing": "Installing or starting Natsu Host…",
  "settings.connections.setup.pairing": "Pairing this desktop with the host…",
  "settings.connections.setup.opening": "Opening the secure connection…",
} as const;
