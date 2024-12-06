import { Address, ChainId } from "@brillionfi/wallet-infra-sdk";
import { IWalletPortfolio } from "@brillionfi/wallet-infra-sdk/dist/models";
import { useBrillionContext } from "components/BrillionContext";
import { useQuery } from "@tanstack/react-query";

export const useBalance = (address: Address, chainId: ChainId) => {
  const sdk = useBrillionContext();

  const balances = useQuery({
    queryKey: ["balances", chainId, address],
    queryFn: async () => {
      if (!chainId || !address)
        throw new Error("Missing chainId or address");

      const response = await sdk?.Wallet.getPortfolio(address, chainId);
      return response?.portfolio || []; 
    },
    enabled: !!chainId && !!address,
  });

  const getPortfolio = async (
    address: Address,
    chainId: ChainId,
  ): Promise<IWalletPortfolio | undefined> => {
    return await sdk?.Wallet.getPortfolio(address, chainId);
  };

  return {
    balances,
    getPortfolio
  }
};