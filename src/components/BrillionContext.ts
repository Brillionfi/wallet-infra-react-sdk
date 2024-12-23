import { createContext, useContext } from "react";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";

export type BrillionContextType = {
  sdk: WalletInfra | null;
  walletConnectProjectId: string;
  isReady: boolean;
  chain: SUPPORTED_CHAINS;
  wallet: string;
  changeChain: (chain: SUPPORTED_CHAINS) => void;
  changeWallet: (wallet: string) => void;
};

export const BrillionContext = createContext<BrillionContextType>({
  sdk: null,
  walletConnectProjectId: "",
  isReady: false,
  chain: SUPPORTED_CHAINS.ETHEREUM,
  wallet: "",
  changeChain: () => {},
  changeWallet: () => {},
});

export const useBrillionContext = () => {
  return useContext(BrillionContext);
};
