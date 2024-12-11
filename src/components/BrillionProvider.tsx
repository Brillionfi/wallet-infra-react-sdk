import { ReactNode, useState, useEffect } from "react";
import { BrillionContext } from "./BrillionContext";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
        isReady
      }}>
        {children}
      </BrillionContext.Provider>
    </QueryClientProvider>
  );
};
