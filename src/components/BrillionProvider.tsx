import { ReactNode, useState, useEffect } from "react";
import { BrillionContext } from "./BrillionContext";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";

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
  const [sdk, setSdk] = useState<WalletInfra | null>(null);
  const [walletConnectProjectId, setWalletConnectProjectId] = useState<string>("");

  useEffect(() => {
    const sdk = new WalletInfra(appId, baseUrl);
    setSdk(sdk);
  }, [appId, baseUrl]);

  useEffect(() => {
    if(WCProjectId) setWalletConnectProjectId(WCProjectId);
  }, [WCProjectId]);

  return (
    <BrillionContext.Provider value={{
      sdk, 
      walletConnectProjectId
    }}>
      {children}
    </BrillionContext.Provider>
  );
};
