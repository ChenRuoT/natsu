import { router, Stack, useNavigation, type NativeStackNavigationOptions } from "expo-router";
import { Platform } from "react-native";

import {
  HeaderButton,
  modalStackOptions,
  sheetScreenLayout,
} from "@/features/files/codeScreen";
import { androidBackHeader } from "@/ui/AndroidHeader";
import { useT } from "@/i18n/i18n";
import { ModalSheet } from "@/ui/ModalSheet";
import { useColors } from "@/ui/theme";

// In Android's sheet the header starts at the sheet's top edge, under its
// handle, not a status bar's height below it.
const SHEET_HEADER: NativeStackNavigationOptions =
  Platform.OS === "android"
    ? { unstable_nativeProps: { headerConfig: { disableTopInsetApplication: true } } }
    : {};

// The sheet's first page titled as iOS titles it: centred, with no way back.
const SHEET_ROOT: NativeStackNavigationOptions =
  Platform.OS === "android" ? { headerTitleAlign: "center", headerBackVisible: false } : {};

// A Mono's profile: a modal sheet with its own stack, as Settings, so editing
// its look pushes inside the sheet and the close button dismisses the lot.
export default function MonoProfileLayout() {
  const colors = useColors();
  const t = useT();
  // The root stack's, so closing dismisses the whole sheet from any page.
  const navigation = useNavigation();
  return (
    <ModalSheet onClose={() => navigation.goBack()}>
      <Stack
        screenOptions={{ ...modalStackOptions(colors), ...SHEET_HEADER }}
        screenLayout={sheetScreenLayout(colors.sheet)}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "",
            headerLeft: () => (
              <HeaderButton icon="close" label={t("app.monoProfileLayout.close")} round onPress={() => router.back()} />
            ),
          }}
        />
        {/* Opened on its own for a new Mono, Edit is the sheet's first page. */}
        <Stack.Screen
          name="edit"
          options={({ navigation }) => ({
            title: t("app.monoProfileLayout.edit"),
            ...(navigation.getState().index > 0
              ? androidBackHeader(t("app.monoProfileLayout.edit"))
              : SHEET_ROOT),
          })}
        />
        {/* A document and a habit title themselves once read. */}
        <Stack.Screen name="document" options={{ title: "" }} />
        <Stack.Screen
          name="documents"
          options={{
            title: t("app.monoProfileLayout.documents"),
            ...androidBackHeader(t("app.monoProfileLayout.documents")),
          }}
        />
        <Stack.Screen name="habit" options={{ title: "" }} />
        {/* The soul or memory editor names itself after the file. */}
        <Stack.Screen name="file" options={{ title: "" }} />
        <Stack.Screen
          name="model"
          options={{
            title: t("app.monoProfileLayout.model"),
            ...androidBackHeader(t("app.monoProfileLayout.model")),
          }}
        />
        <Stack.Screen
          name="model-options"
          options={{
            title: t("app.monoProfileLayout.options"),
            ...androidBackHeader(t("app.monoProfileLayout.options")),
          }}
        />
        <Stack.Screen
          name="subsessions"
          options={{
            title: t("app.monoProfileLayout.subsessions"),
            ...androidBackHeader(t("app.monoProfileLayout.subsessions")),
          }}
        />
        <Stack.Screen
          name="projects"
          options={{
            title: t("app.monoProfileLayout.projects"),
            ...androidBackHeader(t("app.monoProfileLayout.projects")),
          }}
        />
      </Stack>
    </ModalSheet>
  );
}
