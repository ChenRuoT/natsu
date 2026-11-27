import { router, Stack } from "expo-router";

import {
  HeaderButton,
  modalStackOptions,
  sheetScreenLayout,
} from "@/features/files/codeScreen";
import { useT } from "@/i18n/i18n";
import { useColors } from "@/ui/theme";

// The project picker: a native modal with its own stack and header, as
// settings is, its search in the header.
export default function ProjectsLayout() {
  const colors = useColors();
  const t = useT();
  return (
    <Stack
      screenOptions={modalStackOptions(colors)}
      screenLayout={sheetScreenLayout(colors.sheet)}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("app.projectsLayout.title"),
          headerLeft: () => (
            <HeaderButton
              icon="close"
              label={t("app.projectsLayout.close")}
              onPress={() => router.back()}
            />
          ),
        }}
      />
    </Stack>
  );
}
