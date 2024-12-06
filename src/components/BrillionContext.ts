import { createContext, useContext } from "react";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";

export type BrillionContextType = WalletInfra | null;

export const BrillionContext = createContext<BrillionContextType | null>(null);

export const useBrillionContext = () => {
  return useContext(BrillionContext);
};
