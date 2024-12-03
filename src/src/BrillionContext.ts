import { createContext, useContext } from "react";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";

type BrillionContextType = {
  sdk: WalletInfra;
};

export const BrillionContext = createContext<BrillionContextType | null>(null);

export const useBrillionContext = () => {
  const context = useContext(BrillionContext);
  if (!context) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  return context;
};
