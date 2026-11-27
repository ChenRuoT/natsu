import { useCallback, useEffect, useState } from "react";
import { loginHarness } from "../../../integrations/harness/core/auth";
import { t as tNow, useT } from "../../../shared/i18n/i18n";
import { HARNESS_TITLE, type HarnessId } from "../model/session";
import { Modal } from "../../../shared/ui/Modal";
import {
  ProviderSignInPanel,
  type ProviderSignInState,
} from "./ProviderSignInPanel";

type Props = {
  harness: HarnessId;
  onClose: () => void;
};

export function ProviderSignInDialog({ harness, onClose }: Props) {
  const t = useT();
  const [state, setState] = useState<ProviderSignInState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setState("idle");
    setError(null);
  }, [harness]);

  const signIn = useCallback(() => {
    setState("running");
    setError(null);
    void loginHarness(harness).then(
      () => setState("complete"),
      (reason: unknown) => {
        setState("error");
        setError(
          reason instanceof Error
            ? reason.message
            : tNow("sessions.providerSignInDialog.couldNotSignIn", {
                provider: HARNESS_TITLE[harness],
              }),
        );
      },
    );
  }, [harness]);

  return (
    <Modal
      onClose={onClose}
      title={t("sessions.providerSignInDialog.authRequired")}
      description={t("sessions.providerSignInDialog.signInHint", {
        provider: HARNESS_TITLE[harness],
      })}
      size="sm"
      minimalHeader
    >
      <ProviderSignInPanel
        harness={harness}
        state={state}
        error={error}
        onSignIn={signIn}
        onComplete={onClose}
        completeActionLabel={t("sessions.providerSignInDialog.continue")}
        autoFocus
      />
    </Modal>
  );
}
