import { ReactNode, useState, useEffect } from "react";
import { BrillionContext } from "./BrillionContext";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";
import MetaMaskSDK from "@metamask/sdk";
import { Core } from "@walletconnect/core";
import Client, { WalletKit } from "@reown/walletkit";
import { PromptData } from "./WalletConnectPopUp/WalletConnectPopUpStyles";
import { WalletConnectPopUp } from "./WalletConnectPopUp/WalletConnectPopUp";

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
  const [sdkMM, setSdkMM] = useState<MetaMaskSDK | null>(null);
  const [wcClient, setWcClient] = useState<Client | null>(null)
  const [showWCPrompt, setShowWCPrompt] = useState<PromptData | null>(null)
  
  const [chain, setChain] = useState<SUPPORTED_CHAINS>(SUPPORTED_CHAINS.ETHEREUM);
  const [wallet, setWallet] = useState<string>("");
  const [signer, setSigner] = useState<string>("");
  const [sessionInfo, setSessionInfo] = useState<Record<string,string>>({});
  const [walletConnectProjectId, setWalletConnectProjectId] = useState<string>("");

  useEffect(() => {
    if(!appId || !baseUrl) return;
    setSdk(new WalletInfra(appId, baseUrl));
    setIsReady(true);
  }, [appId, baseUrl]);

  useEffect(() => {
    const init = async () => {
      const core = new Core({
        projectId: WCProjectId,
      });
      
      setWcClient(await WalletKit.init({
        core,
        metadata: {
          name: 'Brillion',
          description: 'Brillion Wallet',
          url: 'https://brillion.finance',
          icons: [''], // TODO add brillion icon
        },
      }))
    }

    if(WCProjectId) {
      setWalletConnectProjectId(WCProjectId)
      void init();
    }
  }, [WCProjectId]);

  useEffect(() => {
    if(defaultChain) setChain(defaultChain ?? SUPPORTED_CHAINS.ETHEREUM);
  }, [defaultChain]);

  const changeChain = async (chain: SUPPORTED_CHAINS) => {
    if(sessionInfo.loggedInVia === AuthProvider.METAMASK){
      if(!sdkMM) throw new Error('MetaMask is not connected');
      const ethereum = sdkMM.getProvider(); 
      if (!ethereum) {
        throw new Error('No MetaMask provider found');
      }
      ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(chain).toString(16)}` }],
      })
    }
    setChain(chain)
  }

  const saveSessionInfo = (sessionInfo: Record<string, string>) => {
    if(sessionInfo.loggedInVia === AuthProvider.METAMASK && !sdkMM){
      const mmSDK = new MetaMaskSDK();
      void mmSDK.connect();
      setSdkMM(mmSDK);
    }
    setSessionInfo(sessionInfo)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrillionContext.Provider value={{
        sdk, 
        walletConnectProjectId,
        wcClient,
        isReady,
        chain,
        wallet,
        signer,
        sessionInfo,
        sdkMM,
        changeChain,
        changeWallet: (wallet: string) => setWallet(wallet),
        changeSigner: (signer: string) => setSigner(signer),
        saveSessionInfo,
        showWCPrompt: (data: PromptData) => setShowWCPrompt(data)
      }}>
        {children}
        {showWCPrompt && <WalletConnectPopUp data={showWCPrompt} afterApproval={()=>setShowWCPrompt(null)}/>}
      </BrillionContext.Provider>
    </QueryClientProvider>
  );
};
