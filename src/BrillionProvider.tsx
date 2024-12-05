import { ReactNode, useState, useEffect } from "react";
import { BrillionContext, BrillionContextType } from "./BrillionContext";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";

type BrillionProviderProps = {
  appId: string;
  baseUrl: string;
  children: ReactNode;
};

export const BrillionProvider: React.FC<BrillionProviderProps> = ({
  appId,
  baseUrl,
  children,
}) => {
  const [sdk, setSdk] = useState<BrillionContextType>(null);
  useEffect(() => {
    const sdk = new WalletInfra(appId, baseUrl);
    setSdk(sdk);
  }, [appId, baseUrl]);
  return (
    <BrillionContext.Provider value={sdk}>{children}</BrillionContext.Provider>
  );
};
