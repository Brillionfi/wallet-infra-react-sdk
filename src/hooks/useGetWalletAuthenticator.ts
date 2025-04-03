import { useBrillionContext } from "@/components";
import { isEmptyObject } from "@/utils";
import { IWalletAuthenticatorResponse } from "@brillionfi/wallet-infra-sdk/dist/models";
import { useCallback, useEffect, useState } from "react";

export const useGetWalletAuthenticator = () => {
  const [walletAuthenticators, setWalletAuthenticators] = useState<IWalletAuthenticatorResponse["authenticators"]>([]);
  const [authenticators, setAuthenticators] = useState<IWalletAuthenticatorResponse["authenticators"]>([]);
  const [apiKeys, setApiKeys] = useState<IWalletAuthenticatorResponse["apiKeys"]>([]);
  const { sdk, isReady, sessionInfo } = useBrillionContext();

  const fetchWalletAuthenticators = useCallback(async () => {
    if (!sdk || !isReady || isEmptyObject(sessionInfo)) return;
        
    const credentials = await sdk.Wallet.getWalletAuthenticator();
    const apiKeys = credentials.apiKeys.map((apiKey) => ({
      credentialId: "",
      authenticatorId: apiKey.apiKeyId,
      authenticatorName: apiKey.apiKeyName,
      model: apiKey.credential.type,
    }));
    
    const walletAuthenticators: IWalletAuthenticatorResponse["authenticators"] =
    [...credentials.authenticators, ...apiKeys];
    
    setApiKeys(credentials.apiKeys);
    setAuthenticators(credentials.authenticators);
    setWalletAuthenticators(walletAuthenticators);
    return walletAuthenticators;
  }, [sdk, isReady, sessionInfo]);

  useEffect(() => {
    fetchWalletAuthenticators();
  }, [fetchWalletAuthenticators]);

  return {
    apiKeys,
    authenticators,
    walletAuthenticators,
    refetch: fetchWalletAuthenticators,
  };
};
