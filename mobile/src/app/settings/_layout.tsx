import { router, Stack } from "expo-router";

import {
  HeaderButton,
  modalStackOptions,
  sheetScreenLayout,
} from "@/features/files/codeScreen";
import { MONOS_ENABLED } from "@/features/connection/selection";
import { androidBackHeader } from "@/ui/AndroidHeader";
import { useT } from "@/i18n/i18n";
import { useColors } from "@/ui/theme";

// Settings: a native modal with its own stack, so its pages push inside the
// sheet and the close button dismisses the lot.
export default function SettingsLayout() {
  const colors = useColors();
  const t = useT();
  const workspaceTitle = MONOS_ENABLED
    ? t("app.settingsLayout.projectsAndMonosTitle")
    : t("app.settingsLayout.projectsTitle");
  return (
    <Stack
      screenOptions={modalStackOptions(colors)}
      screenLayout={sheetScreenLayout(colors.sheet)}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("app.settingsLayout.settingsTitle"),
          headerLeft: () => (
            <HeaderButton
              icon="close"
              label={t("app.settingsLayout.close")}
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="appearance"
        options={{
          title: t("app.settingsLayout.appearanceTitle"),
          ...androidBackHeader(t("app.settingsLayout.appearanceTitle")),
        }}
      />
      <Stack.Screen
        name="providers"
        options={{
          title: t("app.settingsLayout.providersTitle"),
          ...androidBackHeader(t("app.settingsLayout.providersTitle")),
        }}
      />
      <Stack.Screen
        name="permissions"
        options={{
          title: t("app.settingsLayout.permissionsTitle"),
          ...androidBackHeader(t("app.settingsLayout.permissionsTitle")),
        }}
      />
      {/* The provider's models title themselves. */}
      <Stack.Screen name="models" options={{ title: "" }} />
      <Stack.Screen
        name="workspace"
        options={{
          title: workspaceTitle,
          ...androidBackHeader(workspaceTitle),
        }}
      />
    </Stack>
  );
}
