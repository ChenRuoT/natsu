import { router, useLocalSearchParams, useNavigationContainerRef } from "expo-router";
import { Fragment, useState } from "react";
import { Alert, Linking, StyleSheet, Switch, Text, View } from "react-native";

import { useT } from "@/i18n/i18n";
import { richText } from "@/i18n/rich";
import { useConnection } from "@/features/connection/ConnectionProvider";
import { MONOS_ENABLED } from "@/features/connection/selection";
import { useNotificationsBlocked } from "@/features/notifications/SessionNotifications";
import { useAppearancePreference } from "@/features/settings/appearance";
import { accessMode } from "@/features/models/access";
import {
  useDefaultModel,
  useDefaultRuntimeMode,
} from "@/features/settings/defaultModel";
import {
  NOTIFICATION_CATEGORIES,
  useNotificationPreferences,
  type NotificationCategory,
} from "@/features/settings/notifications";
import { useOpenSessionAfterStarting } from "@/features/settings/newSessions";
import { useChangeLayout, useMonoOnlyLayout } from "@/features/settings/monoOnly";
import { SettingsPage, SettingsRow } from "@/features/settings/SettingsUI";
import { projectForRoute } from "@/features/workspace/routing";
import { useWorkspace } from "@/features/workspace/WorkspaceProvider";
import { Icon, type IconName } from "@/ui/Icon";
import { radii, themedStyles, THEMES, useColors, useTheme } from "@/ui/theme";

const CATEGORY_ICONS: Record<NotificationCategory, IconName> = {
  agentInput: "lock",
  agentFinished: "check",
  monoMessages: "chat",
};

