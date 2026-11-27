import { router, Stack } from "expo-router";

import {
  HeaderButton,
  modalStackOptions,
  sheetScreenLayout,
} from "@/features/files/codeScreen";
import { useT } from "@/i18n/i18n";
import { useColors } from "@/ui/theme";

// The model picker: a native modal with its own stack, so the options push
// inside it and the close button dismisses the lot.
export default function ModelsLayout() {
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
          title: t("app.modelsLayout.modelTitle"),
          headerLeft: () => (
            <HeaderButton
              icon="close"
              label={t("app.modelsLayout.close")}
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <Stack.Screen name="options" options={{ title: t("app.modelsLayout.optionsTitle") }} />
    </Stack>
  );
}
