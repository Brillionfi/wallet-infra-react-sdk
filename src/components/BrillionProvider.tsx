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
  defaultChain?: SUPPORTED_CHAINS;
  children: ReactNode;
};

export const BrillionProvider: React.FC<BrillionProviderProps> = ({
  appId,
  baseUrl,
  WCProjectId,
  defaultChain,
  children,
}) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [sdk, setSdk] = useState<WalletInfra | null>(null);
  const [chain, setChain] = useState<SUPPORTED_CHAINS>(SUPPORTED_CHAINS.ETHEREUM);
  const [wallet, setWallet] = useState<string>("");
  const [sessionInfo, setSessionInfo] = useState<Record<string,string>>({});
  const [walletConnectProjectId, setWalletConnectProjectId] = useState<string>("");

  useEffect(() => {
    if(!appId || !baseUrl) return;
    setSdk(new WalletInfra(appId, baseUrl));
    setIsReady(true);
  }, [appId, baseUrl]);

  useEffect(() => {
    if(WCProjectId) setWalletConnectProjectId(WCProjectId);
  }, [WCProjectId]);

  useEffect(() => {
    if(defaultChain) setChain(defaultChain ?? SUPPORTED_CHAINS.ETHEREUM);
  }, [defaultChain]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrillionContext.Provider value={{
        sdk, 
        walletConnectProjectId,
        isReady,
        chain,
        wallet,
        sessionInfo,
        changeChain: (chain: SUPPORTED_CHAINS) => setChain(chain),
        changeWallet: (wallet: string) => setWallet(wallet),
        setSessionInfo: (sessionInfo: Record<string, string>)=> setSessionInfo(sessionInfo)
      }}>
        {children}
      </BrillionContext.Provider>
    </QueryClientProvider>
  );
};
