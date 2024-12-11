import { Address, ChainId } from "@brillionfi/wallet-infra-sdk";
import { IWalletPortfolio } from "@brillionfi/wallet-infra-sdk/dist/models";
import { useQuery } from "@tanstack/react-query";
import { useBrillionContext } from "components/BrillionContext";

export const useBalance = (address?: Address, chainId?: ChainId) => {
  const { sdk } = useBrillionContext();

  const balances = useQuery({
    queryKey: ["balances", chainId, address],
    queryFn: async () => {
      if (!chainId || !address) throw new Error("Missing chainId or address");
      if (!sdk) {
        throw new Error("AppId is not valid");
      }

      const response = await sdk.Wallet.getPortfolio(address, chainId);
      return response?.portfolio || [];
    },
    enabled: !!chainId && !!address,
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
