import { createContext, useContext } from "react";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";

export type BrillionContextType = {
  sdk: WalletInfra | null;
  walletConnectProjectId: string;
};

export const BrillionContext = createContext<BrillionContextType>({
  sdk: null,
  walletConnectProjectId: "",
});

export const useBrillionContext = () => {
  return useContext(BrillionContext);
};
