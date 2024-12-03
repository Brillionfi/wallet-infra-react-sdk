import React, { ReactNode } from "react";
import { BrillionContext } from "./BrillionContext";
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
  const sdk = new WalletInfra(appId, baseUrl);
  return (
    <BrillionContext.Provider value={{ sdk }}>
      {children}
    </BrillionContext.Provider>
  );
};
