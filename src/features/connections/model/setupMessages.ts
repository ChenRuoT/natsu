import type { MessageKey, TFunction } from "../../../shared/i18n/i18n";

/**
 * Progress lines the Rust side reports while it sets up a remote machine
 * (`job.message(...)` in remote.rs and remote_ssh.rs). The backend stays
 * language-agnostic; the UI translates the ones it knows and shows any other
 * text, such as an SSH prompt, as it came.
 */
const SETUP_MESSAGE_KEYS: Record<string, MessageKey> = {
  "Checking the remote machine…": "settings.connections.setup.checking",
  "Updating Natsu Host on the machine…": "settings.connections.setup.updating",
  "Reconnecting to the machine…": "settings.connections.setup.reconnecting",
  "Installing or starting Natsu Host…": "settings.connections.setup.installing",
  "Pairing this desktop with the host…": "settings.connections.setup.pairing",
  "Opening the secure connection…": "settings.connections.setup.opening",
};

export function setupMessage(message: string, t: TFunction): string {
  const key = Object.prototype.hasOwnProperty.call(SETUP_MESSAGE_KEYS, message)
    ? SETUP_MESSAGE_KEYS[message]
    : undefined;
  return key ? t(key) : message;
}
