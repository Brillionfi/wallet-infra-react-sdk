import { Address, ChainId } from "@brillionfi/wallet-infra-sdk";
import { IWalletPortfolio } from "@brillionfi/wallet-infra-sdk/dist/models";
import { useQuery } from "@tanstack/react-query";
import { useBrillionContext } from "components/BrillionContext";

export const useBalance = () => {
  const { sdk, wallet, chain } = useBrillionContext();

  const balances = useQuery({
    queryKey: ["balances", chain, wallet],
    queryFn: async () => {
      if (!chain || !wallet) throw new Error("Missing chain or wallet");
      if (!sdk) {
        throw new Error("AppId is not valid");
      }

      const response = await sdk.Wallet.getPortfolio(wallet, chain);
      return response?.portfolio || [];
    },
    enabled: !!chain && !!wallet,
  });

  const getBalances = async (address: Address, chainId: ChainId) => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    const response = await sdk.Wallet.getPortfolio(address, chainId);
    return response?.portfolio || [];
  };

  const getPortfolio = async (
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletPortfolio | undefined> => {
    if (!sdk) {
      throw new Error("AppId is not valid");
    }
    return await sdk.Wallet.getPortfolio(address, chainId);
  };

  return {
    balances,
    getBalances,
    getPortfolio,
  };
};
