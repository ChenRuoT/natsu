import { Button, Host, HStack, Menu, Spacer } from "@expo/ui/swift-ui";
import { accessibilityLabel, contentShape, frame, shapes } from "@expo/ui/swift-ui/modifiers";
import { Platform, StyleSheet, View } from "react-native";

import { useT } from "@/i18n/i18n";
import { ChoiceMenu } from "@/ui/ChoiceMenu";
import { Icon } from "@/ui/Icon";
import { LiquidView } from "@/ui/LiquidView";

const SIZE = 44;

/**
 * The round ⋯ button at the right of a Mono's header: a native menu to see
 * its details, start its conversation afresh, or delete it. The screen asks
 * before anything that can't be undone.
 */
export function MonoMenu({
  onDetails,
  onReset,
  onDelete,
}: {
  onDetails: () => void;
  onReset: () => void;
  onDelete: () => void;
}) {
  const t = useT();
  // The SwiftUI menu has no Android view, so Android lists the actions in a sheet.
  if (Platform.OS === "android") return (
    <ChoiceMenu label={t("sessions.monoMenu.more")} actions={[
      { label: t("sessions.monoMenu.viewDetails"), icon: "info", onPress: onDetails },
      { label: t("sessions.monoMenu.resetConversation"), icon: "refresh", onPress: onReset },
      { label: t("sessions.monoMenu.deleteMono"), icon: "trash", destructive: true, onPress: onDelete },
    ]}>
      <LiquidView borderRadius={SIZE / 2} innerStyle={styles.round}>
        <Icon name="more" size={20} />
      </LiquidView>
    </ChoiceMenu>
  );
  return (
    <View>
      <LiquidView borderRadius={SIZE / 2} innerStyle={styles.round}>
        <Icon name="more" size={20} />
      </LiquidView>
      {/* The native menu lies over the glass, its label an invisible box of
          the button's size, as in SessionFilterMenu. */}
      <Host style={StyleSheet.absoluteFill}>
        <Menu
          modifiers={[accessibilityLabel(t("sessions.monoMenu.more"))]}
          label={
            <HStack modifiers={[frame({ width: SIZE, height: SIZE }), contentShape(shapes.circle())]}>
              <Spacer />
            </HStack>
          }
        >
          <Button label={t("sessions.monoMenu.viewDetails")} systemImage="info.circle" onPress={onDetails} />
          <Button label={t("sessions.monoMenu.resetConversation")} systemImage="arrow.counterclockwise" onPress={onReset} />
          <Button label={t("sessions.monoMenu.deleteMono")} systemImage="trash" role="destructive" onPress={onDelete} />
        </Menu>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  round: {
    width: SIZE,
    height: SIZE,
  },
});
