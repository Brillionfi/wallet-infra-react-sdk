import { useMemo } from "react";
import {
  WALLET_AUTHENTICATOR_TYPE,
  walletAuthenticatorIcon,
} from "@/constants";
import { IWalletAuthenticatorOpt } from "@/interfaces";
import { capitalizeString } from "@/utils/string";
import { useGetWalletAuthenticator } from "./useGetWalletAuthenticator";

export const useWalletAuthenticatorOptions = () => {
  const { walletAuthenticators, authenticators, apiKeys, refetch } = useGetWalletAuthenticator();

  const walletAuthenticatorOpt: IWalletAuthenticatorOpt[] = useMemo(
    () => [
      {
        type: WALLET_AUTHENTICATOR_TYPE.PASSKEY,
        name: `Fingerprint (${WALLET_AUTHENTICATOR_TYPE.PASSKEY})`,
        icon: walletAuthenticatorIcon.passkey,
        disabled: authenticators.length >= 10,
      },
      {
        type: WALLET_AUTHENTICATOR_TYPE.MNEMONIC,
        name: capitalizeString(WALLET_AUTHENTICATOR_TYPE.MNEMONIC),
        icon: walletAuthenticatorIcon.mnemonic,
        disabled: (apiKeys.length ?? 0) >= 10,
      },
    ],
    [
      authenticators.length,
      apiKeys.length,
    ],
  );

  const userWalletAuthenticators: IWalletAuthenticatorOpt[] = useMemo(() => {
    return (
      walletAuthenticators.map((authenticator) => {
        const authenticatorType = authenticator.model.includes("Security key")
          ? WALLET_AUTHENTICATOR_TYPE.PASSKEY
          : WALLET_AUTHENTICATOR_TYPE.MNEMONIC;
        const authenticatorOpt = walletAuthenticatorOpt.find(
          (opt) => opt.type === authenticatorType,
        );
        return {
          type: authenticatorType,
          name: authenticatorOpt?.name ?? capitalizeString(authenticatorType),
          icon: authenticatorOpt?.icon ?? walletAuthenticatorIcon.passkey,
          authenticatorId: authenticator.authenticatorId,
          authenticatorName: authenticator.authenticatorName,
          credentialId: authenticator.credentialId,
        };
      }) ?? []
    );
  }, [walletAuthenticators, walletAuthenticatorOpt]);

  return {
    walletAuthenticatorOpt,
    userWalletAuthenticators,
    disabledCreateAuthenticator: walletAuthenticatorOpt.every(
      (authenticatorOpt) => authenticatorOpt.disabled,
    ),
    refetch,
  };
};
