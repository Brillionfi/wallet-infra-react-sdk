import { useMemo } from "react";
import { env, getDomain } from "@/lib";
import {
  useWalletAuthenticator,
} from "@/providers";
import { ITransaction } from "@brillionfi/wallet-infra-sdk";
import { TransactionTypeActivityKeys } from "@brillionfi/wallet-infra-sdk/dist/models";
import { useBrillionContext } from "@/components";

export interface ISignWithPassKey
  extends Pick<ITransaction, "organizationId" | "fingerprint"> {
  type: TransactionTypeActivityKeys;
}

export const useApproveWalletAuthenticator = (props?: {
  onError: (message: string) => void;
}) => {
  const { getWalletAuthenticator, userWalletAuthenticators } =
    useWalletAuthenticator();
  const { sdk, isReady } = useBrillionContext();

  const hasWalletAuthenticator = useMemo(
    () => userWalletAuthenticators.length > 0,
    [userWalletAuthenticators],
  );

  const signWalletAuthenticator = async (approveData: ISignWithPassKey) => {
    if (!isReady || !sdk) {
      props?.onError("SDK not initialized");
      return;
    }

    try {
      const authenticator = await getWalletAuthenticator();

      if (!authenticator?.credentialId) {
        props?.onError("Authenticator not found");
        return;
      }

      const domain = getDomain(env.NEXT_PUBLIC_BASE_URL);
      let signTx;

      if (authenticator.id === "passkey") {
        signTx = await sdk.Transaction.signWithPasskey(
          authenticator.credentialId,
          approveData.organizationId,
          approveData.fingerprint,
          domain,
          approveData.type,
        );
      } else {
        signTx = await sdk.Transaction.signWithMnemonic(
          authenticator.credentialId,
          approveData.organizationId,
          approveData.fingerprint,
          approveData.type,
        );
      }

      return signTx;
    } catch (error) {
      console.error("signWalletAuthenticator: ", error);

      if ((error as Error).message.includes("NotAllowedError")) {
        props?.onError("The operation either timed out or was not allowed");
      } else {
        props?.onError("Sign transaction failed. Please try again.");
      }
    }
  };

  return {
    signWalletAuthenticator,
    hasWalletAuthenticator,
  };
};
