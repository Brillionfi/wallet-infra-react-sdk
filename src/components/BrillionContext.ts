import { createContext, useContext } from "react";
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models";
import MetaMaskSDK from "@metamask/sdk";

export type BrillionContextType = {
  sdk: WalletInfra | null;
  walletConnectProjectId: string;
  isReady: boolean;
  chain: SUPPORTED_CHAINS;
  wallet: string;
  sessionInfo: Record<string, string>;
  sdkMM: MetaMaskSDK | null;
  saveSessionInfo: (payload: Record<string, string>) => void;
  changeChain: (chain: SUPPORTED_CHAINS) => void;
  changeWallet: (wallet: string) => void;
};

export const BrillionContext = createContext<BrillionContextType>({
  sdk: null,
  walletConnectProjectId: "",
  isReady: false,
  chain: SUPPORTED_CHAINS.ETHEREUM,
  wallet: "",
  sessionInfo: {},
  sdkMM: null,
  saveSessionInfo: () => {},
  changeChain: () => {},
  changeWallet: () => {},
});

export const useBrillionContext = () => {
  return useContext(BrillionContext);
};
