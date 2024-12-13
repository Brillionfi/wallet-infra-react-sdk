import { ReactNode, useState, useEffect } from "react";
import { BrillionContext } from "./BrillionContext";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

const queryClient = new QueryClient();

type BrillionProviderProps = {
  appId: string;
  baseUrl: string;
  WCProjectId?: string;
  children: ReactNode;
};

export const BrillionProvider: React.FC<BrillionProviderProps> = ({
  appId,
  baseUrl,
  WCProjectId,
  children,
}) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [sdk, setSdk] = useState<WalletInfra | null>(null);
  const [chain, setChain] = useState<SUPPORTED_CHAINS>(SUPPORTED_CHAINS.ETHEREUM);
  const [walletConnectProjectId, setWalletConnectProjectId] = useState<string>("");

  useEffect(() => {
    if(!appId || !baseUrl) return;
    setSdk(new WalletInfra(appId, baseUrl));
    setIsReady(true);
  }, [appId, baseUrl]);

  useEffect(() => {
    if(WCProjectId) setWalletConnectProjectId(WCProjectId);
  }, [WCProjectId]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrillionContext.Provider value={{
        sdk, 
        walletConnectProjectId,
        isReady,
        chain,
        changeChain: (chain: SUPPORTED_CHAINS) => setChain(chain),
      }}>
        {children}
      </BrillionContext.Provider>
    </QueryClientProvider>
  );
};
