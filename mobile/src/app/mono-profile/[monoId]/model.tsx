import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { ModelList } from "@/features/models/ModelPicker";
import { monoConversationId } from "@/features/workspace/WorkspaceProvider";
import { useT } from "@/i18n/i18n";

// The Mono's model, picked from every provider's, pushed inside its profile
// rather than in a sheet of its own; searched from the header.
export default function MonoModelScreen() {
  const { monoId } = useLocalSearchParams<{ monoId: string }>();
  const [query, setQuery] = useState("");
  const t = useT();
  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: t("app.monoProfileModel.searchPlaceholder"),
            hideWhenScrolling: false,
            autoCapitalize: "none",
            onChangeText: (event) => setQuery(event.nativeEvent.text),
          },
        }}
      />
      <ModelList
        projectId=""
        sessionId={monoConversationId(monoId)}
        query={query}
        onOpenOptions={() =>
          router.push({ pathname: "/mono-profile/[monoId]/model-options", params: { monoId } })
        }
      />
    </>
  );
}