export default function SettingsScreen() {
  const colors = useColors();
  const styles = useStyles();
  const t = useT();
  // The project open under settings, whose chat background it sets.
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const project = projectForRoute(useWorkspace().projects, projectId);
  const [appearance] = useAppearancePreference();
  const theme = THEMES[useTheme()].label;
  const defaultModel = useDefaultModel();
  const defaultAccess = useDefaultRuntimeMode();
  const notifications = useNotificationPreferences();
  const [openAfterStarting, setOpenAfterStarting] = useOpenSessionAfterStarting();
  const blocked = useNotificationsBlocked();
  const [monoOnly] = useMonoOnlyLayout();
  const navigation = useNavigationContainerRef();
  const switchLayout = useChangeLayout();
  // The layouts go about the app differently, so settings closes, and the
  // app starts again from the top in the new one under the loading cover:
  // the list of Monos, or back where the user last was.
  // The switch shows the pick at once, as the sheet slides away with it.
  const [picked, setPicked] = useState<boolean | null>(null);
  const changeLayout = (next: boolean) => {
    setPicked(next);
    switchLayout(next, {
      close: () => router.back(),
      reset: () => navigation.reset({ index: 0, routes: [{ name: "index" }] }),
    });
  };
  // Both pages act on the project open under settings.
  const params = project ? { projectId: project.id } : {};
  const connection = useConnection();
  const selected = connection.selection;
  const disconnect = () =>
    Alert.alert(
      t("app.settingsIndex.disconnectTitle"),
      t("app.settingsIndex.disconnectMessage"),
      [
        { text: t("app.settingsIndex.cancel"), style: "cancel" },
        {
          text: t("app.settingsIndex.disconnect"),
          style: "destructive",
          onPress: () => {
            void connection
              .disconnect()
              .then(() => router.replace("/"))
              .catch((reason) =>
                Alert.alert(t("app.settingsIndex.disconnectFailedTitle"), String(reason)),
              );
          },
        },
      ],
    );
  return (
    <SettingsPage>
      <View style={styles.desktop}>
        <Icon
          name={connection.connected ? "computer" : "computerOff"}
          size={22}
          color={connection.connected ? colors.content : colors.muted}
        />
        <View style={styles.desktopText}>
          <Text style={styles.desktopName} numberOfLines={1}>
            {connection.pairing?.desktop.name}
          </Text>
          <Text style={styles.desktopStatus}>
            {connection.connected
              ? t("app.settingsIndex.desktopConnected")
              : t("app.settingsIndex.desktopUnavailable")}
          </Text>
        </View>
      </View>

      <Text style={styles.heading}>{t("app.settingsIndex.notificationsHeading")}</Text>
      <View style={styles.card}>
        {NOTIFICATION_CATEGORIES.map((category, index) => (
          <Fragment key={category.id}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <SettingsRow
              icon={CATEGORY_ICONS[category.id]}
              label={t(category.labelKey)}
              onPress={() =>
                notifications.setEnabled(
                  category.id,
                  !notifications.enabled(category.id),
                )
              }
              accessory={
                <Switch
                  value={notifications.enabled(category.id)}
                  onValueChange={(on) =>
                    notifications.setEnabled(category.id, on)
                  }
                  trackColor={{ true: colors.accent }}
                />
              }
            />
          </Fragment>
        ))}
      </View>
      {blocked ? (
        <Text style={styles.note} onPress={() => void Linking.openSettings()}>
          {richText(t("app.settingsIndex.blockedNote"), {
            link: (chunk) => <Text style={{ color: colors.accent }}>{chunk}</Text>,
          })}
        </Text>
      ) : null}

      <Text style={styles.heading}>{t("app.settingsIndex.preferencesHeading")}</Text>
      <View style={styles.card}>
        <SettingsRow
          icon="appearance"
          label={t("app.settingsIndex.appearanceLabel")}
          value={
            appearance === "system"
              ? theme
              : t("app.settingsIndex.themeAndScheme", {
                  theme,
                  scheme: t(
                    appearance === "light"
                      ? "app.settingsIndex.schemeLight"
                      : "app.settingsIndex.schemeDark",
                  ),
                })
          }
          onPress={() =>
            router.push({ pathname: "/settings/appearance", params })
          }
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="robot"
          label={t("app.settingsIndex.providersLabel")}
          value={defaultModel?.name ?? t("app.settingsIndex.desktopDefault")}
          onPress={() =>
            router.push({ pathname: "/settings/providers", params })
          }
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="lock"
          label={t("app.settingsIndex.permissionsLabel")}
          value={
            defaultAccess
              ? t(accessMode(defaultAccess).labelKey)
              : t("app.settingsIndex.desktopDefault")
          }
          onPress={() =>
            router.push({ pathname: "/settings/permissions", params })
          }
        />
      </View>

      <Text style={styles.heading}>{t("app.settingsIndex.newSessionsHeading")}</Text>
      <View style={styles.card}>
        <SettingsRow
          icon="chat"
          label={t("app.settingsIndex.openAfterStartingLabel")}
          onPress={() => setOpenAfterStarting(!openAfterStarting)}
          accessory={
            <Switch
              accessibilityLabel={t("app.settingsIndex.openAfterStartingA11y")}
              value={openAfterStarting}
              onValueChange={setOpenAfterStarting}
              trackColor={{ true: colors.accent }}
            />
          }
        />
      </View>
      <Text style={styles.note}>
        {t("app.settingsIndex.openAfterStartingNote")}
      </Text>

      {MONOS_ENABLED ? (
        <>
          <Text style={styles.heading}>{t("app.settingsIndex.layoutHeading")}</Text>
          <View style={styles.card}>
            <SettingsRow
              icon="chat"
              label={t("app.settingsIndex.monosOnly")}
              onPress={() => changeLayout(!(picked ?? monoOnly))}
              accessory={
                <Switch
                  accessibilityLabel={t("app.settingsIndex.monosOnly")}
                  value={picked ?? monoOnly}
                  onValueChange={changeLayout}
                  trackColor={{ true: colors.accent }}
                />
              }
            />
          </View>
          <Text style={styles.note}>
            {t("app.settingsIndex.monosOnlyNote")}
          </Text>
        </>
      ) : null}

      <Text style={styles.heading}>{t("app.settingsIndex.workspaceHeading")}</Text>
      <View style={styles.card}>
        <SettingsRow
          icon="folder"
          label={
            MONOS_ENABLED
              ? t("app.settingsIndex.projectsAndMonos")
              : t("app.settingsIndex.projects")
          }
          value={String(
            (selected?.projectIds.length ?? 0) +
              (MONOS_ENABLED ? (selected?.monoIds.length ?? 0) : 0),
          )}
          onPress={() => router.push("/settings/workspace")}
        />
        <View style={styles.divider} />
        <SettingsRow
          icon="computer"
          label={t("app.settingsIndex.reconnect")}
          showChevron={false}
          onPress={() => void connection.refresh()}
        />
      </View>

      <View style={[styles.card, styles.lastCard]}>
        <SettingsRow
          icon="computerOff"
          label={t("app.settingsIndex.disconnectDesktop")}
          showChevron={false}
          destructive
          onPress={disconnect}
        />
      </View>

      {connection.error ? (
        <Text style={styles.error}>{connection.error}</Text>
      ) : null}
    </SettingsPage>
  );
}

const useStyles = themedStyles((colors) => ({
  desktop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: radii.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.stroke,
    backgroundColor: colors.surface,
  },
  desktopText: {
    flex: 1,
    gap: 2,
  },
  desktopName: {
    color: colors.content,
    fontSize: 17,
    fontWeight: "600",
  },
  desktopStatus: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  // Grouped as iOS settings are: a muted heading over a rounded card.
  heading: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderCurve: "continuous",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  // Inset to the rows' labels, past their icons.
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 40,
    backgroundColor: colors.stroke,
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    marginHorizontal: 16,
  },
  lastCard: {
    marginTop: 24,
  },
  error: {
    color: colors.deletions,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16,
  },
}));
